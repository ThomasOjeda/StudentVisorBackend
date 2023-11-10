import pandas as pd


def filterDataFrame(data: pd.DataFrame, filters: dict = {}) -> pd.DataFrame:
    filteredData = data

    for key in filters.keys():
        if filters[key] != None:
            filteredData = filteredData[filteredData[key] == filters[key]]

    return filteredData


def columnUniqueValues(data: pd.DataFrame, column: str, filters: dict = {}):
    return filterDataFrame(data, filters)[column].unique()


def readFile(path: str) -> pd.DataFrame:
    return pd.read_pickle(path)
