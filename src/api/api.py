import time
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# CORS(app, origins=["http://localhost:5174"])  # Allow requests only from this origin

@app.route('/time')
def get_current_time():
    print("Request received for current time.")
    return jsonify({'time': time.time()})

if __name__ == '__main__':
    app.run(debug=True)