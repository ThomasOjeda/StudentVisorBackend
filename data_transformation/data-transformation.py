import sys
import json
from transformations.student_movements.student_movements import studentMovements
from transformations.student_enrollments.student_enrollments import studentEnrollments

request = json.loads(sys.argv[1])

if (request['type'] == 'st-mv'):
    print(studentMovements(request['yearAPath'],request['yearBPath']))

if (request['type'] == 'insc'):
    print(studentEnrollments(request['yearPath']))
