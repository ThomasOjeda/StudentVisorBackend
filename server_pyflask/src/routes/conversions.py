from flask import Blueprint, request
from ..utils.utils import exception_wrap

from ..controllers.conversions import (
    student_inscriptions,
    student_belgrano_scholarships,
)

conversionsBP = Blueprint("conversions", __name__, url_prefix="/")


@conversionsBP.route("/studentinscriptions", methods=["POST"])
@exception_wrap
def studentinscriptions():
    return student_inscriptions(request)


@conversionsBP.route("/studentscholarships", methods=["POST"])
@exception_wrap
def studentscholarships():
    return student_belgrano_scholarships(request)
