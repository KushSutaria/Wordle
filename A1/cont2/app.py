import csv
from flask import Flask, request

app = Flask(__name__)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    return read_csv(data)
    
def read_csv(json_file):
    try:
        open('/app/data/' + json_file['file'], "r")
    except FileNotFoundError:
        error = {"file": json_file['file'], "error": "File not found."}
        return error

    with open('/app/data/' + json_file['file'], 'r') as csv_file:
        Sum = 0
        csv_reader = csv.reader(csv_file, delimiter=',')

        header = next(csv_reader)
        try:
            if header[0].casefold() != "product" or header[1].casefold() != "amount":
                error = {"file": json_file['file'], "error": "Input file not in CSV format."}
                return error
            for row in csv_reader:
                if not row[1].isdigit():
                    error = {"file": json_file['file'], "error": "Input file not in CSV format."}
                    return error
                if row[0].casefold() == json_file['product'] and row[1]:
                    Sum += int(row[1])
        except IndexError:
            error = {"file": json_file['file'], "error": "Input file not in CSV format."}
            return error
    answer = {"file": json_file['file'], "sum": Sum}
    return answer

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)
