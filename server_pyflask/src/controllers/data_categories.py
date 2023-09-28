from flask import jsonify, request
from ..transformations.data_categories import availableUnits, unitOffers
from ..transformations.common_operations import readFile


def available_units(request):
    table = readFile(request.get_json()["yearPath"])

    transformer = availableUnits()
    result = transformer.transform(table).tolist()
    return jsonify(result), 200


def unit_offers(request):
    requestData = request.get_json()
    table = readFile(requestData["yearPath"])
    unit = requestData["unit"]
    transformer = unitOffers()
    result = transformer.transform(table, unit).tolist()
    return jsonify(result), 200
