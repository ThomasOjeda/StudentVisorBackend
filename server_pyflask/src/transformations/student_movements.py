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

        # We need to do these conversions because a lot of operations work differently if the columns are of type categorical

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

        sameActivity: pd.DataFrame = activity.loc[
            activity["DX[" + ColName.OFFER.value + "]"] == activity["DXY[" + ColName.OFFER.value + "]"]
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
