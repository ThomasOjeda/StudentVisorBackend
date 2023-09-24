from abc import ABC, abstractmethod
import pandas as pd


class Transformation(ABC):
    def __init__(self, requestData):
        self.requestData = requestData

    def readfile(self, path) -> pd.DataFrame:
        return pd.read_pickle(path)

    @abstractmethod
    def validate(self) -> bool:
        pass

    @abstractmethod
    def transform(self) -> dict:
        pass
