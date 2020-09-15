import React from "react";
import "./App.css";

import Spreadsheet from "components/Spreadsheet";
import { SpreadsheetProvider } from "components/SpreadsheetContext";

import SpreadsheetStore from "stores/SpreadsheetStore";
import { getSpreadsheet } from "services/api";

const App = () => {
  const [spreadsheet, setSpreadsheet] = React.useState(null);
  const [status, setStatus] = React.useState("loading");

  React.useEffect(() => {
    let isMounted = true;

    const fetchSpreadsheet = async () => {
      const fetchedSpreadsheet = await getSpreadsheet();
      if (!fetchedSpreadsheet) {
        isMounted && setStatus("error");
      } else {
        const newStore = new SpreadsheetStore(fetchedSpreadsheet);
        if (isMounted) {
          setSpreadsheet(newStore);
          setStatus("success");
        }
      }
    };

    fetchSpreadsheet();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="main">
      <div className="container">
        <h1 className="title">Pastel Spreadsheets</h1>
        {
          {
            error: (
              <div>
                Error occured while loading a spreadsheet. Please try again
                later
              </div>
            ),
            loading: <div>Loading…</div>,
            success: (
              <SpreadsheetProvider store={spreadsheet}>
                <Spreadsheet />
              </SpreadsheetProvider>
            ),
          }[status]
        }
      </div>
    </div>
  );
};

export default App;
