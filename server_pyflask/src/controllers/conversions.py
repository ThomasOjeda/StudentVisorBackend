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
import time


def converter(value):
    return str(value).lower().strip()


def student_inscriptions(request):

    current = time.process_time()
    # your code here
    print("start time" + str(time.process_time() - current), flush=True)

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
            RawFileColName.UNIT.value: converter,
            RawFileColName.OFFER.value: converter,
            RawFileColName.ID.value: converter,
            RawFileColName.INSC_TYPE.value: converter,
            RawFileColName.SEX.value: converter,
        },  # Convert columns to set types to avoid incorrect type inference
    )
    print("read_excel time" + str(time.process_time() - current), flush=True)

    data = data.dropna()
    print("dropna time" + str(time.process_time() - current), flush=True)

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
    print("rename time" + str(time.process_time() - current), flush=True)

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
    print("delete tildes time" + str(time.process_time() - current), flush=True)

    data = inscriptionTypeNormalization(data)
    print(
        "inscription type normalization time" + str(time.process_time() - current),
        flush=True,
    )

    data = studentInscriptionsOfferNormalization(data)
    print(
        "inscription normalization time" + str(time.process_time() - current),
        flush=True,
    )

    data = convertColumnsToCategorical(
        data,
        [
            ColName.UNIT.value,
            ColName.OFFER.value,
            ColName.INSC_TYPE.value,
            ColName.SEX.value,
        ],
    )
    print(
        "columns to categorical time" + str(time.process_time() - current), flush=True
    )

    data.to_pickle(request.get_json()["destinationFile"])
    print(
        "to pickle type normalization time" + str(time.process_time() - current),
        flush=True,
    )

    return (
        jsonify({"created": True, "filename": request.get_json()["destinationFile"]}),
        200,
    )


def student_scholarships(request):
    data = loadRawScholarshipsFile(request)

    data = normalizeScholarships(data)

    saveScholarships(data, request)

    return (
        jsonify({"created": True, "filename": request.get_json()["destinationFile"]}),
        200,
    )


def update_student_scholarships(request):
    newData: pd.DataFrame = loadRawScholarshipsFile(request)

    newData = normalizeScholarships(newData)

    # print(newData.dtypes, flush=True)

    toBeUpdated: pd.DataFrame = pd.read_pickle(request.get_json()["destinationFile"])

    # print(toBeUpdated.dtypes, flush=True)

    toBeUpdated = pd.concat(
        [toBeUpdated, newData], ignore_index=True
    )  # Ignore index creates a new index for the dataframe (unique values)

    # print(toBeUpdated.dtypes, flush=True)

    toBeUpdated = convertColumnsToCategorical(
        toBeUpdated, [ColName.UNIT.value, ColName.OFFER.value]
    )

    # print(toBeUpdated.dtypes, flush=True)

    # with pd.option_context(
    #     "display.max_rows",
    #     None,
    #     "display.max_columns",
    #     None,
    #     "display.expand_frame_repr",
    #     False,
    # ):
    #     print(toBeUpdated, flush=True)

    saveScholarships(toBeUpdated, request)

    return (
        jsonify({"created": True, "filename": request.get_json()["destinationFile"]}),
        200,
    )


def normalizeScholarships(data: pd.DataFrame) -> pd.DataFrame:
    data = data.dropna()

    data = deleteTildesInColumns(
        data,
        [ColName.UNIT.value, ColName.OFFER.value],
    )

    data = offerNamesNormalization(data)  # Must be done after column rename

    data = convertColumnsToCategorical(data, [ColName.UNIT.value, ColName.OFFER.value])

    return data


def loadRawScholarshipsFile(request) -> pd.DateOffset:
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
            RawFileColName.BELGRANO_UNIT.value: converter,
            RawFileColName.BELGRANO_OFFER.value: converter,
            RawFileColName.BELGRANO_ID.value: converter,
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
            RawFileColName.PROGRESAR_UNIT.value: converter,
            RawFileColName.PROGRESAR_OFFER.value: converter,
            RawFileColName.PROGRESAR_ID.value: converter,
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

    data.rename(
        columns=columnRenames,
        inplace=True,
    )

    return data


def saveScholarships(data: pd.DataFrame, request):
    data.to_pickle(request.get_json()["destinationFile"])

    data.to_excel(request.get_json()["destinationFile"] + "excel.xlsx")


def updateScholarships(data: pd.DataFrame, request):
    return
