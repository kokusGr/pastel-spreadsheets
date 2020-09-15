import React from "react";
import "./App.css";

import Spreadsheet from "components/Spreadsheet";
import { SpreadsheetProvider } from "components/SpreadsheetContext";

import SpreadsheetStore from "stores/SpreadsheetStore";
import { getSpreadsheet } from "services/api";

const App = () => {
  const [spreadsheet, setSpreadsheet] = React.useState(null);

  React.useEffect(() => {
    const fetchSpreadsheet = async () => {
      const fetchedSpreadsheet = await getSpreadsheet();
      const newStore = new SpreadsheetStore(fetchedSpreadsheet);
      setSpreadsheet(newStore);
    };

    fetchSpreadsheet();
  }, []);

  return (
    <div className="main">
      <div className="container">
        <h1 className="title">Pastel Spreadhseet</h1>
        {spreadsheet ? (
          <SpreadsheetProvider store={spreadsheet}>
            <Spreadsheet />
          </SpreadsheetProvider>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default App;
