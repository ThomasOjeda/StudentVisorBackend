import pandas as pd
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName


class StudentInscriptions(Transformation):
    def validate(self) -> bool:
        return True

    def transform(self) -> dict:
        enrollments = self.readfile(self.requestData["transformationBody"]["yearPath"])

        filters = {}
        filters[ColName.INSC_TYPE.value] = "I"

        if "sex" in self.requestData["transformationBody"]:
            filters[ColName.SEX.value] = self.requestData["transformationBody"]["sex"]

        if "unit" in self.requestData["transformationBody"]:
            filters[ColName.UNIT.value] = self.requestData["transformationBody"]["unit"]

        enrollments = filterDataFrame(enrollments, filters)

        enrollments = columnUniqueValues(enrollments, ColName.ID.value)

        return {
            "Enrolled": enrollments.size,
        }
