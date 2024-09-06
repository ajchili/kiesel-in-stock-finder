from bs4 import BeautifulSoup
import requests
import json


spec_category_mapping = {
    'price': 'General',
    'model': 'General',
    'modelName': 'General',
    'bridge': 'Hardware',
    'stringCount': 'General',
    'dexterity': 'General',
    'multiscale': 'General',
    'case': 'General',
    'construction': 'General',
    'scaleLength': 'General',
    'bevel': 'Body',
    'body': 'Body',
    'bodyConstruction': 'Body',
    'topWood': 'Body',
    'woodTreatment': 'Body',
    'threePieceBody': 'Body',
    'finish': 'Body',
    'customShopFinish': 'Body',
    'crackle': 'Body',
    'cali': 'Body',
    'burstEdges': 'Body',
    'topCoat': 'Body',
    'pickguard': 'Body',
    'rearFinish': 'Body',
    'binding': 'Body',
    'headstock': 'Neck',
    'headstockOverlay': 'Neck',
    'headstockFinish': 'Neck',
    'trussRodCover': 'Neck',
    'neck': 'Neck',
    'neckFinish': 'Neck',
    'neckProfile': 'Neck',
    'numFrets': 'Neck',
    'fingerboard': 'Neck',
    'fingerboardRadius': 'Neck',
    'frets': 'Neck',
    'inlays': 'Neck',
    'inlayMaterial': 'Neck',
    'hardware': 'Hardware',
    'logo': 'Neck',
    'strapButtons': 'Hardware',
    'tuners': 'Neck',
    'knobs': 'Hardware',
    'strings': 'Hardware',
    'pickupConfiguration': 'Electronics',
    'bridgePickup': 'Electronics',
    'neckPickup': 'Electronics',
    'middlePickup': 'Electronics',
    'pickupColor': 'Electronics',
    'polePieces': 'Electronics',
    'controls': 'Electronics',
}


def get_instruments():
    request = requests.get("https://www.kieselguitars.com/in-stocks")
    soup = BeautifulSoup(request.text, "html.parser")

    data = soup.find(id="__NEXT_DATA__")
    instrument_collection = json.loads(data.get_text())[
        "props"]["pageProps"]["instrumentCollection"]
    return json.loads(instrument_collection)


def get_pretty_filter_name(filter_name: str) -> str:
    match filter_name:
        case "numFrets":
            return "Number of Frets"
        case _:
            return
            # return f"{filter_name[0:1].upper()}{filter_name[1:]}"


def get_pretty_filter_value(spec: str, filter_value: any) -> int | str:
    match spec:
        case "price":
            return int(filter_value)
        case "stringCount":
            return int(filter_value)
        case _:
            return str(filter_value)


def get_filters():
    instruments = get_instruments()
    filters = {}

    for instrument in instruments:
        for spec in instrument["specs"]:
            if spec in ["_ts"]:
                continue
            if "value" not in instrument["specs"][spec]:
                continue

            filter_name = spec  # get_pretty_filter_name(spec)
            filter_value = get_pretty_filter_value(
                spec, instrument["specs"][spec]["value"]
            )
            filter_value_name = instrument["specs"][spec].get(
                "description",
                filter_value
            )

            if filter_name not in filters:
                filters[filter_name] = {
                    "category": spec_category_mapping.get(spec, "Other"),
                    "values": {}
                }

            if filter_value not in filters[filter_name]["values"]:
                filters[filter_name]["values"][filter_value] = filter_value_name

    return filters
