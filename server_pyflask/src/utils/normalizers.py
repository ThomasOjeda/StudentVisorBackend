import pandas as pd
import typing
from ..utils.enums import ColName


def deleteTildesInColumns(df: pd.DataFrame, cols: typing.List[str]) -> pd.DataFrame:
    df[cols] = df[cols].apply(
        lambda x: x.str.normalize("NFKD")
        .str.encode("ascii", errors="ignore")
        .str.decode("utf-8")
    )
    return df


def convertColumnsToCategorical(
    df: pd.DataFrame, cols: typing.List[str]
) -> pd.DataFrame:
    df[cols] = df[cols].apply(lambda x: x.astype("category"))
    return df


def offerNamesNormalization(df: pd.DataFrame) -> pd.DataFrame:
    df[ColName.OFFER.value] = df[ColName.OFFER.value].replace(
        scholarshipOfferReplacements, regex=True
    )
    return df


def inscriptionTypeNormalization(df: pd.DataFrame) -> pd.DataFrame:
    df[ColName.INSC_TYPE.value] = df[ColName.INSC_TYPE.value].replace(
        inscriptionReplacements, regex=True
    )
    return df


def studentInscriptionsOfferNormalization(df: pd.DataFrame) -> pd.DataFrame:
    df.loc[
        df[ColName.OFFER.value] == "Convenio Ingenieria Sistemas", ColName.UNIT.value
    ] = "Facultad de Ciencias Exactas"

    df[ColName.OFFER.value] = df[ColName.OFFER.value].replace(
        studentInscriptionsOfferReplacements, regex=True
    )

    return df


inscriptionReplacements = {
    "Reinscripto": "r",
    "Aspirante a Propuesta": "a",
    "Inscripcion a propuesta aceptada": "i",
}

studentInscriptionsOfferReplacements = {
    "Convenio Ingenieria Sistemas": "Ingenieria de Sistemas"
}


scholarshipOfferReplacements = {
    "Ingeniero": "Ingenieria",
    "Agronomo": "Agronomica",
    "Licenciado": "Licenciatura",
    " - Mencion Produccion de Materia Prima de Origen Vegetal": "",
    " - Mencion Industrializacion de Alimentos de Origen Vegetal": "",
    " - Mencion Tecnologia de los Alimentos de Origen Animal": "",
    "Agrimensor": "en Agrimensura",
    "Electromecanico": "Electromecanica",
    "Quimico": "Quimica",
    "Medico": "Medicina",
    "Veterinario": "Veterinaria",
    "Profesor": "Profesorado",
    "Tecnico/a": "Tecnicatura",
    "Tecnico": "Tecnicatura",
    "Universitario/a": "Universitaria",
    "Universitario": "Universitaria",
}

scholarshipsOffersTranslations = {
    "Ingeniero Agronomo": "Ingenieria Agronomica",
    "Licenciado en Administracion Agraria": "Licenciatura en Administracion Agraria",
    "Licenciado en Tecnologia de los Alimentos - Mencion Produccion de Materia Prima de Origen Vegetal": "Licenciatura en Tecnologia de los Alimentos",
    "Licenciado en Tecnologia de los Alimentos - Mencion Industrializacion de Alimentos de Origen Vegetal": "Licenciatura en Tecnologia de los Alimentos",
    "Licenciado en Tecnologia de los Alimentos - Mencion Tecnologia de los Alimentos de Origen Animal": "Licenciatura en Tecnologia de los Alimentos",
    "Profesor en Ciencias Biologicas": "Profesorado en Ciencias Biologicas",
    "Ingeniero de Sistemas": "Ingenieria de Sistemas",
    "Ingeniero Agrimensor": "Ingenieria en Agrimensura",
    "Ingeniero Civil": "Ingenieria Civil",
    "Ingeniero Electromecanico": "Ingenieria Electromecanica",
    "Ingeniero Industrial": "Ingenieria Industrial",
    "Ingeniero Quimico": "Ingenieria Quimica",
    "Licenciado en Ciencias Fisicas": "Licenciatura en Ciencias Fisicas",
    "Licenciado en Ciencias Matematicas": "Licenciatura en Ciencias Matematicas",
    "Licenciado en Diagnostico y Gestion Ambiental": "Licenciatura en Diagnostico y Gestion Ambiental",
    "Licenciado en Geografia": "Licenciatura en Geografia",
    "Licenciado en Logistica Integral": "Licenciatura en Logistica Integral",
    "Licenciado en Tecnologia Ambiental": "Licenciatura en Tecnologia Ambiental",
    "Medico Veterinario": "Medicina Veterinaria",
    "Profesor de Matematica": "Profesorado de Matematica",
    "Profesor en Ciencias Biologicas": "Profesorado en Ciencias Biologicas",
    "Tecnico Universitario en Desarrollo de Aplicaciones Informaticas": "Tecnicatura Universitaria en Desarrollo de Aplicaciones Informaticas",
    "Tecnico Universitario en Programacion y Administracion de Redes": "Tecnicatura Universitaria en Programacion y Administracion de Redes",
    "Tecnico/a Universitario/a en Administracion de Redes Informaticas": "Tecnicatura Universitaria en Administracion de Redes Informaticas",
}
