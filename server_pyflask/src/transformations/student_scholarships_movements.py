import pandas as pd
import numpy as np
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName


class StudentScholarshipsMovements(Transformation):
    def transform(
        self, table1: pd.DataFrame, table2: pd.DataFrame, scholarships: pd.DataFrame
    ) -> pd.DataFrame:
        table1 = filterDataFrame(table1, {"TIPO_INSC": "I"})
        table2 = filterDataFrame(table2, {"TIPO_INSC": "I"})

        pseudoMigrations: pd.DataFrame = table1.merge(
            table2, on=[ColName.ID.value], how="inner"
        )

        pseudoMigrations = pseudoMigrations[
            pseudoMigrations[ColName.OFFER.value + "_x"]
            != pseudoMigrations[ColName.OFFER.value + "_y"]
        ]

        pseudoMigrations = pseudoMigrations.merge(
            scholarships,
            left_on=[ColName.ID.value],
            right_on=[ColName.ID_SCHOLARSHIP_FILE.value],
            how="inner",
        )
        pd.set_option("display.max_columns", 6)
        pd.set_option("expand_frame_repr", False)

        print(
            pseudoMigrations[
                [
                    ColName.ID.value,
                    ColName.OFFER.value + "_x",
                    ColName.OFFER.value + "_y",
                    ColName.OFFER.value,
                ]
            ],
            flush=True,
        )

        movements: np.ndarray = np.setdiff1d(activeOnAnyOffer, activeOnSameOffer)

        movementsScholarships: np.ndarray = np.intersect1d(
            movements, scholarships["DNI"].unique()
        )

        return {
            "movements": movements.size,
            "movementScholarships": movementsScholarships.size,
        }
