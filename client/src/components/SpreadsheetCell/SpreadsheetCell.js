import React from "react";

import { SpreadsheetContext } from "components/SpreadsheetContext";

import "./SpreadsheetCell.css";

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
        if (_cell && isMounted) {
          setCell({ ..._cell });
          setEditedValue(_cell.rawValue);
        }
      });

    return () => {
      unsubscribe();
      isMounted = false;
    };
  }, [column, rowNumber, spreadsheet]);

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
    <td className={`cell-root ${isBeingEdited ? "cell-root-focused" : ""}`}>
      {isBeingEdited ? (
        <input
          type="text"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={editedValue}
          onBlur={handleOnBlur}
          autoFocus={true}
          className={`cell-input`}
        />
      ) : (
        <div
          className="cell-value"
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
