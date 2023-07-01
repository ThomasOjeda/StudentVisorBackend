from flask import Blueprint

StudentInscriptionsRoutes = Blueprint("routes", __name__, url_prefix="/")


@StudentInscriptionsRoutes.route("/", methods=["GET"])
def mainRoute():
    return "this is student_inscriptions"
