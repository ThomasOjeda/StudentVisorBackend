from flask import jsonify, request
import pandas as pd
from ..utils.enums import ColName


def student_inscriptions(request):
    data = pd.read_excel(
        request.get_json()["sourceFile"],
        usecols=[
            ColName.UNIT.value,
            ColName.OFFER.value,
            ColName.ID.value,
            "TIPO.1",
            ColName.SEX.value,
        ],
        converters={
            ColName.UNIT.value: str,
            ColName.OFFER.value: str,
            ColName.ID.value: str,
            "TIPO.1": str,
            ColName.SEX.value: str,
        },  # Convert columns to set types to avoid incorrect type inference
    )

    data.rename(columns={"TIPO.1": ColName.INSC_TYPE.value}, inplace=True)

    data.to_pickle(request.get_json()["destinationFile"])

    return (
        jsonify({"created": True, "filename": request.get_json()["destinationFile"]}),
        200,
    )
