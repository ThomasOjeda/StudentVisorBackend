from flask import Blueprint, request
from .conversions.conversions import conversionsBP
from .transformations.transformations import transformationsBP
from .utils.utils import exception_wrap

routesBP = Blueprint("routes", __name__, url_prefix="/")


@routesBP.route("/", methods=["GET"])
@exception_wrap
def mainRoute():
    return "Pyflask server is active"


routesBP.register_blueprint(conversionsBP, url_prefix="/conversions")

routesBP.register_blueprint(transformationsBP, url_prefix="/transformations")
