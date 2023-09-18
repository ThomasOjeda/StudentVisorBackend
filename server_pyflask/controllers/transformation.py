from abc import ABC, abstractmethod
import pandas as pd


class Transformation(ABC):
    def __init__(self, requestData):
        self.validate(requestData)
        self.requestData = requestData

    def readfile(self, path):
        return pd.read_pickle(path)

    @abstractmethod
    def validate(self, data: dict):
        pass

    @abstractmethod
    def transform(self) -> dict:
        pass
