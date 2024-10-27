import pandas as pd
from .transformation import Transformation
from .common_operations import filterDataFrame
from ..utils.enums import ColName


class StudentScholarshipsMovements(Transformation):
    def transform(
        self,
        table1: pd.DataFrame,
        table2: pd.DataFrame,
        scholarships: pd.DataFrame,
        filters1: object,
        filters2: object,
        schFilters: object,
    ) -> pd.DataFrame:
        table1 = filterDataFrame(table1, filters1)
        table2 = filterDataFrame(table2, filters2)
        scholarships = filterDataFrame(scholarships, schFilters)

        activity: pd.DataFrame = table1.merge(
            table2, on=[ColName.ID.value], how="inner"
        )

        # Conversion from categorical to string to allow comparison between series (only if columns are categorical)
        """
        activity[ColName.OFFER.value + "_x"] = activity[
            ColName.OFFER.value + "_x"
        ].astype(str)

        activity[ColName.OFFER.value + "_y"] = activity[
            ColName.OFFER.value + "_y"
        ].astype(str)
        """

        differentActivity: pd.DataFrame = activity.loc[
            activity[ColName.OFFER.value + "_x"] != activity[ColName.OFFER.value + "_y"]
        ]
        differentActivityWithScholarships = differentActivity.merge(
            scholarships,
            on=ColName.ID.value,
            how="inner",
        )

        differentActivityWithScholarships: pd.DataFrame = (
            differentActivityWithScholarships.loc[
                differentActivityWithScholarships[ColName.OFFER.value + "_y"]
                == differentActivityWithScholarships[ColName.OFFER.value]
            ]
        )

        differentActivityWithScholarships = (
            differentActivityWithScholarships.drop_duplicates(subset=[ColName.ID.value])
            .groupby(ColName.OFFER.value)[
                ColName.OFFER.value
            ]  # if grouping by categorical column, set observed=True
            .count()
        )

        return differentActivityWithScholarships
