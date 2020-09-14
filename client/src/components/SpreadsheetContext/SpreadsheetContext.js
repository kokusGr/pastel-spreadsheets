import React from "react";

const SpreadsheetContext = React.createContext();

const SpreadsheetProvider = ({ children, store }) => {
  return store ? (
    <SpreadsheetContext.Provider value={store}>
      {children}
    </SpreadsheetContext.Provider>
  ) : null;
};

export { SpreadsheetContext, SpreadsheetProvider };
