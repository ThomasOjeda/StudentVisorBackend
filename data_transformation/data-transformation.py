import sys
import json
from transformations.student_movements.studentMovements import studentMovements

request = json.loads(sys.argv[1])

if (request['type'] == 'st-mv'):
    print(studentMovements("data_transformation/data/2015_students.pickle", "data_transformation/data/2016_students.pickle"))

if (request['type'] == 'insc'):
    print(request['type'])
