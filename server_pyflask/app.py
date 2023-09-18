import os
from flask import Flask, jsonify
from waitress import serve

import logging


logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s")

app = Flask(__name__)

from .routes.routes import routesBP

app.register_blueprint(routesBP, url_prefix="/")
