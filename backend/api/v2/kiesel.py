from flask import Blueprint, make_response

from soup.kiesel import get_instruments, get_filters

kiesel = Blueprint('kiesel', __name__, url_prefix="/api/v2/kiesel")


@kiesel.route('/instruments')
def instruments():
    response = make_response(get_instruments())
    response.headers['Cache-Control'] = 'max-age=3600'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response


@kiesel.route('/filters')
def filters():
    response = make_response(get_filters())
    response.headers['Cache-Control'] = 'max-age=3600'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response
