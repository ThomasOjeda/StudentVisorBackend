import pandas as pd
import numpy as np
import sys

def studentMovements(year1Filename, year2Filename):

    table1 = pd.read_pickle(year1Filename)

    table2 = pd.read_pickle(year2Filename)

    table1 = table1[table1["TIPO_DOC"] == "I"]

    activeOnAnyOffer = table1.merge(table2, on="DOCUMENTO", how="inner")

    activeOnSameOffer = table1.merge(table2, on=["DOCUMENTO", "CARRERA"], how="inner")

    activeOnAnyOffer = activeOnAnyOffer["DOCUMENTO"].unique()

    activeOnSameOffer = activeOnSameOffer["DOCUMENTO"].unique()

    movements = np.setdiff1d(activeOnAnyOffer, activeOnSameOffer)

    year1Enrolled = pd.read_pickle(year1Filename)

    year1Enrolled = year1Enrolled[year1Enrolled["TIPO_DOC"] == "I"][
        "DOCUMENTO"
    ].unique()

    print(
        "year1Enrolled {}, Same offer {}, Movements {}, No data {}".format(
            year1Enrolled.size,
            activeOnSameOffer.size,
            movements.size,
            year1Enrolled.size - activeOnSameOffer.size - movements.size,
        )
    )
    sys.stdout.flush()



studentMovements("data_transformation/data/2015_students.pickle", "data_transformation/data/2016_students.pickle")
