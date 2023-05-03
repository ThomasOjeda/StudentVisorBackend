import pandas as pd
import numpy as np
import json
import sys 
def studentMovements(year1Filename, year2Filename):

    table1 = pd.read_pickle(year1Filename)

    table2 = pd.read_pickle(year2Filename)

    table1 = table1[table1["TIPO_DOC"] == "I"]

    activeOnAnyOffer = table1.merge(table2, on="DOCUMENTO", how="inner")

    activeOnSameOffer = table1.merge(table2, on=["DOCUMENTO", "CARRERA"], how="inner")

    activeOnAnyOffer = activeOnAnyOffer["DOCUMENTO"].unique()

    activeOnSameOffer = activeOnSameOffer["DOCUMENTO"].unique()

    #print(activeOnAnyOffer.type)

    #print(activeOnSameOffer.type)

    movements = np.setdiff1d(activeOnAnyOffer, activeOnSameOffer)

    year1Enrolled = pd.read_pickle(year1Filename)

    year1Enrolled = year1Enrolled[year1Enrolled["TIPO_DOC"] == "I"][
        "DOCUMENTO"
    ].unique()

    returnDict = {
        "Enrolled" : year1Enrolled.size,
        "Reenrolled" : activeOnSameOffer.size,
        "Movements": movements.size,
        "NoData" : year1Enrolled.size - activeOnSameOffer.size - movements.size
    }

    #print(returnDict)

    return json.dumps(returnDict)

#studentMovements(sys.argv[1],sys.argv[2])