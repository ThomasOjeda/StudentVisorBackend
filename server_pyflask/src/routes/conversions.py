from flask import Blueprint, request
from ..utils.utils import exception_wrap

from ..controllers.conversions import (
    student_inscriptions,
    student_scholarships,
    update_student_scholarships,
    file_to_excel,
)

conversionsBP = Blueprint("conversions", __name__, url_prefix="/")


@conversionsBP.route("/studentinscriptions", methods=["POST"])
@exception_wrap
def studentinscriptions():
    return student_inscriptions(request)


@conversionsBP.route("/studentscholarships", methods=["POST"])
@exception_wrap
def studentscholarships():
    return student_scholarships(request)


@conversionsBP.route("/studentscholarships/update", methods=["POST"])
@exception_wrap
def updatestudentscholarships():
    return update_student_scholarships(request)


@conversionsBP.route("/filetoexcel", methods=["POST"])
@exception_wrap
def filetoexcel():
    return file_to_excel(request)
