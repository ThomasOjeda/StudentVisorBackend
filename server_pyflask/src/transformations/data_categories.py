import pandas as pd
from .transformation import Transformation
from .common_operations import columnUniqueValues
from ..utils.enums import ColName


class availableUnits(Transformation):
    def __init__(self, table):
        self.table = table

    def transform(self) -> pd.DataFrame:
        return columnUniqueValues(self.table, ColName.UNIT.value)


class unitOffers(Transformation):
    def __init__(self, table, unit):
        self.table = table
        self.unit = unit

    def transform(self) -> pd.DataFrame:
        return columnUniqueValues(
            self.table, ColName.OFFER.value, {ColName.UNIT.value: self.unit}
        )
