import pandas as pd
import typing
from ..utils.enums import ColName
from . import mappings


def cleanColumns(df: pd.DataFrame, cols: typing.List[str]) -> pd.DataFrame:
    df.loc[:, cols] = df.loc[:, cols].apply(
        lambda x: x.str.normalize("NFKD")
        .str.encode("ascii", errors="ignore")
        .str.decode("utf-8")
        .str.strip()
        .str.lower()
    )
    return df


def convertColumnsToCategorical(
    df: pd.DataFrame, cols: typing.List[str]
) -> pd.DataFrame:
    df.loc[:, cols] = df[cols].apply(lambda x: x.astype("category"))
    return df


def scholarshipOfferNamesNormalization(df: pd.DataFrame) -> pd.DataFrame:
    df.loc[:, ColName.OFFER.value] = df.loc[:, ColName.OFFER.value].replace(
        mappings.replace_schoalships_offers_resumed
    )
    return df


def inscriptionTypeNormalization(df: pd.DataFrame) -> pd.DataFrame:
    df.loc[:, ColName.INSC_TYPE.value] = df[ColName.INSC_TYPE.value].replace(
        ["reinscripto", "aspirante a propuesta", "inscripcion a propuesta aceptada"],
        ["r", "a", "i"],
    )
    return df


def studentInscriptionsOfferNamesNormalization(df: pd.DataFrame) -> pd.DataFrame:

    df.loc[:, ColName.OFFER.value] = df[ColName.OFFER.value].replace(
        mappings.replace_inscriptions_offers
    )

    return df


def unitsNormalization(df: pd.DataFrame) -> pd.DataFrame:

    df.loc[:, ColName.UNIT.value] = df[ColName.UNIT.value].replace(
        mappings.replace_inscriptions_and_scholarships_units
    )

    return df
