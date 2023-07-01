from flask import Blueprint
from .student_inscriptions import StudentInscriptionsRoutes

conversionsBP = Blueprint("conversions", __name__, url_prefix="/")


@conversionsBP.route("/studentinscriptions", methods=["GET"])
def mainRoute():
    import pandas as pd

    def toPickle(original, destination):
        data = pd.read_excel(
            original, usecols=["UNIDAD", "CARRERA", "DOCUMENTO", "TIPO.1"]
        )

        data.rename(columns={"TIPO.1": "TIPO_DOC"}, inplace=True)
        data.to_pickle(destination)

    toPickle("/studentsdata/2015_students.xlsx", "/studentsdata/2015_students.pickle")

    return "responseee"
