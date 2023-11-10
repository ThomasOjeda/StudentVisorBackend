from flask import Blueprint, request
from ..utils.utils import exception_wrap

from ..controllers.transformations import (
    student_inscriptions,
    student_movements,
    unit_inscriptions,
    student_migrations,
    student_scholarships_movements,
)

transformationsBP = Blueprint("transformations", __name__, url_prefix="/")


@transformationsBP.route("/studentinscriptions", methods=["POST"])
@exception_wrap
def POSTstudentInscriptions():
    return student_inscriptions(request)


@transformationsBP.route("/studentmovements", methods=["POST"])
@exception_wrap
def POSTstudentMovements():
    return student_movements(request)


@transformationsBP.route("/unitinscriptions", methods=["POST"])
@exception_wrap
def POSTunitInscriptions():
    return unit_inscriptions(request)


@transformationsBP.route("/studentmigrations", methods=["POST"])
@exception_wrap
def POSTstudentMigrations():
    return student_migrations(request)


@transformationsBP.route("/studentscholarshipsmovements", methods=["POST"])
@exception_wrap
def POSTstudentScholarshipsMovements():
    return student_scholarships_movements(request)
