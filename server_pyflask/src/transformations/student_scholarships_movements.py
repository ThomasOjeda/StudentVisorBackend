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

        # change the names of the activity columns to avoid conflicts
        activity = activity.rename(
            columns={
                ColName.UNIT.value + "_x": "DX[" + ColName.UNIT.value + "]",
                ColName.OFFER.value + "_x": "DX[" + ColName.OFFER.value + "]",
                ColName.INSC_TYPE.value + "_x": "DX[" + ColName.INSC_TYPE.value + "]",
                ColName.SEX.value + "_x": "DX[" + ColName.SEX.value + "]",

                ColName.UNIT.value + "_y": "DXY[" + ColName.UNIT.value + "]",
                ColName.OFFER.value + "_y": "DXY[" + ColName.OFFER.value + "]",
                ColName.INSC_TYPE.value + "_y": "DXY[" + ColName.INSC_TYPE.value + "]",
                ColName.SEX.value + "_y": "DXY[" + ColName.SEX.value + "]",
            }
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
            activity["DX[" + ColName.OFFER.value + "]"] != activity["DXY[" + ColName.OFFER.value + "]"]
        ]
        differentActivityWithScholarships = differentActivity.merge(
            scholarships,
            on=ColName.ID.value,
            how="inner",
        )

        differentActivityWithScholarships = differentActivityWithScholarships.rename(
            columns={
                ColName.UNIT.value : "DB[" + ColName.UNIT.value + "]",
                ColName.OFFER.value : "DB[" + ColName.OFFER.value + "]",
            }
        )

        differentActivityWithScholarships: pd.DataFrame = (
            differentActivityWithScholarships.loc[
                differentActivityWithScholarships["DXY[" + ColName.OFFER.value + "]"]
                == differentActivityWithScholarships["DB[" + ColName.OFFER.value + "]"]
            ]
        )

        differentActivityWithScholarshipsUniques : pd.DataFrame = differentActivityWithScholarships.drop_duplicates(subset=[ColName.ID.value])

        result : pd.DataFrame = (
            differentActivityWithScholarshipsUniques
            .groupby("DB[" + ColName.OFFER.value + "]")[
                "DB[" + ColName.OFFER.value + "]"
            ]  # if grouping by categorical column, set observed=True
            .count()
        )

        return result
