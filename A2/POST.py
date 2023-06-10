import requests

url = 'http://54.173.209.76:9000/start'
#url='http://localhost:8000/start'
data = {
    "banner": "B00928066",
    "ip": "54.204.247.81:50051"
}

response = requests.post(url, json=data)

if response.status_code == 200:
    try:
        response_data = response.json()
        print(f"Server response: {response_data}")
    except ValueError:
        print("Response is not valid JSON.")
else:
    print(f"Request failed with status code: {response.status_code}")

print(f"Response content: {response.text}")
