import pandas as pd
import numpy as np
from .transformation import Transformation

class StudentMovements(Transformation):
    def validate(self)->bool:
        return True

    def transform(self) -> dict:
        fileA = self.requestData["transformationBody"]["yearAPath"]

        fileB = self.requestData["transformationBody"]["yearBPath"]

        sex = None
        if ("sex" in self.requestData["transformationBody"]):
            sex = self.requestData["transformationBody"]["sex"]
        
        unitA=None
        if ("unitA" in self.requestData["transformationBody"]):
            unitA = self.requestData["transformationBody"]["unitA"]

        unitB=None
        if ("unitB" in self.requestData["transformationBody"]):
            unitB = self.requestData["transformationBody"]["unitB"]

        table1 = self.readfile(fileA)
        table2 = self.readfile(fileB)
        table1 = self.filterDataFrame(table1,insc_type='I',sex=sex,unit=unitA)
        table2 = self.filterDataFrame(table2,sex=sex,unit=unitB)

        activeOnAnyOffer = table1.merge(table2, on="DOCUMENTO", how="inner")
        activeOnSameOffer = table1.merge(table2, on=["DOCUMENTO", "CARRERA"], how="inner")
        activeOnAnyOffer = activeOnAnyOffer["DOCUMENTO"].unique()
        activeOnSameOffer = activeOnSameOffer["DOCUMENTO"].unique()

        movements = np.setdiff1d(activeOnAnyOffer, activeOnSameOffer)

        year1Enrolled = table1[ #Table 1 is already filtered
            "DOCUMENTO"
        ].unique()

        returnDict = {
            "Enrolled": year1Enrolled.size,
            "Reenrolled": activeOnSameOffer.size,
            "Movements": movements.size,
            "NoData": year1Enrolled.size - activeOnSameOffer.size - movements.size,
        }

        return returnDict

    def filterDataFrame(self,data,insc_type=None,sex=None,unit=None):
        filteredData = data
        if (insc_type!=None):
            filteredData = filteredData[filteredData['TIPO_DOC']=='I']
        if (sex!=None):
            filteredData = filteredData[filteredData['SEXO']==sex]
        if (unit!=None):
            filteredData = filteredData[filteredData['UNIDAD']==unit]

        return filteredData

        



