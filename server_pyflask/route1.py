from flask import Blueprint

bp = Blueprint("route1", __name__, url_prefix="/")


@bp.route("/subroute1", methods=["GET"])
def subroute1():
    return "This is subroute1"


@bp.route("/subroute2", methods=["POST"])
def subroute2():
    return "This is subroute2"
