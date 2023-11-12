from enum import Enum


class RawFileColName(Enum):
    SEX = "Sexo"
    UNIT = "Responsable Académica"
    INSC_TYPE = "Situación"
    OFFER = "Propuesta"
    ID = "Documento"
    BELGRANO_UNIT = "Unidad Académica"
    PROGRESAR_UNIT = "Facultad"
    BELGRANO_ID = "DNI"
    PROGRESAR_ID = "DNI"
    BELGRANO_OFFER = "Título"
    PROGRESAR_OFFER = "Carrera"


class ColName(Enum):
    SEX = "sex"
    UNIT = "unit"
    INSC_TYPE = "insc"
    OFFER = "offer"
    ID = "id"
