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
    df = offerNamesPatching(df)

    df = offerNamesReplacing(df)

    return df


scholarshipOfferPatches = {
    "ingeniero": "ingenieria",
    "agronomo": "agronomica",
    "licenciado/a": "licenciatura",
    "licenciado": "licenciatura",
    "agrimensor": "en agrimensura",
    "electromecanico": "electromecanica",
    "quimico": "quimica",
    "medico": "medicina",
    "veterinario": "veterinaria",
    "profesor ": "profesorado ",  # whitespace added because "profesor" is substring of "profesorado"
    "tecnico/a": "tecnicatura",
    "tecnico": "tecnicatura",
    "universitario/a": "universitaria",
    "universitario": "universitaria",
    "realizador": "realizacion",
}


def offerNamesPatching(df: pd.DataFrame) -> pd.DataFrame:
    df[ColName.OFFER.value] = df[ColName.OFFER.value].replace(
        scholarshipOfferPatches, regex=True
    )
    return df


scholarshipOfferReplacements_keys = [
    "enfermero profesional",
    "tecnicatura universitaria en electromedicina",  ###
    "profesorado de geografia",  ###
    "profesorado de comunicacion social",
    "guia universitaria en turismo",  ###
    "licenciatura en teatro",  ###
    "profesorado de teatro",  ###
    "licenciatura en antropologia orientacion arqueologia",  ###
    "analista programador universitaria",
    "abogado",
    "periodista",
    "licenciatura en tecnologia de los alimentos - mencion produccion de materia prima de origen vegetal",
    "licenciatura en tecnologia de los alimentos - mencion industrializacion de alimentos de origen vegetal",
    "licenciatura en tecnologia de los alimentos - mencion tecnologia de los alimentos de origen animal",
]

scholarshipOfferReplacements_values = [
    "licenciatura en enfermeria",
    "tecnico universitario en electromedicina",
    "profesorado en geografia",
    "profesorado en comunicacion social",
    "guia universitario en turismo",
    "licenciado en teatro",
    "profesor de teatro",
    "licenciatura en antropologia",
    "analista programador universitario",
    "abogacia",
    "periodismo",
    "licenciatura en tecnologia de los alimentos",
    "licenciatura en tecnologia de los alimentos",
    "licenciatura en tecnologia de los alimentos",
]

# Elementos de becas que no se encuentran en inscripciones
# {'tecnicatura universitaria en circuitos turisticos', 'realizacion integral de cine, video y television',
#'analista programador universitario', 'tecnicatura en ambiente', 'cbc - ingenieria',
# 'profesorado en juegos dramaticos', 'bachiller universitaria en derecho'}


def offerNamesReplacing(df: pd.DataFrame) -> pd.DataFrame:
    df[ColName.OFFER.value] = df[ColName.OFFER.value].replace(
        scholarshipOfferReplacements_keys,
        scholarshipOfferReplacements_values,
        regex=True,
    )
    return df


inscriptionReplacements = {
    "reinscripto": "r",
    "aspirante a propuesta": "a",
    "inscripcion a propuesta aceptada": "i",
}


def inscriptionTypeNormalization(df: pd.DataFrame) -> pd.DataFrame:
    df[ColName.INSC_TYPE.value] = df[ColName.INSC_TYPE.value].replace(
        inscriptionReplacements, regex=True
    )
    return df


studentInscriptionsOfferPatches = {
    "convenio ingenieria sistemas": "ingenieria de sistemas",
    "licenciatura en antropologia orientacion antropologia social": "licenciatura en antropologia",
    "licenciatura en antropologia orientacion arqueologia": "licenciatura en antropologia",
}


def studentInscriptionsOfferNormalization(df: pd.DataFrame) -> pd.DataFrame:
    df.loc[
        df[ColName.OFFER.value] == "convenio ingenieria sistemas", ColName.UNIT.value
    ] = "facultad de ciencias exactas"

    df[ColName.OFFER.value] = df[ColName.OFFER.value].replace(
        studentInscriptionsOfferPatches
    )

    return df


#########
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
