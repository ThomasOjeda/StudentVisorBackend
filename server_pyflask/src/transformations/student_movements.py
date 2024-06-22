import pandas as pd
import numpy as np
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName


class StudentMovements(Transformation):
    def transform1(self, table1, table2, filters1, filters2) -> pd.DataFrame:
        table1 = filterDataFrame(table1, filters1)
        table2 = filterDataFrame(table2, filters2)

        activeOnAnyOffer = table1.merge(table2, on=ColName.ID.value, how="inner")
        activeOnSameOffer = table1.merge(
            table2, on=[ColName.ID.value, ColName.OFFER.value], how="inner"
        )
        activeOnAnyOffer = columnUniqueValues(activeOnAnyOffer, ColName.ID.value)
        activeOnSameOffer = columnUniqueValues(activeOnSameOffer, ColName.ID.value)

        movements = np.setdiff1d(activeOnAnyOffer, activeOnSameOffer)

        year1Enrolled = columnUniqueValues(
            table1, ColName.ID.value  # Table 1 is already filtered
        )

        return {
            "Enrolled": year1Enrolled.size,
            "Reenrolled": activeOnSameOffer.size,
            "Movements": movements.size,
            "NoData": year1Enrolled.size - activeOnSameOffer.size - movements.size,
        }

    def transform(self, table1, table2, filters1, filters2) -> pd.DataFrame:
        table1 = filterDataFrame(table1, filters1)
        table2 = filterDataFrame(table2, filters2)

        activity = table1.merge(table2, on=ColName.ID.value, how="inner")

        # We need to do these conversions because a lot of operations work differently if the columns are of type categorical

        """
        activity[ColName.OFFER.value + "_x"] = activity[
            ColName.OFFER.value + "_x"
        ].astype(str)

        activity[ColName.OFFER.value + "_y"] = activity[
            ColName.OFFER.value + "_y"
        ].astype(str)
        """

        differentActivity = activity[
            activity[ColName.OFFER.value + "_x"] != activity[ColName.OFFER.value + "_y"]
        ]

        sameActivity = activity[
            activity[ColName.OFFER.value + "_x"] == activity[ColName.OFFER.value + "_y"]
        ]

        differentActivityIds = columnUniqueValues(differentActivity, ColName.ID.value)

        sameActivityIds = columnUniqueValues(sameActivity, ColName.ID.value)

        inscriptions = columnUniqueValues(table1, ColName.ID.value)

        differentActivityIds = np.setdiff1d(differentActivityIds, sameActivityIds)

        return {
            "Enrolled": inscriptions.size,
            "Reenrolled": sameActivityIds.size,
            "Movements": differentActivityIds.size,
            "NoData": inscriptions.size
            - differentActivityIds.size
            - sameActivityIds.size,
        }
