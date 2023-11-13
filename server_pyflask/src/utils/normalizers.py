import pandas as pd
import typing


def deleteTildesInColumns(df: pd.DataFrame, cols: typing.List[str]) -> pd.DataFrame:
    df[cols] = df[cols].apply(
        lambda x: x.str.normalize("NFKD")
        .str.encode("ascii", errors="ignore")
        .str.decode("utf-8")
    )
    return df


scholarshipsOffersTranslations = {
    "Ingeniero Agrónomo": "Ingeniería Agronómica",
    "Licenciado en Administración Agraria": "Licenciatura en Administración Agraria",
    "Licenciado en Tecnología de los Alimentos - Mención Producción de Materia Prima de Origen Vegetal": "Licenciatura en Tecnología de los Alimentos",
    "Licenciado en Tecnología de los Alimentos - Mención Industrialización de Alimentos de Origen Vegetal": "Licenciatura en Tecnología de los Alimentos",
    "Licenciado en Tecnología de los Alimentos - Mención Tecnología de los Alimentos de Origen Animal": "Licenciatura en Tecnología de los Alimentos",
    "Profesor en Ciencias Biológicas": "Profesorado en Ciencias Biológicas",
    "Ingeniero de Sistemas": "Ingeniería de Sistemas",
    "Ingeniero Agrimensor": "Ingeniería en Agrimensura",
    "Ingeniero Civil": "Ingeniería Civil",
    "Ingeniero Electromecánico": "Ingeniería Electromecánica",
    "Ingeniero Industrial": "Ingeniería Industrial",
    "Ingeniero Químico": "Ingeniería Química",
    "Licenciado en Ciencias Físicas": "Licenciatura en Ciencias Físicas",
    "Licenciado en Ciencias Matemáticas": "Licenciatura en Ciencias Matemáticas",
    "Licenciado en Diagnóstico y Gestión Ambiental": "Licenciatura en Diagnóstico y Gestión Ambiental",
    "Licenciado en Geografía": "Licenciatura en Geografía",
    "Licenciado en Logística Integral": "Licenciatura en Logística Integral",
    "Licenciado en Tecnología Ambiental": "Licenciatura en Tecnología Ambiental",
    "Médico Veterinario": "Medicina Veterinaria",
    "Profesor de Matemática": "Profesorado de Matemática",
    "Profesor en Ciencias Biológicas": "Profesorado en Ciencias Biológicas",
    "Técnico Universitario en Desarrollo de Aplicaciones Informáticas": "Tecnicatura Universitaria en Desarrollo de Aplicaciones Informáticas",
    "Técnico Universitario en Programación y Administración de Redes": "Tecnicatura Universitaria en Programación y Administración de Redes",
    "Técnico/a Universitario/a en Administración de Redes Informáticas": "Tecnicatura Universitaria en Administración de Redes Informáticas",
}
