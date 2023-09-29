import pandas as pd
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName


class UnitInscriptions(Transformation):
    def transform(self, enrollments) -> pd.DataFrame:
        enrollments = enrollments.groupby(ColName.UNIT.value).count()
        return enrollments[ColName.ID.value]
