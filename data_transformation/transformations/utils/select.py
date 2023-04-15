
import pandas as pd

def selectColumns(columns):
    table = pd.read_excel('./2015_students.xlsx')

    table = table[columns]

    return table

print(selectColumns(['UNIDAD','DOCUMENTO','CARRERA']))

