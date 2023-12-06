import pandas as pd
from .transformation import Transformation
from .common_operations import filterDataFrame
from ..utils.enums import ColName


class StudentScholarshipsMovements(Transformation):
    def transform(
        self, table1: pd.DataFrame, table2: pd.DataFrame, scholarships: pd.DataFrame
    ) -> pd.DataFrame:
        pd.set_option("display.max_columns", 6)
        pd.set_option("expand_frame_repr", False)

        table1 = filterDataFrame(table1, {ColName.INSC_TYPE.value: "i"})
        table2 = filterDataFrame(table2, {ColName.INSC_TYPE.value: "i"})

        pseudoMigrations: pd.DataFrame = table1.merge(
            table2, on=[ColName.ID.value], how="inner"
        )

        # Conversion from categorical to string to allow comparison
        pseudoMigrations[ColName.OFFER.value + "_x"] = pseudoMigrations[
            ColName.OFFER.value + "_x"
        ].astype(str)

        pseudoMigrations[ColName.OFFER.value + "_y"] = pseudoMigrations[
            ColName.OFFER.value + "_y"
        ].astype(str)

        pseudoMigrations = pseudoMigrations[
            pseudoMigrations[ColName.OFFER.value + "_x"]
            != pseudoMigrations[ColName.OFFER.value + "_y"]
        ]

        pseudoMigrations = pseudoMigrations.merge(
            scholarships,
            on=ColName.ID.value,
            how="inner",
        )

        pseudoMigrations = pseudoMigrations[
            pseudoMigrations[ColName.OFFER.value + "_y"]
            == pseudoMigrations[ColName.OFFER.value]
        ]

        print(
            pseudoMigrations[
                [
                    ColName.OFFER.value + "_x",
                    ColName.OFFER.value + "_y",
                    ColName.OFFER.value,
                    ColName.ID.value,
                ]
            ],
            flush=True,
        )

        pseudoMigrations = (
            pseudoMigrations.drop_duplicates(subset=[ColName.ID.value])
            .groupby(ColName.OFFER.value, observed=True)[
                ColName.OFFER.value
            ]  # observed only applies if grouping by categorical columns.
            .count()
        )

        return pseudoMigrations
