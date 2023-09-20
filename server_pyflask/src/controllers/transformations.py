from flask import jsonify, request
import pandas as pd
import numpy as np

from ..transformations.inscriptions import StudentInscriptions
from ..transformations.student_movements import StudentMovements

def student_inscriptions(request):
    transformer = StudentInscriptions(request.get_json())
    result = transformer.transform()
    return jsonify(result), 200

def student_movements(request):
    transformer = StudentMovements(request.get_json())
    result = transformer.transform()
    return jsonify(result), 200
