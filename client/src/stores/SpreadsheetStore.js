import { Observable, CellReferenceError } from "./utils";

const cellRegex = /^([A-Za-z]+)(\d+)$/;

// TODO: Use Cell ID?
const getCellValue = (cellPosition, spreadsheet) => {
  const match = cellRegex.exec(cellPosition);
  if (!match) {
    throw new CellReferenceError(cellPosition);
  }

  const [, column, rowNumber] = match;
  const cellRow = spreadsheet.getRow(rowNumber);

  if (!cellRow || !spreadsheet.columns.includes(column)) {
    throw new CellReferenceError(cellPosition);
  }

  const cell = cellRow[column];
  return cell ? cell.value : 0;
};

const addResolver = {
  parse(expression) {
    return expression.split("+");
  },

  evaluate(values) {
    return values.reduce((result, value) => result + value, 0);
  },
};

const multiplyResolver = {
  parse(expression) {
    return expression.split("*");
  },
  evaluate(values) {
    return values.reduce((result, value) => result * value, 1);
  },
};

const cellResolver = {
  parse(expression) {
    return expression;
  },
  evaluate(value, context) {
    // NOTE: This assumes that value can only be a number or a cell reference
    const maybeNumber = +value;
    if (Number.isNaN(maybeNumber)) {
      const upperCaseValue = value.toUpperCase().trim();
      if (value === context.cellPosition) {
        throw new CellReferenceError(value);
      }
      const cellValue = getCellValue(upperCaseValue, context.spreadsheet);
      context.addDependency(upperCaseValue);
      return cellValue;
    }

    return value;
  },
};

const defaultResolvers = [addResolver, multiplyResolver, cellResolver];

const resolve = (expression, context, resolvers = defaultResolvers) => {
  const [currentResolver, ...nextResolvers] = resolvers;
  const parts = currentResolver.parse(expression, context);
  const values =
    nextResolvers.length > 0
      ? parts.map((part) => resolve(part, context, nextResolvers))
      : parts;
  return currentResolver.evaluate(values, context);
};

const resolveCellFunction = (rawValue, context) => {
  try {
    const expression = rawValue.slice(1);
    return resolve(expression, context);
  } catch (error) {
    if (error instanceof CellReferenceError) {
      return `#ReferenceError: ${error.cell}`;
    } else {
      throw error;
    }
  }
};

const parseRawValue = (rawValue, context) => {
  if (!rawValue) {
    return "";
  }

  const maybeNumber = +rawValue;
  if (!Number.isNaN(maybeNumber)) {
    return maybeNumber;
  }

  if (typeof rawValue === "string" && rawValue.startsWith("=")) {
    return resolveCellFunction(rawValue, context);
  }

  return "#TypeError";
};

const parseCellValue = (rawValue, cellPosition, spreadsheet) => {
  const dependencies = [];
  const addDependency = (dependency) => {
    dependencies.push(dependency);
  };
  const context = { spreadsheet, addDependency, cellPosition };

  const value = parseRawValue(rawValue, context);
  return { value, dependencies };
};

const getLabel = (index, label = "") => {
  if (index < 0) {
    return label;
  }

  return getLabel(
    Math.floor(index / 26) - 1,
    `${String.fromCharCode(65 + (index % 26))}${label}`
  );
};

const getColumnsLabels = (numOfColumns) => {
  return new Array(numOfColumns).fill(1).map((_, index) => {
    return getLabel(index);
  });
};

class SpreadsheetStore {
  constructor({ numOfColumns = 10, numOfRows = 10 }) {
    this.rows = new Array(numOfRows)
      .fill(1)
      .map((_, i) => ({ id: `Row#${i}` }));
    this.columns = getColumnsLabels(numOfColumns);
    this._cellsObservables = {};
    this._listeners = {};
  }

  observeCell(rowNumber, column) {
    const cellPosition = `${column}${rowNumber}`;
    const cellObservable = this._cellsObservables[cellPosition];
    if (cellObservable) {
      return cellObservable;
    }

    const cell = this.getRow(rowNumber)[column];

    const createdObservable = new Observable(cell);
    this._cellsObservables[cellPosition] = createdObservable;
    return createdObservable;
  }

  updateCellValue(rowNumber, column, newRawValue) {
    const row = this.getRow(rowNumber);
    const cell = this._getOrCreateCell(row, column);
    const cellPosition = `${column}${rowNumber}`;

    if (cell.rawValue === newRawValue) {
      return;
    }

    const { value: cellValue, dependencies } = parseCellValue(
      newRawValue,
      cellPosition,
      this
    );

    this._updateDependencies(cellPosition, dependencies, cell._dependencies);

    if (cell.value !== cellValue || cell.rawValue !== newRawValue) {
      cell.rawValue = newRawValue;
      cell.value = cellValue;
      cell._dependencies = dependencies;

      this._notifyChange(cellPosition, cell);
    }
  }

  getRow(rowNumber) {
    return this.rows[rowNumber - 1];
  }

  _getOrCreateCell(row, column) {
    const cell = row[column];
    if (cell) {
      return cell;
    }

    const newCell = {};
    row[column] = newCell;
    return newCell;
  }

  _recalculateRawValue(cellPosition) {
    const [, column, rowNumber] = cellRegex.exec(cellPosition);
    const cell = this.getRow(rowNumber)[column];
    const { value: cellValue } = parseCellValue(
      cell.rawValue,
      cellPosition,
      this
    );

    if (cellValue !== cell.value) {
      cell.value = cellValue;
      this._notifyChange(cellPosition, cell);
    }
  }

  _notifyChange(cellPosition, cell) {
    this._notifyDependencyListeners(cellPosition);
    this._notifySubscribers(cellPosition, cell);
  }

  _notifySubscribers(cellPosition, cell) {
    const cellObservable = this._cellsObservables[cellPosition];
    if (cellObservable) {
      cellObservable.next(cell);
    }
  }

  _updateDependencies(
    cellPosition,
    dependencies = [],
    previousDependencies = []
  ) {
    dependencies.forEach((dependency) => {
      if (!previousDependencies.includes(dependency)) {
        this._addDependencyListener(dependency, cellPosition);
      }
    });

    previousDependencies.forEach((dependency) => {
      if (!dependencies.includes(dependency)) {
        this._removeDependencyListener(dependency, cellPosition);
      }
    });
  }

  _notifyDependencyListeners(cellPosition) {
    const listeners = this._listeners[cellPosition];
    if (listeners) {
      listeners.forEach((listener) => {
        this._recalculateRawValue(listener);
      });
    }
  }

  _addDependencyListener(cellPosition, listener) {
    const listeners = this._listeners[cellPosition];
    if (listeners) {
      listeners.push(listener);
    } else {
      this._listeners[cellPosition] = [listener];
    }
  }

  _removeDependencyListener(cellPosition, listener) {
    const listeners = this._listeners[cellPosition];
    if (listeners) {
      const listenerIndex = listeners.indexOf(listener);
      listeners.splice(listenerIndex, 1);
    }
  }
}

export default SpreadsheetStore;
