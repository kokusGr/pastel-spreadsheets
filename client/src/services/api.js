const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const getSpreadsheet = async () => {
  const url = `${SERVER_URL}/spreadsheets/1`;
  console.log("Url", url);
  const resposne = await fetch(url);
  const json = await resposne.json();
  return json;
};

const updateCell = async (cellPosition, data) => {
  const url = `${SERVER_URL}/spreadsheets/1/cells/${cellPosition}`;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export { getSpreadsheet, updateCell };
