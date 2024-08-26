# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask
import datetime

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)

# Running app
if __name__ == '__main__':
    app.run(debug=True)
