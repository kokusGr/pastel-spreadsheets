import React from "react";
import "./App.css";

import Spreadsheet from "components/Spreadsheet";
import { SpreadsheetProvider } from "components/SpreadsheetContext";

import SpreadsheetStore from "stores/SpreadsheetStore";

const App = () => {
  const spreadsheet = new SpreadsheetStore({});

  return (
    <div className="main">
      <div className="container">
        <h1 className="title">Pastel Spreadhseet</h1>
        <SpreadsheetProvider store={spreadsheet}>
          <Spreadsheet />
        </SpreadsheetProvider>
      </div>
    </div>
  );
};

export default App;
