import React from "react";

import SpreadsheetCell from "components/SpreadsheetCell";

import "./SpreadsheetRow.css";

const SpreadsheetRow = (props) => {
  const { rowNumber, columns, isLast } = props;

  return (
    <tr className="row-root">
      <td className={`row-label ${isLast ? "row-label-last" : ""}`}>
        {rowNumber}
      </td>
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
