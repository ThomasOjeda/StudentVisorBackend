from flask import Flask
import logging


logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s")

app = Flask(__name__)

from src.routes.routes import routesBP

app.register_blueprint(routesBP, url_prefix="/")
