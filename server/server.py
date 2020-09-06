import flask
app = flask.Flask(__name__)

@app.route("/")
def index():
    rows = [i+1 for i in range(10)]
    columns = [chr(i+ord('A')) for i in range(10)]
    return flask.jsonify({ 'rows': rows, 'columns': columns  })