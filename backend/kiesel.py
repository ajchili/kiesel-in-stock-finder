from bs4 import BeautifulSoup
import requests
import json


def get_in_stock_instruments():
    request = requests.get("https://www.kieselguitars.com/in-stocks")
    soup = BeautifulSoup(request.text, "html.parser")

    data = soup.find(id="__NEXT_DATA__")
    instrument_collection = json.loads(data.get_text())[
        "props"]["pageProps"]["instrumentCollection"]
    in_stock_instruments = json.loads(instrument_collection)

    specs_on_in_stock_instruments = {}

    for instrument in in_stock_instruments:
        for spec in instrument["specs"]:
            if spec in ["_ts"]:
                continue
            if "value" not in instrument["specs"][spec]:
                continue

            if spec not in specs_on_in_stock_instruments:
                specs_on_in_stock_instruments[spec] = set()

            specs_on_in_stock_instruments[spec].add(
                instrument["specs"][spec]["value"])

    # poor mans JSON encoding for sets
    for spec in specs_on_in_stock_instruments:
        specs_on_in_stock_instruments[spec] = list(
            specs_on_in_stock_instruments[spec])

    specs_on_in_stock_instruments

    return in_stock_instruments, specs_on_in_stock_instruments
