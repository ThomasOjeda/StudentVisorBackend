from flask import Blueprint, jsonify, request
import pandas as pd
import numpy as np
from ..utils.utils import exception_wrap

from .inscriptions import StudentInscriptions

transformationsBP = Blueprint("transformations", __name__, url_prefix="/")


@transformationsBP.route("/studentinscriptions", methods=["POST"])
@exception_wrap
def POSTstudentInscriptions():
    transformer = StudentInscriptions(request.get_json()["data"])
    result = transformer.transform()
    return jsonify(result), 200


@transformationsBP.route("/studentmovements", methods=["POST"])
@exception_wrap
def POSTstudentMovements():
    fileA = request.get_json()["data"]["transformationBody"]["yearAPath"]

    fileB = request.get_json()["data"]["transformationBody"]["yearBPath"]

    table1 = pd.read_pickle(fileA)

    table2 = pd.read_pickle(fileB)

    table1 = table1[table1["TIPO_DOC"] == "I"]

    activeOnAnyOffer = table1.merge(table2, on="DOCUMENTO", how="inner")

    activeOnSameOffer = table1.merge(table2, on=["DOCUMENTO", "CARRERA"], how="inner")

    activeOnAnyOffer = activeOnAnyOffer["DOCUMENTO"].unique()

    activeOnSameOffer = activeOnSameOffer["DOCUMENTO"].unique()

    movements = np.setdiff1d(activeOnAnyOffer, activeOnSameOffer)

    year1Enrolled = pd.read_pickle(fileA)

    year1Enrolled = year1Enrolled[year1Enrolled["TIPO_DOC"] == "I"][
        "DOCUMENTO"
    ].unique()

    returnDict = {
        "Enrolled": year1Enrolled.size,
        "Reenrolled": activeOnSameOffer.size,
        "Movements": movements.size,
        "NoData": year1Enrolled.size - activeOnSameOffer.size - movements.size,
    }

    return jsonify(returnDict), 200
