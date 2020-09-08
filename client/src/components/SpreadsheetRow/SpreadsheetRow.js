import React from "react";

import SpreadsheetCell from "components/SpreadsheetCell";

const SpreadsheetRow = (props) => {
  const { row, rowNumber, columns, onCellValueChange } = props;

  const handleCellValueChange = (newValue, column) => {
    onCellValueChange(row, column, newValue);
  };

  return (
    <tr>
      <td>{rowNumber}</td>
      {columns.map((column) => {
        const cell = row[column];
        return (
          <SpreadsheetCell
            key={`${rowNumber}${column}`}
            column={column}
            rawValue={cell && cell.rawValue}
            value={cell && cell.value}
            onConfirm={handleCellValueChange}
          />
        );
      })}
    </tr>
  );
};

export default SpreadsheetRow;
