from flask import Flask
from flask_cors import CORS


def init_cors(app: Flask):
    CORS(app,
         resources={r"/*": {
             "origins": [
                 "https://ecampusauppedu.vercel.app",
                 "https://long-benedetta-aupp-f2be75c3.koyeb.app",
                 "http://localhost:3000"
             ]
         }},
         supports_credentials=True
         )
