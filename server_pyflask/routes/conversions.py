from flask import Blueprint, jsonify, request
import pandas as pd
from ..utils.utils import exception_wrap

from ..controllers.conversions import student_inscriptions

conversionsBP = Blueprint("conversions", __name__, url_prefix="/")

@conversionsBP.route("/studentinscriptions", methods=["POST"])
@exception_wrap
def controller():
    return student_inscriptions(request)