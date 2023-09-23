import pandas as pd
import numpy as np
from .transformation import Transformation
from .common_operations import filterDataFrame,columnUniqueValues

class StudentMovements(Transformation):
    def validate(self)->bool:
        return True

    def transform(self) -> dict:
        fileAPath = self.requestData["transformationBody"]["yearAPath"]
        fileBPath = self.requestData["transformationBody"]["yearBPath"]

        table1Filters = {}
        table1Filters['TIPO_INSC']="I"
        table2Filters = {}



        if ("sex" in self.requestData["transformationBody"]):
            table1Filters['SEXO'] = self.requestData["transformationBody"]["sex"]
            table2Filters['SEXO'] = self.requestData["transformationBody"]["sex"]
        
        if ("unitA" in self.requestData["transformationBody"]):
            table1Filters['UNIDAD'] = self.requestData["transformationBody"]["unitA"]

        if ("unitB" in self.requestData["transformationBody"]):
            table2Filters['UNIDAD'] = self.requestData["transformationBody"]["unitB"]


        table1 = self.readfile(fileAPath)
        table2 = self.readfile(fileBPath)
        table1 = filterDataFrame(table1,table1Filters)
        table2 = filterDataFrame(table2,table2Filters)

        activeOnAnyOffer = table1.merge(table2, on="DOCUMENTO", how="inner")
        activeOnSameOffer = table1.merge(table2, on=["DOCUMENTO", "CARRERA"], how="inner")
        activeOnAnyOffer = columnUniqueValues(activeOnAnyOffer,"DOCUMENTO")
        activeOnSameOffer = columnUniqueValues(activeOnSameOffer,"DOCUMENTO")

        movements = np.setdiff1d(activeOnAnyOffer, activeOnSameOffer)

        year1Enrolled = columnUniqueValues(table1, #Table 1 is already filtered
            "DOCUMENTO"
        )

        return  {
            "Enrolled": year1Enrolled.size,
            "Reenrolled": activeOnSameOffer.size,
            "Movements": movements.size,
            "NoData": year1Enrolled.size - activeOnSameOffer.size - movements.size,
        }

        



