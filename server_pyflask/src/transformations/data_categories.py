import pandas as pd
from .transformation import Transformation
from .common_operations import columnUniqueValues

class availableUnits(Transformation):
    def validate(self)->bool:
        return True

    def transform(self) -> dict:

        table = self.readfile(self.requestData["yearPath"])

        return columnUniqueValues(table,'UNIDAD')

class unitOffers(Transformation):
    def validate(self)->bool:
        return True

    def transform(self) -> dict:

        table = self.readfile(self.requestData["yearPath"])

        return columnUniqueValues(table,'CARRERA',{'UNIDAD':self.requestData['unit']})


