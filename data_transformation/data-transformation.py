import sys
import json
from transformations.student_movements.student_movements import studentMovements
from transformations.student_enrollments.student_enrollments import studentEnrollments

request = json.loads(sys.argv[1])

if (request['transformationHeader']['type'] == 'STMV'):
    print(studentMovements(request['transformationBody']['yearAPath'],request['transformationBody']['yearBPath']))

if (request['transformationHeader']['type'] == 'INSC'):
    print(studentEnrollments(request['transformationBody']['yearPath']))
