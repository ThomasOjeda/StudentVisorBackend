from flask import jsonify, request
import pandas as pd

def student_inscriptions(request):
    data = pd.read_excel(
        request.get_json()["sourceFile"],
        usecols=["UNIDAD", "CARRERA", "DOCUMENTO", "TIPO.1","SEXO"],
        converters={'UNIDAD':str,'CARRERA':str,'DOCUMENTO':str,'TIPO.1':str,'SEXO':str} #Convert columns to set types to avoid incorrect type inference
    )

    data.rename(columns={"TIPO.1": "TIPO_DOC"}, inplace=True)
    data.to_pickle(request.get_json()["destinationFile"])

    return (
        jsonify(
            {"created": True, "filename": request.get_json()["destinationFile"]}
        ),
        200,
    )
