import pandas as pd
import numpy as np
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

        activity = activity[
            activity[ColName.OFFER.value + "_x"] != activity[ColName.OFFER.value + "_y"]
        ]

        if mode == "dest_unit":
            activity = activity[
                activity[ColName.UNIT.value + "_x"]
                != activity[ColName.UNIT.value + "_y"]
            ]

        activity = activity.drop_duplicates(
            subset=[ColName.ID.value, ColName.OFFER.value + "_y"]
        )

        if mode == "dest_unit":
            activity = activity.groupby(ColName.UNIT.value + "_y").count()

        if mode == "dest_offer":
            activity = activity.groupby(ColName.OFFER.value + "_y").count()

        return activity[ColName.ID.value]
