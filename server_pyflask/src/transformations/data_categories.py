import pandas as pd
from .transformation import Transformation
from .common_operations import columnUniqueValues
from ..utils.enums import ColName


class availableUnits(Transformation):
    def validate(self) -> bool:
        return True

    def transform(self) -> dict:
        table = self.readfile(self.requestData["yearPath"])

        return columnUniqueValues(table, ColName.UNIT.value)


class unitOffers(Transformation):
    def validate(self) -> bool:
        return True

    def transform(self) -> dict:
        table = self.readfile(self.requestData["yearPath"])

        return columnUniqueValues(
            table, ColName.OFFER.value, {ColName.UNIT.value: self.requestData["unit"]}
        )
