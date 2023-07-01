from flask import Blueprint

pickleConversionBlueprint = Blueprint("pickleConversion", __name__, url_prefix="/")


@pickleConversionBlueprint.route("/studentsInscriptions", methods=["GET"])
def subroute1():
    return "This is studentsInscriptions"
