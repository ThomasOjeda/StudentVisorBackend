from flask import jsonify, request

from ..utils.enums import ColName
from ..transformations.common_operations import readFile

from ..transformations.inscriptions import StudentInscriptions
from ..transformations.student_movements import StudentMovements
from ..transformations.units_inscriptions import UnitInscriptions
from ..transformations.student_migrations import StudentMigrations
from ..transformations.student_scholarships_movements import (
    StudentScholarshipsMovements,
)


def student_inscriptions(request):
    requestData = request.get_json()

    filters = {}
    filters[ColName.INSC_TYPE.value] = "i"

    if "sex" in requestData["transformationBody"]:
        filters[ColName.SEX.value] = requestData["transformationBody"]["sex"]
    if "unit" in requestData["transformationBody"]:
        filters[ColName.UNIT.value] = requestData["transformationBody"]["unit"]
    if "offer" in requestData["transformationBody"]:
        filters[ColName.OFFER.value] = requestData["transformationBody"]["offer"]

    enrollments = readFile(requestData["transformationBody"]["yearPath"])

    transformer = StudentInscriptions()
    result = transformer.transform(enrollments, filters)
    return jsonify(result), 200


def student_movements(request):
    requestData = request.get_json()

    fileAPath = requestData["transformationBody"]["yearAPath"]
    fileBPath = requestData["transformationBody"]["yearBPath"]

    table1Filters = {}
    table1Filters[ColName.INSC_TYPE.value] = "i"
    table2Filters = {}

    if "sex" in requestData["transformationBody"]:
        table1Filters[ColName.SEX.value] = requestData["transformationBody"]["sex"]
        table2Filters[ColName.SEX.value] = requestData["transformationBody"]["sex"]

    if "unitA" in requestData["transformationBody"]:
        table1Filters[ColName.UNIT.value] = requestData["transformationBody"]["unitA"]

    if "unitB" in requestData["transformationBody"]:
        table2Filters[ColName.UNIT.value] = requestData["transformationBody"]["unitB"]

    if "offerA" in requestData["transformationBody"]:
        table1Filters[ColName.OFFER.value] = requestData["transformationBody"]["offerA"]

    if "offerB" in requestData["transformationBody"]:
        table2Filters[ColName.OFFER.value] = requestData["transformationBody"]["offerB"]

    table1 = readFile(fileAPath)
    table2 = readFile(fileBPath)
    transformer = StudentMovements()
    result = transformer.transform(table1, table2, table1Filters, table2Filters)
    return jsonify(result), 200


def unit_inscriptions(request):
    requestData = request.get_json()

    enrollments = readFile(requestData["transformationBody"]["yearPath"])

    transformer = UnitInscriptions()
    result = transformer.transform(enrollments)

    return jsonify(result.to_dict()), 200


def student_migrations(request):
    requestData = request.get_json()

    fileAPath = requestData["transformationBody"]["yearAPath"]
    fileBPath = requestData["transformationBody"]["yearBPath"]

    table1Filters = {}
    table1Filters[ColName.INSC_TYPE.value] = "i"
    table2Filters = {}

    if "sex" in requestData["transformationBody"]:
        table1Filters[ColName.SEX.value] = requestData["transformationBody"]["sex"]
        table2Filters[ColName.SEX.value] = requestData["transformationBody"]["sex"]

    if "unitA" in requestData["transformationBody"]:
        table1Filters[ColName.UNIT.value] = requestData["transformationBody"]["unitA"]

    if "unitB" in requestData["transformationBody"]:
        table2Filters[ColName.UNIT.value] = requestData["transformationBody"]["unitB"]

    if "offerA" in requestData["transformationBody"]:
        table1Filters[ColName.OFFER.value] = requestData["transformationBody"]["offerA"]

    if "offerB" in requestData["transformationBody"]:
        table2Filters[ColName.OFFER.value] = requestData["transformationBody"]["offerB"]

    table1 = readFile(fileAPath)
    table2 = readFile(fileBPath)

    transformer = StudentMigrations()
    result = transformer.transform(
        table1,
        table2,
        table1Filters,
        table2Filters,
        requestData["transformationBody"]["destMode"],
    )

    return jsonify(result), 200


def student_scholarships_movements(request):
    requestData = request.get_json()

    fileAPath = requestData["transformationBody"]["yearAPath"]
    fileBPath = requestData["transformationBody"]["yearBPath"]

    fileScholarshipsPath = requestData["transformationBody"]["scholarshipsPath"]

    table1Filters = {}
    table1Filters[ColName.INSC_TYPE.value] = "i"
    table2Filters = {}
    table2Filters[ColName.INSC_TYPE.value] = "i"

    schFilters = {}

    if "sex" in requestData["transformationBody"]:
        table1Filters[ColName.SEX.value] = requestData["transformationBody"]["sex"]
        table2Filters[ColName.SEX.value] = requestData["transformationBody"]["sex"]

    if "unitA" in requestData["transformationBody"]:
        table1Filters[ColName.UNIT.value] = requestData["transformationBody"]["unitA"]

    if "unitB" in requestData["transformationBody"]:
        table2Filters[ColName.UNIT.value] = requestData["transformationBody"]["unitB"]
        schFilters[ColName.UNIT.value] = requestData["transformationBody"]["unitB"]

    if "offerA" in requestData["transformationBody"]:
        table1Filters[ColName.OFFER.value] = requestData["transformationBody"]["offerA"]

    if "offerB" in requestData["transformationBody"]:
        table2Filters[ColName.OFFER.value] = requestData["transformationBody"]["offerB"]
        schFilters[ColName.OFFER.value] = requestData["transformationBody"]["offerB"]

    table1 = readFile(fileAPath)
    table2 = readFile(fileBPath)

    scholarships = readFile(fileScholarshipsPath)

    transformer = StudentScholarshipsMovements()
    result = transformer.transform(
        table1, table2, scholarships, table1Filters, table2Filters, schFilters
    )

    return jsonify(result.to_dict()), 200
