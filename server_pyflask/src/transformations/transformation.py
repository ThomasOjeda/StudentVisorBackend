from abc import ABC, abstractmethod
import pandas as pd
import numpy as np


class Transformation(ABC):
    @abstractmethod
    def transform(self) -> pd.DataFrame:
        pass


class TransformationSequence(Transformation):
    def __init__(self, transformations):
        self.transformationSequence = transformations

    def transform(self) -> pd.DataFrame:
        for t in self.transformationSequence:
            t.transform(self)
