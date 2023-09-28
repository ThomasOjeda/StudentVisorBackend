import pandas as pd
from .transformation import Transformation
from .common_operations import columnUniqueValues
from ..utils.enums import ColName


class availableUnits(Transformation):
    def transform(self, table) -> pd.DataFrame:
        return columnUniqueValues(table, ColName.UNIT.value)


class unitOffers(Transformation):
    def transform(self, table, unit) -> pd.DataFrame:
        return columnUniqueValues(
            table, ColName.OFFER.value, {ColName.UNIT.value: unit}
        )
