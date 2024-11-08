from flask import jsonify, request
import pandas as pd
from ..utils.enums import RawFileColName, ColName
from ..utils.normalizers import (
    cleanColumns,
    scholarshipOfferNamesNormalization,
    inscriptionTypeNormalization,
    studentInscriptionsOfferNamesNormalization,
    unitsNormalization,
)
import time
import os


def student_inscriptions(request):

    # current = time.process_time()
    # print("start time" + str(time.process_time() - current), flush=True)

    data: pd.DataFrame = pd.read_excel(
        request.get_json()["sourceFile"],
        header=[
            1
        ],  # This is necessary as these files contain 2 headers, we want the second
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
    # print("read_excel time" + str(time.process_time() - current), flush=True)

    data = data.dropna()
    # print("dropna time" + str(time.process_time() - current), flush=True)

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
    # print("rename time" + str(time.process_time() - current), flush=True)

    data = cleanColumns(
        data,
        [
            ColName.UNIT.value,
            ColName.OFFER.value,
            ColName.ID.value,
            ColName.INSC_TYPE.value,
            ColName.SEX.value,
        ],
    )
    # print("delete tildes time" + str(time.process_time() - current), flush=True)

    data = inscriptionTypeNormalization(data)

    """
    print(
        "inscription type normalization time" + str(time.process_time() - current),
        flush=True,
    ) 
    """

    data = studentInscriptionsOfferNamesNormalization(data)

    data = unitsNormalization(data)

    """
    print(
        "inscription normalization time" + str(time.process_time() - current),
        flush=True,
    )
    """
    """
    data = convertColumnsToCategorical(
        data,
        [
            ColName.UNIT.value,
            ColName.OFFER.value,
            ColName.INSC_TYPE.value,
            ColName.SEX.value,
        ],
    )
    """
    """
    print(
        "columns to categorical time" + str(time.process_time() - current), flush=True
    )
    """

    saveToPickle(data, request.get_json()["destinationFile"])

    """
    print(
        "to pickle type normalization time" + str(time.process_time() - current),
        flush=True,
    )
    """

    return (
        jsonify({"created": True, "filename": request.get_json()["destinationFile"]}),
        200,
    )


def student_scholarships(request):
    data = loadRawScholarshipsFile(
        request.get_json()["sourceFile"], request.get_json()["type"]
    )

    data = normalizeScholarships(data)

    saveToPickle(data, request.get_json()["destinationFile"])

    return (
        jsonify({"created": True, "filename": request.get_json()["destinationFile"]}),
        200,
    )


def update_student_scholarships(request):
    newData: pd.DataFrame = loadRawScholarshipsFile(
        request.get_json()["newDataFile"], request.get_json()["type"]
    )

    newData = normalizeScholarships(newData)

    # print(newData.dtypes, flush=True)

    toBeUpdated: pd.DataFrame = pd.read_pickle(request.get_json()["currentDataFile"])

    # print(toBeUpdated.dtypes, flush=True)

    toBeUpdated = pd.concat(
        [toBeUpdated, newData], ignore_index=True
    )  # Ignore index creates a new index for the dataframe (unique values)

    # print(toBeUpdated.dtypes, flush=True)

    """
    toBeUpdated = convertColumnsToCategorical(
        toBeUpdated, [ColName.UNIT.value, ColName.OFFER.value]
    )
    """

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

    saveToPickle(toBeUpdated, request.get_json()["destinationFile"])

    return (
        jsonify({"created": True, "filename": request.get_json()["destinationFile"]}),
        200,
    )


def normalizeScholarships(data: pd.DataFrame) -> pd.DataFrame:
    data = data.dropna()

    data = cleanColumns(
        data,
        [ColName.UNIT.value, ColName.OFFER.value, ColName.ID.value],
    )

    data = scholarshipOfferNamesNormalization(data)  # Must be done after column rename

    data = unitsNormalization(data)

    """ data = convertColumnsToCategorical(data, [ColName.UNIT.value, ColName.OFFER.value]) """

    return data


def loadRawScholarshipsFile(sourceFile: str, fileType: str) -> pd.DateOffset:
    columnNames = []
    convertersDict = {}
    columnRenames = {}

    if fileType == "student-scholarships-belgrano":
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
    elif fileType == "student-scholarships-progresar":
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
        sourceFile,
        usecols=columnNames,
        converters=convertersDict,  # Convert columns to set types to avoid incorrect type inference
    )

    data.rename(
        columns=columnRenames,
        inplace=True,
    )

    return data


# Saves a dataframe to a pickle file. If the environment is development, it also saves a copy in excel format
def saveToPickle(data: pd.DataFrame, destinationFile: str):
    toPickle(data, destinationFile)
    if os.environ["DEBUG_MODE"] == "True":
        toExcel(data, destinationFile + "excel.xlsx")


def toPickle(data: pd.DataFrame, destinationFile: str):
    data.to_pickle(destinationFile)


def toExcel(data: pd.DataFrame, destinationFile: str):
    data.to_excel(destinationFile)


def saveToExcel(request):

    data: pd.DataFrame = pd.read_pickle(request.get_json()["sourceFile"])

    toExcel(data, request.get_json()["destinationFile"])

    return (
        jsonify({"created": True, "filename": request.get_json()["destinationFile"]}),
        200,
    )
