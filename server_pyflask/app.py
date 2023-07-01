import os
from flask import Flask, jsonify
from waitress import serve
import logging


logging.basicConfig(level=logging.DEBUG, format="%(asctime)s %(message)s")

app = Flask(__name__)

from routes.routes import routesBP

app.register_blueprint(routesBP, url_prefix="/")


""" if __name__ == "__main__":
    if os.environ["PYFLASK_ENV"] == "development":
        # Run with default flask server (correct server for development)
        app.run(host="0.0.0.0", port=5100, debug=True)
    if os.environ["PYFLASK_ENV"] == "production":
        # Run with waitress (correct server for production)
        serve(app, host="0.0.0.0", port=5100, threads=2) """
