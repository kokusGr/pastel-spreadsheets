import * as API from "services/api";

import { Observable } from "./utils";
import { cellRegex, parseCellValue } from "./cellParser";

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
  constructor(spreadsheet) {
    this.rows = spreadsheet.rows;
    this.columns = spreadsheet.columns;
    this._listeners = spreadsheet._listeners;
    this.ID = spreadsheet._id.$oid;
    this._cellsObservables = {};
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

    const listenersChangeset = this._updateDependencies(
      cellPosition,
      dependencies,
      cell._dependencies
    );

    if (cell.value !== cellValue || cell.rawValue !== newRawValue) {
      cell.rawValue = newRawValue;
      cell.value = cellValue;
      cell._dependencies = dependencies;

      this._notifyChange(cellPosition, cell, listenersChangeset);
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

  _notifyChange(cellPosition, cell, listenersChangeset) {
    API.updateCell(this.ID, cellPosition, {
      cell,
      listeners: listenersChangeset,
    });

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
    const listenersChangeset = { added: [], removed: [] };

    dependencies.forEach((dependency) => {
      if (!previousDependencies.includes(dependency)) {
        this._addDependencyListener(dependency, cellPosition);
        listenersChangeset.added.push({ listener: cellPosition, dependency });
      }
    });

    previousDependencies.forEach((dependency) => {
      if (!dependencies.includes(dependency)) {
        this._removeDependencyListener(dependency, cellPosition);
        listenersChangeset.removed.push({ listener: cellPosition, dependency });
      }
    });

    return listenersChangeset;
  }

  _notifyDependencyListeners(cellPosition) {
    const listeners = this._listeners[cellPosition];
    if (listeners) {
      listeners.forEach((listener) => {
        this._recalculateRawValue(listener);
      });
    }
  }

  _addDependencyListener(dependency, listener) {
    const listeners = this._listeners[dependency];
    if (listeners) {
      listeners.push(listener);
    } else {
      this._listeners[dependency] = [listener];
    }
  }

  _removeDependencyListener(dependency, listener) {
    const listeners = this._listeners[dependency];
    if (listeners) {
      const listenerIndex = listeners.indexOf(listener);
      listeners.splice(listenerIndex, 1);
    }
  }
}

export default SpreadsheetStore;

export { getColumnsLabels };
