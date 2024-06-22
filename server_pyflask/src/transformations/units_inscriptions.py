import pandas as pd
from .transformation import Transformation
from ..utils.enums import ColName


class UnitInscriptions(Transformation):
    def transform(self, enrollments: pd.DataFrame) -> pd.DataFrame:
        enrollments = enrollments.drop_duplicates(
            subset=[ColName.ID.value, ColName.UNIT.value]
        )
        enrollments = enrollments.groupby(ColName.UNIT.value).count()
        # enrollments = enrollments.groupby(ColName.UNIT.value, observed=True).count() #Use this line if column is categorical

        return enrollments[ColName.ID.value]
