import React from "react";

const SpreadsheetCell = (props) => {
  const { column, rawValue, value, onConfirm } = props;

  const [editedValue, setEditedValue] = React.useState(rawValue || "");
  const [isBeingEdited, setIsBeingEdited] = React.useState(false);

  const handleOnConfirm = () => {
    onConfirm(editedValue, column);
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
      setEditedValue(rawValue);
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
          {value}
        </div>
      )}
    </td>
  );
};

export default SpreadsheetCell;
