import pandas as pd
from .transformation import Transformation
from .common_operations import filterDataFrame,columnUniqueValues

class StudentInscriptions(Transformation):
    def validate(self)->bool:
        return True

    def transform(self) -> dict:

        enrollments = self.readfile(self.requestData["transformationBody"]["yearPath"])

        filters={}
        filters['TIPO_INSC']="I"

        if ("sex" in self.requestData["transformationBody"]):
            filters['SEXO'] = self.requestData["transformationBody"]["sex"]
        
        if ("unit" in self.requestData["transformationBody"]):
            filters['UNIDAD'] = self.requestData["transformationBody"]["unit"]

        enrollments = filterDataFrame(enrollments,filters)

        enrollments = columnUniqueValues(enrollments,'DOCUMENTO')

        return {
            "Enrolled": enrollments.size,
        }
