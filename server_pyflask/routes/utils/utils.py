import functools
import traceback
from flask import Response


def handle_exception(exception: Exception):
    return str(exception), 500


def exception_wrap(function):
    @functools.wraps(function)
    def wrapper(*args, **kwargs):
        try:
            return function(*args, **kwargs)
        except Exception as e:
            return handle_exception(e)

    return wrapper
