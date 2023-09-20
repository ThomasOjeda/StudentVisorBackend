import pandas as pd
from .transformation import Transformation
from .common_operations import filterDataFrame

class StudentInscriptions(Transformation):
    def validate(self)->bool:
        return True

    def transform(self) -> dict:

        enrollments = self.readfile(self.requestData["transformationBody"]["yearPath"])

        sex = None
        if ("sex" in self.requestData["transformationBody"]):
            sex = self.requestData["transformationBody"]["sex"]
        
        unit=None
        if ("unit" in self.requestData["transformationBody"]):
            unit = self.requestData["transformationBody"]["unit"]

        enrollments = filterDataFrame(enrollments,insc_type="I",sex=sex,unit=unit)

        enrollments = enrollments["DOCUMENTO"].unique()

        return {
            "Enrolled": enrollments.size,
        }
