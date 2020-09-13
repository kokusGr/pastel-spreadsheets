class Observable {
  constructor(initialValue) {
    this._value = initialValue;
    this._observers = [];
  }

  subscribe(observer) {
    observer(this._value);
    const observerIndex = this._observers.push(observer) - 1;
    return () => {
      this._unsubscribe(observerIndex);
    };
  }

  next(value) {
    this._value = value;
    this._notify();
  }

  _unsubscribe(observerIndex) {
    this._observers.splice(observerIndex, 1);
  }

  _notify() {
    this._observers.forEach((observer) => {
      observer(this._value);
    });
  }
}

class CellReferenceError extends Error {
  constructor(cell) {
    super(`Referenced Cell "${cell}" does not exist`);
    this.cell = cell;
  }
}

const cellRegex = /([A-Za-z]+)(\d+)/;

// TODO: Use Cell ID?
const getCellValue = (cellPosition, spreadsheet) => {
  const [, column, rowNumber] = cellRegex.exec(cellPosition);
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
      const upperCaseValue = value.toUpperCase();
      context.addDependency(upperCaseValue);
      return getCellValue(upperCaseValue, context.spreadsheet);
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

const parseCellValue = (rawValue, spreadsheet) => {
  const dependencies = [];
  const addDependency = (dependency) => {
    dependencies.push(dependency);
  };
  const context = { spreadsheet, addDependency };

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

class Spreadsheet {
  constructor({ numOfColumns = 10, numOfRows = 10 }) {
    this.rows = new Array(numOfRows)
      .fill(1)
      .map((_, i) => ({ id: `Row#${i}` }));
    this.columns = getColumnsLabels(numOfColumns);
    this._cellsObservables = {};
    this._listeners = {};
  }

  observeCellValue(rowNumber, column) {
    const cellPosition = `${column}${rowNumber}`;
    const cellObservable = this._cellsObservables[cellPosition];
    if (cellObservable) {
      return cellObservable;
    }

    const cell = this.getRow(rowNumber)[column];
    const cellValue = cell ? cell.value : 0;

    const createdObservable = new Observable(cellValue);
    this._cellsObservables[cellPosition] = createdObservable;
    return createdObservable;
  }

  updateCellValue(rowNumber, column, newRawValue) {
    const row = this.getRow(rowNumber);
    const cell = this._getOrCreateCell(row, column);

    if (cell.rawValue === newRawValue) {
      return;
    }

    const { value: cellValue, dependencies } = parseCellValue(
      newRawValue,
      this
    );

    const cellPosition = `${column}${rowNumber}`;
    // TODO: Remove unsued dependencies
    dependencies.forEach((dependency) => {
      this._addListener(dependency, cellPosition);
    });

    if (cell.value !== cellValue) {
      cell.rawValue = newRawValue;
      cell.value = cellValue;

      this._notifyChange(cellPosition, cellValue);
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
    const { value: cellValue } = parseCellValue(cell.rawValue, this);

    if (cellValue !== cell.value) {
      cell.value = cellValue;
      this._notifyChange(cellPosition, cellValue);
    }
  }

  _notifyChange(cellPosition, cellValue) {
    this._notifyListeners(cellPosition);
    this._notifySubscribers(cellPosition, cellValue);
  }

  _notifySubscribers(cellPosition, cellValue) {
    const cellObservable = this._cellsObservables[cellPosition];
    if (cellObservable) {
      cellObservable.next(cellValue);
    }
  }

  _notifyListeners(cellPosition) {
    const listeners = this._listeners[cellPosition];
    if (listeners) {
      listeners.forEach((listener) => {
        this._recalculateRawValue(listener);
      });
    }
  }

  _addListener(cellPosition, listener) {
    const listeners = this._listeners[cellPosition];
    if (listeners) {
      listeners.push(listener);
    } else {
      this._listeners[cellPosition] = [listener];
    }
  }
}

const spreadsheet = new Spreadsheet({});

export default spreadsheet;
