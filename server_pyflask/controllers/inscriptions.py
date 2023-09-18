import pandas as pd
from .transformation import Transformation


class StudentInscriptions(Transformation):
    def validate(self, data: dict):
        print("validate", flush=True)

    def transform(self) -> dict:
        enrollments = self.readfile(self.requestData["transformationBody"]["yearPath"])
        enrollments = enrollments[enrollments["TIPO_DOC"] == "I"]["DOCUMENTO"].unique()

        returnDict = {
            "Enrolled": enrollments.size,
        }
        return returnDict
