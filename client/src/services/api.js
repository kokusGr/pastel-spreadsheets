const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const getSpreadsheet = async () => {
  // For now there is only 1 spreadsheet so ID is ignored
  const url = `${SERVER_URL}/spreadsheets/1`;
  console.log("Url", url);
  const resposne = await fetch(url);
  const json = await resposne.json();
  return json;
};

const updateCell = async (spreadsheetId, cellPosition, data) => {
  const url = `${SERVER_URL}/spreadsheets/${spreadsheetId}/cells/${cellPosition}`;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export { getSpreadsheet, updateCell };
