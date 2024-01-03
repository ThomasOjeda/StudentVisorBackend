import pandas as pd
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName


class StudentMigrations(Transformation):
    def transform(
        self, table1, table2, filters1, filters2, mode="dest_offer"
    ) -> pd.DataFrame:
        table1 = filterDataFrame(table1, filters1)
        table2 = filterDataFrame(table2, filters2)

        activity = table1.merge(table2, on=ColName.ID.value, how="inner")

        activity[ColName.OFFER.value + "_x"] = activity[
            ColName.OFFER.value + "_x"
        ].astype(str)

        activity[ColName.OFFER.value + "_y"] = activity[
            ColName.OFFER.value + "_y"
        ].astype(str)

        differentActivity = activity[
            activity[ColName.OFFER.value + "_x"] != activity[ColName.OFFER.value + "_y"]
        ]

        if mode == "dest_unit":
            differentActivity = differentActivity[
                differentActivity[ColName.UNIT.value + "_x"]
                != differentActivity[ColName.UNIT.value + "_y"]
            ]

        differentActivity = differentActivity.drop_duplicates(
            subset=[ColName.ID.value, ColName.OFFER.value + "_y"]
        )

        sameActivity = activity[
            activity[ColName.OFFER.value + "_x"] == activity[ColName.OFFER.value + "_y"]
        ]

        sameActivityIds = columnUniqueValues(sameActivity, ColName.ID.value)

        differentActivity = differentActivity[
            ~differentActivity[ColName.ID.value].isin(sameActivityIds)
        ]

        if mode == "dest_unit":
            differentActivity = differentActivity.groupby(
                ColName.UNIT.value + "_y", observed=True
            ).count()

        if mode == "dest_offer":
            differentActivity = differentActivity.groupby(
                ColName.OFFER.value + "_y", observed=True
            ).count()

        return differentActivity[ColName.ID.value]
