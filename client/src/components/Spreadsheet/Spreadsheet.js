import React from "react";

import SpreadsheetRow from "components/SpreadsheetRow";

const createSpreadsheet = () => {
  const spreadsheet = {
    id: "spreadsheet1",
    numOfColumns: 10,
    rows: new Array(10).fill(1).map((_, i) => ({ id: `Row#${i}` })),
  };

  return spreadsheet;
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

const resolveCellFunction = (rawValue) => `Function #${rawValue}`;

const parseCellValue = (rawValue) => {
  if (!rawValue) {
    return "";
  }

  const maybeNumber = +rawValue;
  if (!Number.isNaN(maybeNumber)) {
    return maybeNumber;
  }

  if (typeof rawValue === "string" && rawValue.startsWith("=")) {
    return resolveCellFunction(rawValue);
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
        value: parseCellValue(rawValue),
      },
    };
    updateSpreadsheet({
      ...spreadsheet,
      rows: spreadsheet.rows.map((_row) =>
        _row.id === row.id ? updatedRow : _row
      ),
    });
  };

  const columns = React.useMemo(
    () => getColumnsLabels(spreadsheet.numOfColumns),
    [spreadsheet.numOfColumns]
  );

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {columns.map((column) => (
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
            columns={columns}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Spreadsheet;
