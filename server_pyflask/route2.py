from flask import Blueprint

bp = Blueprint("route2", __name__, url_prefix="/")


@bp.route("/subroute3", methods=["PATCH"])
def subroute3():
    return "This is subroute3"


@bp.route("/subroute4", methods=["DELETE"])
def subroute4():
    return "This is subroute4"
