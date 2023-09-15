from flask import Blueprint, jsonify, request
import pandas as pd
from ..utils.utils import exception_wrap

conversionsBP = Blueprint("conversions", __name__, url_prefix="/")

@conversionsBP.route("/studentinscriptions", methods=["POST"])
@exception_wrap
def post():
    data = pd.read_excel(
        request.get_json()["data"]["sourceFile"],
        usecols=["UNIDAD", "CARRERA", "DOCUMENTO", "TIPO.1"],
        converters={'UNIDAD':str,'CARRERA':str,'DOCUMENTO':str,'TIPO.1':str} #Convert columns to set types to avoid incorrect type inference
    )

    data.rename(columns={"TIPO.1": "TIPO_DOC"}, inplace=True)
    data.to_pickle(request.get_json()["data"]["destinationFile"])

    return (
        jsonify(
            {"created": True, "filename": request.get_json()["data"]["destinationFile"]}
        ),
        200,
    )
