import pandas as pd
import numpy as np
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName


class StudentMovements(Transformation):
    def validate(self) -> bool:
        return True

    def transform(self) -> dict:
        fileAPath = self.requestData["transformationBody"]["yearAPath"]
        fileBPath = self.requestData["transformationBody"]["yearBPath"]

        table1Filters = {}
        table1Filters["TIPO_INSC"] = "I"
        table2Filters = {}

        if "sex" in self.requestData["transformationBody"]:
            table1Filters[ColName.SEX.value] = self.requestData["transformationBody"][
                "sex"
            ]
            table2Filters[ColName.SEX.value] = self.requestData["transformationBody"][
                "sex"
            ]

        if "unitA" in self.requestData["transformationBody"]:
            table1Filters[ColName.UNIT.value] = self.requestData["transformationBody"][
                "unitA"
            ]

        if "unitB" in self.requestData["transformationBody"]:
            table2Filters[ColName.UNIT.value] = self.requestData["transformationBody"][
                "unitB"
            ]

        if "offerA" in self.requestData["transformationBody"]:
            table1Filters[ColName.OFFER.value] = self.requestData["transformationBody"][
                "offerA"
            ]

        if "offerB" in self.requestData["transformationBody"]:
            table2Filters[ColName.OFFER.value] = self.requestData["transformationBody"][
                "offerB"
            ]

        print(table1Filters, flush=True)
        print(table2Filters, flush=True)
        table1 = self.readfile(fileAPath)
        table2 = self.readfile(fileBPath)
        table1 = filterDataFrame(table1, table1Filters)
        table2 = filterDataFrame(table2, table2Filters)

        activeOnAnyOffer = table1.merge(table2, on=ColName.ID.value, how="inner")
        activeOnSameOffer = table1.merge(
            table2, on=[ColName.ID.value, ColName.OFFER.value], how="inner"
        )
        activeOnAnyOffer = columnUniqueValues(activeOnAnyOffer, ColName.ID.value)
        activeOnSameOffer = columnUniqueValues(activeOnSameOffer, ColName.ID.value)

        movements = np.setdiff1d(activeOnAnyOffer, activeOnSameOffer)

        year1Enrolled = columnUniqueValues(
            table1, ColName.ID.value  # Table 1 is already filtered
        )

        return {
            "Enrolled": year1Enrolled.size,
            "Reenrolled": activeOnSameOffer.size,
            "Movements": movements.size,
            "NoData": year1Enrolled.size - activeOnSameOffer.size - movements.size,
        }
