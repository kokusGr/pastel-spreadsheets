import React from "react";

import { SpreadsheetContext } from "components/SpreadsheetContext";

const SpreadsheetCell = (props) => {
  const { column, rowNumber } = props;

  const [cell, setCell] = React.useState(null);
  const [editedValue, setEditedValue] = React.useState("");
  const [isBeingEdited, setIsBeingEdited] = React.useState(false);

  const spreadsheet = React.useContext(SpreadsheetContext);

  React.useEffect(() => {
    let isMounted = true;

    const unsubscribe = spreadsheet
      .observeCell(rowNumber, column)
      .subscribe((_cell) => {
        if (_cell) {
          isMounted && setCell({ ..._cell });
          !isBeingEdited && setEditedValue(_cell.rawValue);
        }
      });

    return () => {
      unsubscribe();
      isMounted = false;
    };
  }, [column, rowNumber, spreadsheet, isBeingEdited]);

  const handleOnConfirm = () => {
    if (cell || editedValue) {
      spreadsheet.updateCellValue(rowNumber, column, editedValue);
    }
    setIsBeingEdited(false);
  };

  const handleChange = (event) => {
    setEditedValue(event.currentTarget.value);
  };

  const handleKeyDown = (keyEvent) => {
    if (keyEvent.key === "Enter") {
      handleOnConfirm();
    } else if (keyEvent.key === "Escape") {
      setIsBeingEdited(false);
      setEditedValue(cell ? cell.rawValue : "");
    }
  };

  const handleOnBlur = () => {
    handleOnConfirm();
  };

  return (
    <td>
      {isBeingEdited ? (
        <input
          type="text"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={editedValue}
          onBlur={handleOnBlur}
          autoFocus={true}
        />
      ) : (
        <div
          style={{ width: 100, height: 40, border: "1px solid red" }}
          onClick={() => {
            setIsBeingEdited(true);
          }}
        >
          {cell ? cell.value : ""}
        </div>
      )}
    </td>
  );
};

export default SpreadsheetCell;
