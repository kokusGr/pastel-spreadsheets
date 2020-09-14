import React from "react";
import "./App.css";

import Spreadsheet from "components/Spreadsheet";
import { SpreadsheetProvider } from "components/SpreadsheetContext";

import SpreadsheetStore from "stores/SpreadsheetStore";

const App = () => {
  const spreadsheet = new SpreadsheetStore({});

  return (
    <div>
      <h1>Hello</h1>
      <SpreadsheetProvider store={spreadsheet}>
        <Spreadsheet />
      </SpreadsheetProvider>
    </div>
  );
};

export default App;
