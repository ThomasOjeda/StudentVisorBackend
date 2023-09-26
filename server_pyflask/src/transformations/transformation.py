from abc import ABC, abstractmethod
import pandas as pd
import numpy as np


class Transformation(ABC):
    @abstractmethod
    def transform(self) -> pd.DataFrame:
        pass


class TransformationSequence(Transformation):
    def __init__(self, requestData):
        super.__init__(requestData)
        self.transformationSequence = np.array([], dtype=Transformation)

    def transform(self) -> pd.DataFrame:
        for t in self.transformationSequence:
            t.transform(self)
