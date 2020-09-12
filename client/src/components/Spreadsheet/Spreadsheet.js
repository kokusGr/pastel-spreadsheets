import React from "react";

import SpreadsheetRow from "components/SpreadsheetRow";

import { createSpreadsheet, parseCellValue } from "./utils";

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
