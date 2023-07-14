import pandas as pd
from pandas import DataFrame

df1 = pd.DataFrame(data=[0, 1, 2, 3])

print(df1)

df1 = pd.concat(df1)


print(df1)
