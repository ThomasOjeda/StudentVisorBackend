from flask import jsonify, request
import pandas as pd
from ..utils.enums import RawFileColName, ColName
from ..utils.normalizers import (
    deleteTildesInColumns,
    convertColumnsToCategorical,
    offerNamesNormalization,
    inscriptionTypeNormalization,
    studentInscriptionsOfferNormalization,
)


def student_inscriptions(request):
    data = pd.read_excel(
        request.get_json()["sourceFile"],
        header=[1],
        usecols=[
            RawFileColName.UNIT.value,
            RawFileColName.OFFER.value,
            RawFileColName.ID.value,
            RawFileColName.INSC_TYPE.value,
            RawFileColName.SEX.value,
        ],
        converters={
            RawFileColName.UNIT.value: str,
            RawFileColName.OFFER.value: str,
            RawFileColName.ID.value: str,
            RawFileColName.INSC_TYPE.value: str,
            RawFileColName.SEX.value: str,
        },  # Convert columns to set types to avoid incorrect type inference
    )

    data = data.dropna()

    data.rename(
        columns={
            RawFileColName.UNIT.value: ColName.UNIT.value,
            RawFileColName.OFFER.value: ColName.OFFER.value,
            RawFileColName.ID.value: ColName.ID.value,
            RawFileColName.INSC_TYPE.value: ColName.INSC_TYPE.value,
            RawFileColName.SEX.value: ColName.SEX.value,
        },
        inplace=True,
    )

    data = deleteTildesInColumns(
        data,
        [
            ColName.UNIT.value,
            ColName.OFFER.value,
            ColName.ID.value,
            ColName.INSC_TYPE.value,
            ColName.SEX.value,
        ],
    )

    data = inscriptionTypeNormalization(data)

    data = studentInscriptionsOfferNormalization(data)

    data = convertColumnsToCategorical(
        data,
        [
            ColName.UNIT.value,
            ColName.OFFER.value,
            ColName.INSC_TYPE.value,
            ColName.SEX.value,
        ],
    )

    data.to_pickle(request.get_json()["destinationFile"])

    data.to_excel(request.get_json()["destinationFile"] + "excel.xlsx")

    return (
        jsonify({"created": True, "filename": request.get_json()["destinationFile"]}),
        200,
    )


def student_scholarships(request):
    columnNames = []
    convertersDict = {}
    columnRenames = {}

    if request.get_json()["type"] == "student-scholarships-belgrano":
        columnNames = [
            RawFileColName.BELGRANO_UNIT.value,
            RawFileColName.BELGRANO_OFFER.value,
            RawFileColName.BELGRANO_ID.value,
        ]
        convertersDict = {
            RawFileColName.BELGRANO_UNIT.value: str,
            RawFileColName.BELGRANO_OFFER.value: str,
            RawFileColName.BELGRANO_ID.value: str,
        }
        columnRenames = {
            RawFileColName.BELGRANO_UNIT.value: ColName.UNIT.value,
            RawFileColName.BELGRANO_OFFER.value: ColName.OFFER.value,
            RawFileColName.BELGRANO_ID.value: ColName.ID.value,
        }
    elif request.get_json()["type"] == "student-scholarships-progresar":
        columnNames = [
            RawFileColName.PROGRESAR_UNIT.value,
            RawFileColName.PROGRESAR_OFFER.value,
            RawFileColName.PROGRESAR_ID.value,
        ]
        convertersDict = {
            RawFileColName.PROGRESAR_UNIT.value: str,
            RawFileColName.PROGRESAR_OFFER.value: str,
            RawFileColName.PROGRESAR_ID.value: str,
        }
        columnRenames = {
            RawFileColName.PROGRESAR_UNIT.value: ColName.UNIT.value,
            RawFileColName.PROGRESAR_OFFER.value: ColName.OFFER.value,
            RawFileColName.PROGRESAR_ID.value: ColName.ID.value,
        }

    data: pd.DataFrame = pd.read_excel(
        request.get_json()["sourceFile"],
        usecols=columnNames,
        converters=convertersDict,  # Convert columns to set types to avoid incorrect type inference
    )

    data = data.dropna()

    data.rename(
        columns=columnRenames,
        inplace=True,
    )

    data = deleteTildesInColumns(
        data,
        [ColName.UNIT.value, ColName.OFFER.value, ColName.ID.value],
    )

    data = offerNamesNormalization(data)  # Must be done after column rename

    data = convertColumnsToCategorical(data, [ColName.UNIT.value, ColName.OFFER.value])

    data.to_pickle(request.get_json()["destinationFile"])

    data.to_excel(request.get_json()["destinationFile"] + "excel.xlsx")

    return (
        jsonify({"created": True, "filename": request.get_json()["destinationFile"]}),
        200,
    )
