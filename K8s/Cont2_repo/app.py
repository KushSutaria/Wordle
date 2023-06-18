import csv
from flask import Flask, request

app = Flask(__name__)

@app.route('/summation', methods=['POST'])
def calculate():
    data = request.get_json()
    return read_csv(data)

def clean_csv(csv_file):
    with open(csv_file, 'r') as input_file:
    # Open a new output file to write the cleaned data
        with open('/kush_PV_dir/output.csv', 'w', newline='') as output_file:
            reader = csv.reader(input_file)
            writer = csv.writer(output_file)
            
            # Iterate through each row in the input file
            for row in reader:
                # Remove whitespaces from each cell in the row
                cleaned_row = [cell.strip() for cell in row]
                
                # Write the cleaned row to the output file
                writer.writerow(cleaned_row)

def read_csv(json_file):
    if json_file["file"] == "" or json_file["file"] is None:
            error = {"file": None, "error": "Invalid JSON input."}
            return error
    if json_file['product'] == "" or json_file['product'] is None:
        error= {"file": None, error: "Invalid JSON input."}
        return error
    try:
        open('/kush_PV_dir/' + json_file['file'], "r")
    except FileNotFoundError:
        error = {"file": json_file['file'], "error": "File not found."}
        return error
    clean_csv('/kush_PV_dir/'+json_file['file'])
    output = 'output.csv'
    with open('/kush_PV_dir/' + output, 'r') as csv_file:
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
                    if row[1].isdigit():
                        Sum += int(row[1])
        except IndexError:
            error = {"file": json_file['file'], "error": "Input file not in CSV format."}
            return error
    answer = {"file": json_file['file'], "sum": str(Sum)}
    return answer

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)
