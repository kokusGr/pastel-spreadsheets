import flask
import re
import os

from flask_cors import CORS
from bson import json_util
from dotenv import load_dotenv

from db import init_db
from spreadsheet_repo import SpreadsheetRepo

load_dotenv()

app = flask.Flask(__name__)
CORS(app)
db = init_db(os.getenv("DB_URI"))
repo = SpreadsheetRepo(db)

@app.route("/spreadsheets/<string:ID>", methods=["GET"])
def get_spreadsheet(ID):
    spreadsheet = repo.get(ID)
    return json_util.dumps(spreadsheet)


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

@app.route("/spreadsheets/<string:spreadsheet_id>/cells/<string:cell_position>", methods=["PUT"])
def update_cell(spreadsheet_id, cell_position):
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

    changeset = body.get('listeners', None)
    repo.update_cell(spreadsheet_id, row, column, new_cell, changeset)

    return "OK"

