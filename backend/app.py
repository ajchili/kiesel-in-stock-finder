from flask import Flask, make_response, send_from_directory
import json
from kiesel import get_in_stock_instruments

app = Flask(__name__)


@app.route("/")
@app.route("/<path:path>")
def hello_world(path="index.html"):
    return send_from_directory('dist', path)


@app.route("/guitars")
def get_guitars():
    instruments, specs = get_in_stock_instruments()
    resp = make_response(json.dumps(
        {"instruments": instruments, "specs": specs}), 200)
    resp.headers['Cache-Control'] = 'max-age=300'
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return resp
