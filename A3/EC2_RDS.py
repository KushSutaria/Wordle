
import json
from flask import Flask, request
import mysql.connector

connection = mysql.connector.connect(
    host="a4-assignment-instance-1.cdvlglw37rob.us-east-1.rds.amazonaws.com",
    user="admin",
    passwd="admin123",
    port="3306"
)
app = Flask(__name__)

@app.route('/store-products', methods=['POST'])
def store_products():
    products = request.json['products']
    cursor = connection.cursor()
    cursor.execute("USE product")
    for i in products:
        name = i.get('name')
        price = i.get('price')
        availability = i.get('availability')
        cursor.execute("INSERT INTO products (name, price, availability) VALUES (%s, %s, %s)", (name, price, availability))
    connection.commit()
    print("Data inserted successfully")
    return {"message": "Success."}
    

@app.route('/list-products', methods=['GET'])
def list_products():
    cursor = connection.cursor()
    cursor.execute("USE product")
    cursor.execute("SELECT * FROM products")
    result = cursor.fetchall()
    
    print(json.dumps(result))
    ans=[]
    for i in result:
        items_list = {
            "name": i[0],
            "price": i[1],
            "availability": bool(i[2])
        }
        ans.append(items_list)

    
    return {
        "products":
            ans
    }

@app.route('/create-database', methods=['POST'])
def create_database():
    name=request.json['name']
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE {}".format(name))    
    print("Database created successfully")
    return {"message": "Success."}

@app.route('/create-table', methods=['POST'])
def create_table():
    name=request.json['name']
    cursor = connection.cursor()
    cursor.execute("USE product")
    cursor.execute("CREATE TABLE {}".format(name))
    print("Table created successfully")
    return {"message": "Success."}

@app.route('/truncate-table', methods=['POST'])
def truncate_table():
    name=request.json['name']
    cursor = connection.cursor()
    cursor.execute("USE product")
    cursor.execute("TRUNCATE TABLE {}".format(name))
    print("Table truncated successfully")
    return {"message": "Success."}

@app.route('/delete-database', methods=['POST'])
def delete_database():
    name=request.json['name']
    cursor = connection.cursor()
    cursor.execute("DROP DATABASE {}".format(name))
    print("Database deleted successfully")
    return {"message": "Success."}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='80')
