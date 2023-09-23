import pandas as pd

def filterDataFrame(data:pd.DataFrame,filters:dict):
    filteredData = data

    for key in filters.keys():
        if (filters[key]!=None):
            filteredData = filteredData[filteredData[key]==filters[key]]

    return filteredData

def columnUniqueValues(data:pd.DataFrame,column:str):

    return data[column].unique()