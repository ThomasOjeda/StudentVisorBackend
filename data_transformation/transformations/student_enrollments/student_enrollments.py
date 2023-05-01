import pandas as pd
import numpy as np
import json

def studentEnrollments(yearFilename):

    enrollments = pd.read_pickle(yearFilename)

    enrollments = enrollments[enrollments["TIPO_DOC"] == "I"][
        "DOCUMENTO"
    ].unique()

    returnDict = {
        "Enrolled" : enrollments.size,
    }

    return json.dumps(returnDict)