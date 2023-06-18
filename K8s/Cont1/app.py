from flask import Flask, request
import requests
import json

app = Flask(__name__)

@app.route('/store-file',methods=['POST'])
def store_file():
    data = request.get_json()
    if not read_json_file(data).get('error'):
        return create_json_file(data)  
    return json.dumps(read_json_file(data))

@app.route('/calculate',methods=['POST'])
def calculate():
    data = request.get_json()
    response = requests.post('http://container2-service:9000/summation', json=data)
    return json.dumps(response.json())


def create_json_file(data):
    try:
        file_name = data["file"]
        input_data = data["data"]
        f=open('/kush_PV_dir/'+file_name,"w")
        f.write(input_data)
        f.close()
        output = {
                "file": file_name,
                "message": "Success."
            }
        return json.dumps(output)

    except Exception as e:
        output = {
            "file": file_name,
            "message":e
        }

        return json.dumps(output)

def read_json_file(data):
    try:
        if data["file"] == "" or data["file"] is None:
            error = {"file": None, "error": "Invalid JSON input."}
            return error
        if data["data"] == "" or data["data"] is None:
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