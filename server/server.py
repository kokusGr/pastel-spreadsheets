import flask
from flask_cors import CORS
import re

app = flask.Flask(__name__)
CORS(app)

spreadsheet = {
    "ID": 1,
    "columns": [chr(i+ord('A')) for i in range(10)],
    "rows": [{ "ID": f"Row#{i}"} for i in range(10)],
    "_listeners": {}
}

@app.route("/spreadsheets/<string:ID>", methods=["GET"])
def get_spreadsheet(ID):
    return flask.jsonify(spreadsheet)


def update_listeners(changeset):
    for added in changeset["added"]:
        dependency = added.get("dependency", None)
        listener = added.get("listener", None)
        if not dependency or not listener:
            flask.abort(400)

        listeners = spreadsheet["_listeners"].get(dependency, None)
        if not listeners:
            spreadsheet["_listeners"][dependency] = [listener]
        elif listener not in listeners:
            listeners.append(listener)


    for removed in changeset["removed"]:
        listeners = spreadsheet["_listeners"].get(added["dependency"], None)
        if listeners and removed.listener in listeners:
            listeners.remove(removed["listener"])

cell_regex = "^([A-Za-z]+)(\d+)$"

@app.route("/spreadsheets/<string:spreadsheetID>/cells/<string:cell_position>", methods=["PUT"])
def update_cell(spreadsheetID, cell_position):
    match = re.match(cell_regex, cell_position)
    if not match:
        flask.abort(404)

    column = match.group(1)
    row = int(match.group(2))
    body = flask.request.get_json()
    if not body:
        flask.abort(400)

    new_cell = body.get('cell', None)
    if not new_cell:
        flask.abort(400)

    spreadsheet["rows"][row - 1][column] = new_cell
    changeset = body.get('listeners', None)
    if changeset:
        update_listeners(changeset)

    return "OK"

