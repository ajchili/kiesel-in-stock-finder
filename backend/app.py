from flask import Flask, make_response
import json
from kiesel import get_in_stock_instruments

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/guitars")
def get_guitars():
    instruments, specs = get_in_stock_instruments()
    resp = make_response(json.dumps(
        {"instruments": instruments, "specs": specs}), 200)
    resp.headers['Cache-Control'] = 'max-age=300'
    return resp
