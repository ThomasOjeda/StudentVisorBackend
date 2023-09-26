from flask import jsonify, request

from ..utils.enums import ColName
from ..transformations.common_operations import readFile

from ..transformations.inscriptions import StudentInscriptions
from ..transformations.student_movements import StudentMovements


def student_inscriptions(request):
    requestData = request.get_json()

    filters = {}
    filters[ColName.INSC_TYPE.value] = "I"

    if "sex" in requestData["transformationBody"]:
        filters[ColName.SEX.value] = requestData["transformationBody"]["sex"]
    if "unit" in requestData["transformationBody"]:
        filters[ColName.UNIT.value] = requestData["transformationBody"]["unit"]
    if "offer" in requestData["transformationBody"]:
        filters[ColName.OFFER.value] = requestData["transformationBody"]["offer"]

    enrollments = readFile(requestData["transformationBody"]["yearPath"])

    transformer = StudentInscriptions(enrollments, filters)
    result = transformer.transform()
    return jsonify(result), 200


def student_movements(request):
    requestData = request.get_json()

    fileAPath = requestData["transformationBody"]["yearAPath"]
    fileBPath = requestData["transformationBody"]["yearBPath"]

    table1Filters = {}
    table1Filters[ColName.INSC_TYPE.value] = "I"
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
    transformer = StudentMovements(table1, table2, table1Filters, table2Filters)
    result = transformer.transform()
    return jsonify(result), 200
