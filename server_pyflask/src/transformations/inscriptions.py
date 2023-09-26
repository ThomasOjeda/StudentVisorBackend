import pandas as pd
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName


class StudentInscriptions(Transformation):
    def __init__(self, enrollments: pd.DataFrame, filters: dict):
        self.enrollments = enrollments
        self.filters = filters

    def transform(self) -> pd.DataFrame:
        self.enrollments = filterDataFrame(self.enrollments, self.filters)

        self.enrollments = columnUniqueValues(self.enrollments, ColName.ID.value)

        return {
            "Enrolled": self.enrollments.size,
        }
