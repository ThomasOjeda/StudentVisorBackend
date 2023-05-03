import pandas as pd
import sys

data = pd.read_excel(sys.argv[1],
                     usecols=["UNIDAD", "CARRERA", "DOCUMENTO", "TIPO.1"],dtype={"UNIDAD":str,"CARRERA":str,"DOCUMENTO":str,"TIPO.1":str})

data.rename(columns={'TIPO.1': 'TIPO_DOC'}, inplace=True)
data.to_pickle(sys.argv[2])
