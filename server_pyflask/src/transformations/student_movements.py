import pandas as pd
import numpy as np
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName


class StudentMovements(Transformation):
    def transform(self, table1, table2, filters1, filters2) -> pd.DataFrame:
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
