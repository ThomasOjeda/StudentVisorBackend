from flask import jsonify, request
from ..transformations.data_categories import availableUnits,unitOffers

def available_units(request):
    transformer = availableUnits(request.get_json())
    result = transformer.transform().tolist()
    return jsonify(result), 200

def unit_offers(request):
    transformer = unitOffers(request.get_json())
    result = transformer.transform().tolist()
    return jsonify(result), 200
