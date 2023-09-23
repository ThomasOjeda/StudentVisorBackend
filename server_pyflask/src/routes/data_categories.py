from flask import Blueprint, request
from ..utils.utils import exception_wrap

from ..controllers.data_categories import available_units,unit_offers

datacatBP = Blueprint("datacat", __name__, url_prefix="/")

@datacatBP.route("/units", methods=["POST"])
@exception_wrap
def units():
    return available_units(request)

@datacatBP.route("/unitoffers", methods=["POST"])
@exception_wrap
def unitsoffers():
    return unit_offers(request)