import pandas as pd
import numpy as np
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName


class StudentMovements(Transformation):
    def __init__(
        self, table1: pd.DataFrame, table2: pd.DataFrame, filters1: dict, filters2: dict
    ):
        self.table1 = table1
        self.table2 = table2
        self.filters1 = filters1
        self.filters2 = filters2

    def transform(self) -> pd.DataFrame:
        self.table1 = filterDataFrame(self.table1, self.filters1)
        self.table2 = filterDataFrame(self.table2, self.filters2)

        activeOnAnyOffer = self.table1.merge(
            self.table2, on=ColName.ID.value, how="inner"
        )
        activeOnSameOffer = self.table1.merge(
            self.table2, on=[ColName.ID.value, ColName.OFFER.value], how="inner"
        )
        activeOnAnyOffer = columnUniqueValues(activeOnAnyOffer, ColName.ID.value)
        activeOnSameOffer = columnUniqueValues(activeOnSameOffer, ColName.ID.value)

        movements = np.setdiff1d(activeOnAnyOffer, activeOnSameOffer)

        year1Enrolled = columnUniqueValues(
            self.table1, ColName.ID.value  # Table 1 is already filtered
        )

        return {
            "Enrolled": year1Enrolled.size,
            "Reenrolled": activeOnSameOffer.size,
            "Movements": movements.size,
            "NoData": year1Enrolled.size - activeOnSameOffer.size - movements.size,
        }
