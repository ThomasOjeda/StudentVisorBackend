import pandas as pd
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName


class UnitInscriptions(Transformation):
    def transform(self, enrollments, filters) -> pd.DataFrame:
        enrollments = filterDataFrame(enrollments, filters)

        enrollments = columnUniqueValues(enrollments, ColName.ID.value)

        return {
            "Enrolled": enrollments.size,
        }
