from flask import Flask, jsonify, request
import psycopg2
import os

app = Flask(__name__)

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="archive_ai_db",
        user=os.environ['DB_USERNAME'],
        password=os.environ['DB_PASSWORD']
    )
    return conn

@app.route('/')
def index():
    return "Welcome to the ArchiveAI Backend!"

if __name__ == '__main__':
    app.run(debug=True)


    