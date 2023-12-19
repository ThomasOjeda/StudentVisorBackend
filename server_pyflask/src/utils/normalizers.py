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
    "Ingeniero": "Ingenieria",
    "Agronomo": "Agronomica",
    "Licenciado/a": "Licenciatura",
    "Licenciado": "Licenciatura",
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
    "Realizador": "Realizacion",
}


def offerNamesPatching(df: pd.DataFrame) -> pd.DataFrame:
    df[ColName.OFFER.value] = df[ColName.OFFER.value].replace(
        scholarshipOfferPatches, regex=True
    )
    return df


scholarshipOfferReplacements_keys = [
    "Enfermero Profesional",
    "Tecnicatura Universitaria en Electromedicina",  ###
    "Profesorado de Geografia",  ###
    "Guia Universitaria en Turismo",  ###
    "Licenciatura en Teatro",  ###
    "Profesorado de Teatro",  ###
    "Licenciatura en Antropologia orientacion Arqueologia",  ###
    "Analista Programador Universitaria",
    "Abogado",
    "Periodista",
    "Licenciatura en Tecnologia de los Alimentos - Mencion Produccion de Materia Prima de Origen Vegetal",
    "Licenciatura en Tecnologia de los Alimentos - Mencion Industrializacion de Alimentos de Origen Vegetal",
    "Licenciatura en Tecnologia de los Alimentos - Mencion Tecnologia de los Alimentos de Origen Animal",
]

scholarshipOfferReplacements_values = [
    "Licenciatura en Enfermeria",
    "Tecnico Universitario en Electromedicina",
    "Profesorado en Geografia",
    "Guia Universitario en Turismo",
    "Licenciado en Teatro",
    "Profesor de Teatro",
    "Licenciatura en Antropologia",
    "Analista Programador Universitario",
    "Abogacia",
    "Periodismo",
    "Licenciatura en Tecnologia de los Alimentos",
    "Licenciatura en Tecnologia de los Alimentos",
    "Licenciatura en Tecnologia de los Alimentos",
]

# Elementos de becas que no se encuentran en inscripciones
# {'Analista Programador Universitario', 'CBC - Ingenieria',
#'Bachiller Universitaria en Derecho', 'Realizacion Integral de Cine, Video y Television'
# , 'Profesorado en Juegos Dramaticos', 'Tecnicatura en Ambiente',
#'Profesorado de Comunicacion Social', 'Licenciatura en Gestion Tecnologica ',
#'Tecnicatura Universitaria en Circuitos Turisticos'}


def offerNamesReplacing(df: pd.DataFrame) -> pd.DataFrame:
    df[ColName.OFFER.value] = df[ColName.OFFER.value].replace(
        scholarshipOfferReplacements_keys,
        scholarshipOfferReplacements_values,
        regex=True,
    )
    return df


inscriptionReplacements = {
    "Reinscripto": "r",
    "Aspirante a Propuesta": "a",
    "Inscripcion a propuesta aceptada": "i",
}


def inscriptionTypeNormalization(df: pd.DataFrame) -> pd.DataFrame:
    df[ColName.INSC_TYPE.value] = df[ColName.INSC_TYPE.value].replace(
        inscriptionReplacements, regex=True
    )
    return df


studentInscriptionsOfferPatches = {
    "Convenio Ingenieria Sistemas": "Ingenieria de Sistemas",
    "Licenciatura en Antropologia Orientacion Antropologia Social": "Licenciatura en Antropologia",
    "Licenciatura en Antropologia Orientacion Arqueologia": "Licenciatura en Antropologia",
}


def studentInscriptionsOfferNormalization(df: pd.DataFrame) -> pd.DataFrame:
    df.loc[
        df[ColName.OFFER.value] == "Convenio Ingenieria Sistemas", ColName.UNIT.value
    ] = "Facultad de Ciencias Exactas"

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
