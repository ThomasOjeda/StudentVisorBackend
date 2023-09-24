from flask import Blueprint
from .conversions import conversionsBP
from .transformations import transformationsBP
from .data_categories import datacatBP

from ..utils.utils import exception_wrap

routesBP = Blueprint("routes", __name__, url_prefix="/")


@routesBP.route("/", methods=["GET"])
@exception_wrap
def mainRoute():
    return "Pyflask server is active", 200


routesBP.register_blueprint(conversionsBP, url_prefix="/conversions")

routesBP.register_blueprint(transformationsBP, url_prefix="/transformations")

routesBP.register_blueprint(datacatBP, url_prefix="/datacat")
