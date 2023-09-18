import pandas as pd
import numpy as np
from .transformation import Transformation

class StudentMovements(Transformation):
    def validate(self)->bool:
        return True

    def transform(self) -> dict:
        fileA = self.requestData["transformationBody"]["yearAPath"]

        fileB = self.requestData["transformationBody"]["yearBPath"]

        table1 = self.readfile(fileA)

        table2 = self.readfile(fileB)

        table1 = table1[table1["TIPO_DOC"] == "I"]

        activeOnAnyOffer = table1.merge(table2, on="DOCUMENTO", how="inner")

        activeOnSameOffer = table1.merge(table2, on=["DOCUMENTO", "CARRERA"], how="inner")

        activeOnAnyOffer = activeOnAnyOffer["DOCUMENTO"].unique()

        activeOnSameOffer = activeOnSameOffer["DOCUMENTO"].unique()

        movements = np.setdiff1d(activeOnAnyOffer, activeOnSameOffer)

        year1Enrolled = pd.read_pickle(fileA)

        year1Enrolled = year1Enrolled[year1Enrolled["TIPO_DOC"] == "I"][
            "DOCUMENTO"
        ].unique()

        returnDict = {
            "Enrolled": year1Enrolled.size,
            "Reenrolled": activeOnSameOffer.size,
            "Movements": movements.size,
            "NoData": year1Enrolled.size - activeOnSameOffer.size - movements.size,
        }

        return returnDict
