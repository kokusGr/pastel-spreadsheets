import React from "react";

import SpreadsheetCell from "components/SpreadsheetCell";

const SpreadsheetRow = (props) => {
  const { rowNumber, columns } = props;

  return (
    <tr>
      <td>{rowNumber}</td>
      {columns.map((column) => {
        return (
          <SpreadsheetCell
            key={`${column}${rowNumber}`}
            column={column}
            rowNumber={rowNumber}
          />
        );
      })}
    </tr>
  );
};

export default SpreadsheetRow;
