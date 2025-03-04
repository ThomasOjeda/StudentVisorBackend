import pandas as pd
from .transformation import Transformation
from .common_operations import filterDataFrame, columnUniqueValues
from ..utils.enums import ColName
from collections import Counter


class StudentMigrations(Transformation):
    def transform1(
        self, table1, table2, filters1, filters2, mode="dest_offer"
    ) -> pd.DataFrame:
        table1 = filterDataFrame(table1, filters1)
        table2 = filterDataFrame(table2, filters2)

        activity = table1.merge(table2, on=ColName.ID.value, how="inner")

        # The two conversions to string are neccesary when the columns are of type categorical

        """
        activity[ColName.OFFER.value + "_x"] = activity[
            ColName.OFFER.value + "_x"
        ].astype(str)

        activity[ColName.OFFER.value + "_y"] = activity[
            ColName.OFFER.value + "_y"
        ].astype(str)
        """

        differentActivity: pd.DataFrame = activity.loc[
            activity[ColName.OFFER.value + "_x"] != activity[ColName.OFFER.value + "_y"]
        ]

        if mode == "dest_unit":
            differentActivity = differentActivity.loc[
                differentActivity[ColName.UNIT.value + "_x"]
                != differentActivity[ColName.UNIT.value + "_y"]
            ]

        differentActivity = differentActivity.drop_duplicates(
            subset=[ColName.ID.value, ColName.OFFER.value + "_y"]
        )

        sameActivity: pd.DataFrame = activity.loc[
            activity[ColName.OFFER.value + "_x"] == activity[ColName.OFFER.value + "_y"]
        ]

        sameActivityIds = columnUniqueValues(sameActivity, ColName.ID.value)

        differentActivity = differentActivity.loc[
            ~differentActivity[ColName.ID.value].isin(sameActivityIds)
        ]

        # If columns are categorical, the use observed=True in the following groupby

        if mode == "dest_unit":
            differentActivity = differentActivity.groupby(
                ColName.UNIT.value + "_y"
            ).count()

        if mode == "dest_offer":
            differentActivity = differentActivity.groupby(
                ColName.OFFER.value + "_y"
            ).count()

        return differentActivity[ColName.ID.value]

    def transform(
        self, table1, table2, filters1, filters2, mode="dest_offer"
    ) -> pd.DataFrame:
        table1 = filterDataFrame(table1, filters1)
        table2 = filterDataFrame(table2, filters2)

        activity = table1.merge(table2, on=ColName.ID.value, how="inner")
        # We need to do these conversions because a lot of operations work differently if the columns are of type categorical

        """
        activity[ColName.OFFER.value + "_x"] = activity[
            ColName.OFFER.value + "_x"
        ].astype(str)

        activity[ColName.OFFER.value + "_y"] = activity[
            ColName.OFFER.value + "_y"
        ].astype(str)
        """

        # Leave only activity of students that changed offer

        differentActivity = activity.loc[
            activity[ColName.OFFER.value + "_x"] != activity[ColName.OFFER.value + "_y"]
        ]

        # Obtain the ids of students that remained in the same activity
        sameActivity = activity.loc[
            activity[ColName.OFFER.value + "_x"] == activity[ColName.OFFER.value + "_y"]
        ]

        sameActivityIds = columnUniqueValues(sameActivity, ColName.ID.value)

        # Get rid of rows with id of student present in same activity
        # (based on own criteria, these students did not change activity)
        differentActivity = differentActivity.loc[
            ~differentActivity[ColName.ID.value].isin(sameActivityIds)
        ]

        result = None

        # Use observed=True if the columns are categorical in the following groupbys
        if mode == "dest_unit":
            result = dict(
                differentActivity.groupby(ColName.UNIT.value + "_x")[
                    ColName.UNIT.value + "_y"
                ]
                .apply(list)
                .apply(Counter)
                .apply(dict)
            )

        if mode == "dest_offer":
            result = dict(
                differentActivity.groupby(ColName.OFFER.value + "_x")[
                    ColName.OFFER.value + "_y"
                ]
                .apply(list)
                .apply(Counter)
                .apply(dict)
            )

        return result
