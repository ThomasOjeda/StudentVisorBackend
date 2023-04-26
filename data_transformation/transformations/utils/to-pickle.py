import pandas as pd

def toPickle(original,destination):
    data = pd.read_excel(original,
                        usecols=["UNIDAD","CARRERA","DOCUMENTO","TIPO.1"])
    
    data.rename(columns={'TIPO.1':'TIPO_DOC'},inplace=True)
    data.to_pickle(destination)


toPickle('./data_transformation/data/2016_students.xlsx','./data_transformation/data/2016_students.pickle')