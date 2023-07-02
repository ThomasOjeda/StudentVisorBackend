from flask import Blueprint, jsonify, request
import pandas as pd
import logging

conversionsBP = Blueprint("conversions", __name__, url_prefix="/")


@conversionsBP.route("/studentinscriptions", methods=["POST"])
def post():
    def toPickle(original, destination):
        data = pd.read_excel(
            original, usecols=["UNIDAD", "CARRERA", "DOCUMENTO", "TIPO.1"]
        )

        data.rename(columns={"TIPO.1": "TIPO_DOC"}, inplace=True)
        data.to_pickle(destination)

    toPickle(
        request.get_json()["data"]["sourceFile"],
        request.get_json()["data"]["destinationFile"],
    )

    return jsonify({"created": True}), 200
