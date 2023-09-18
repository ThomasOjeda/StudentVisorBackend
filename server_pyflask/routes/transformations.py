from flask import Blueprint, jsonify, request
import pandas as pd
import numpy as np
from ..utils.utils import exception_wrap

from ..controllers.transformations import student_inscriptions,student_movements

transformationsBP = Blueprint("transformations", __name__, url_prefix="/")

@transformationsBP.route("/studentinscriptions", methods=["POST"])
@exception_wrap
def POSTstudentInscriptions():
    return student_inscriptions(request)


@transformationsBP.route("/studentmovements", methods=["POST"])
@exception_wrap
def POSTstudentMovements():
    return student_movements(request)
