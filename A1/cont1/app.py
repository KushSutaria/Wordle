from flask import Flask, request
import requests
import json

app = Flask(__name__)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    if not read_json_file(data).get('error'):
        response = requests.post('http://container2:9000/calculate', json=data)
        return json.dumps(response.json())
    return json.dumps(read_json_file(data))


def read_json_file(data):
    try:
        if data["file"] == "" or data["file"] is None:
            error = {"file": None, "error": "Invalid JSON input."}
            return error
        if data["product"] == "" or data["product"] is None:
            error = {"file": data, "error": "Invalid JSON input."}
            return error
        return data
    except FileNotFoundError:
        error = {"error": "Invalid JSON input.", "file": None}
        return error
    except json.decoder.JSONDecodeError:
        error = {"file": data, "error": "Invalid JSON input."}
        return error

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)
