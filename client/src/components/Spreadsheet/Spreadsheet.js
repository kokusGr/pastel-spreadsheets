import React from "react";

import SpreadsheetRow from "components/SpreadsheetRow";

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

const createSpreadsheet = ({ numOfColumns = 10, numOfRows = 10 } = {}) => {
  const spreadsheet = {
    id: "spreadsheet1",
    columns: getColumnsLabels(numOfColumns),
    rows: new Array(numOfRows).fill(1).map((_, i) => ({ id: `Row#${i}` })),
  };

  return spreadsheet;
};

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
  const cellRow = spreadsheet.rows[rowNumber - 1];

  if (!cellRow || !spreadsheet.columns.includes(column.toUpperCase())) {
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
  evaluate(values, spreadsheet) {
    // NOTE: This assumes that value can only be a number or a cell reference
    const maybeNumber = +values;
    if (Number.isNaN(maybeNumber)) {
      return getCellValue(values, spreadsheet);
    }

    return values;
  },
};

const defaultResolvers = [addResolver, multiplyResolver, cellResolver];

const resolve = (expression, spreadsheet, resolvers = defaultResolvers) => {
  const [currentResolver, ...nextResolvers] = resolvers;
  const parts = currentResolver.parse(expression, spreadsheet);
  const values =
    nextResolvers.length > 0
      ? parts.map((part) => resolve(part, spreadsheet, nextResolvers))
      : parts;
  return currentResolver.evaluate(values, spreadsheet);
};

const resolveCellFunction = (rawValue, spreadsheet) => {
  try {
    const expression = rawValue.slice(1);
    return resolve(expression, spreadsheet);
  } catch (error) {
    if (error instanceof CellReferenceError) {
      return `#ReferenceError: ${error.cell}`;
    } else {
      throw error;
    }
  }
};

const parseCellValue = (rawValue, spreadsheet) => {
  if (!rawValue) {
    return "";
  }

  const maybeNumber = +rawValue;
  if (!Number.isNaN(maybeNumber)) {
    return maybeNumber;
  }

  if (typeof rawValue === "string" && rawValue.startsWith("=")) {
    return resolveCellFunction(rawValue, spreadsheet);
  }

  return "#TypeError";
};

const Spreadsheet = () => {
  const [spreadsheet, updateSpreadsheet] = React.useState(createSpreadsheet());

  const onCellValueChange = (row, column, rawValue) => {
    const updatedRow = {
      ...row,
      [column]: {
        rawValue,
        value: parseCellValue(rawValue, spreadsheet),
      },
    };
    updateSpreadsheet({
      ...spreadsheet,
      rows: spreadsheet.rows.map((_row) =>
        _row.id === row.id ? updatedRow : _row
      ),
    });
  };

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {spreadsheet.columns.map((column) => (
            <th key={`Column#${column}`}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {spreadsheet.rows.map((row, index) => (
          <SpreadsheetRow
            key={row.id}
            row={row}
            onCellValueChange={onCellValueChange}
            rowNumber={index}
            columns={spreadsheet.columns}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Spreadsheet;
