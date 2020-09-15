import React from "react";

import SpreadsheetRow from "components/SpreadsheetRow";
import { SpreadsheetContext } from "components/SpreadsheetContext";

import "./Spreadsheet.css";

const Spreadsheet = () => {
  const spreadsheet = React.useContext(SpreadsheetContext);

  return (
    <table className="table">
      <thead>
        <tr className="table-columns-header-row">
          <th className="table-columns-header-spacer"></th>
          {spreadsheet.columns.map((column, index) => (
            <th
              className={`table-columns-header ${
                index === spreadsheet.columns.length - 1
                  ? "table-columns-header-last"
                  : ""
              }`}
              key={`Column#${column}`}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {spreadsheet.rows.map((row, index) => (
          <SpreadsheetRow
            key={row.ID}
            rowNumber={index + 1}
            isLast={index === spreadsheet.rows.length - 1}
            columns={spreadsheet.columns}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Spreadsheet;
