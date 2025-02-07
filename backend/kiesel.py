from bs4 import BeautifulSoup
import requests
import json

spec_category_mapping = {
    'price': 'general',
    'model': 'general',
    'modelName': 'general',
    'bridge': 'hardware',
    'serialNumber': None,
    'stringCount': 'general',
    'dexterity': 'general',
    'multiscale': 'general',
    'case': 'general',
    'construction': 'general',
    'scaleLength': 'general',
    'bevel': 'body',
    'body': 'body',
    'bodyConstruction': 'body',
    'topWood': 'body',
    'woodTreatment': 'body',
    'threePieceBody': 'body',
    'finish': 'body',
    'customShopFinish': 'body',
    'crackle': 'body',
    'cali': 'body',
    'burstEdges': 'body',
    'topCoat': 'body',
    'pickguard': 'body',
    'rearFinish': 'body',
    'binding': 'body',
    'headstock': 'neck',
    'headstockOverlay': 'neck',
    'headstockFinish': 'neck',
    'trussRodCover': 'neck',
    'neck': 'neck',
    'neckFinish': 'neck',
    'neckProfile': 'neck',
    'numFrets': 'neck',
    'fingerboard': 'neck',
    'fingerboardRadius': 'neck',
    'frets': 'neck',
    'inlays': 'neck',
    'inlayMaterial': 'neck',
    'hardware': 'hardware',
    'logo': 'neck',
    'strapButtons': 'hardware',
    'tuners': 'neck',
    'knobs': 'hardware',
    'strings': 'hardware',
    'pickupConfiguration': 'electronics',
    'bridgePickup': 'electronics',
    'neckPickup': 'electronics',
    'middlePickup': 'electronics',
    'pickupColor': 'electronics',
    'polePieces': 'electronics',
    'midi': None,
    'controls': 'electronics',
    'notes': None,
    'optionFifty': None,
    'nonReturnable': None,
    'extra': None,
    'optionFiftyOne': None,
    'weight': None,
}


def normalize_spec_filter_values(specName, variants):
    if specName in ['price']:
        return {'type': 'number', 'variants': list(map(lambda num: float(num), variants))}

    return {'type': 'string', 'variants': variants}


def normalize_spec_filters(specs):
    normalized_filters = {
        'other': {}
    }

    for spec in specs:
        category = spec_category_mapping.get(spec, None)

        if category is None:
            normalized_filters['other'][spec] = normalize_spec_filter_values(
                specName=spec, variants=specs[spec])
            continue

        if category not in normalized_filters:
            normalized_filters[category] = {}

        normalized_filters[category][spec] = normalize_spec_filter_values(
            specName=spec, variants=specs[spec])

    return normalized_filters


def get_in_stock_instruments():
    request = requests.get("https://www.kieselguitars.com/in-stocks")
    soup = BeautifulSoup(request.text, "html.parser")

    data = soup.find(id="__NEXT_DATA__")
    instrument_collection = json.loads(data.get_text())[
        "props"]["pageProps"]["instrumentCollection"]
    raw_in_stock_instruments = json.loads(instrument_collection)

    # Duplicate instruments may be listed by Kiesel guitars, filter them out
    instrument_serial_numbers = set()
    in_stock_instruments = list()
    for instrument in raw_in_stock_instruments:
        if instrument["specs"]["serialNumber"]["value"] in instrument_serial_numbers:
            continue

        instrument_serial_numbers.add(
            instrument["specs"]["serialNumber"]["value"])
        in_stock_instruments.append(instrument)

    specs_on_in_stock_instruments = {}

    for instrument in in_stock_instruments:
        for spec, details in instrument["specs"].items():
            if spec in ["_ts"]:
                continue

            if not isinstance(details, dict) or "value" not in details:
                continue

            if spec not in specs_on_in_stock_instruments:
                specs_on_in_stock_instruments[spec] = set()

            specs_on_in_stock_instruments[spec].add(details.get("value"))

    # poor mans JSON encoding for sets
    for spec in specs_on_in_stock_instruments:
        specs_on_in_stock_instruments[spec] = list(
            specs_on_in_stock_instruments[spec])

    return in_stock_instruments, normalize_spec_filters(specs_on_in_stock_instruments)
