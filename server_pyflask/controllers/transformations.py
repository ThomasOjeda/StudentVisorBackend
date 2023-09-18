from flask import jsonify, request
import pandas as pd
import numpy as np

from .inscriptions import StudentInscriptions

def student_inscriptions(request):
    transformer = StudentInscriptions(request.get_json())
    result = transformer.transform()
    return jsonify(result), 200

def student_movements(request):
    fileA = request.get_json()["transformationBody"]["yearAPath"]

    fileB = request.get_json()["transformationBody"]["yearBPath"]

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
