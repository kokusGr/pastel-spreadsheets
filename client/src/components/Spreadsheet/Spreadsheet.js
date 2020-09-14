import React from "react";

import SpreadsheetRow from "components/SpreadsheetRow";
import { SpreadsheetContext } from "components/SpreadsheetContext";

const Spreadsheet = () => {
  const spreadsheet = React.useContext(SpreadsheetContext);

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
            rowNumber={index + 1}
            columns={spreadsheet.columns}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Spreadsheet;
