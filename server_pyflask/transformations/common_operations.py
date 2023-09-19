import pandas as pd

def filterDataFrame(data:pd.DataFrame,insc_type:str=None,sex:str=None,unit:str=None):
    filteredData = data
    if (insc_type!=None):
        filteredData = filteredData[filteredData['TIPO_DOC']=='I']
    if (sex!=None):
        filteredData = filteredData[filteredData['SEXO']==sex]
    if (unit!=None):
        filteredData = filteredData[filteredData['UNIDAD']==unit]

    return filteredData