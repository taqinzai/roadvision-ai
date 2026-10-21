import requests
import time
import random

locations = [

    {
        "location": "Shah Alam",
        "latitude": 3.0738,
        "longitude": 101.5183,
    },

    {
        "location": "Cyberjaya",
        "latitude": 2.9213,
        "longitude": 101.6559,
    },

    {
        "location": "Klang",
        "latitude": 3.0333,
        "longitude": 101.45,
    },

]

severities = [
    "Critical",
    "Moderate",
    "Minor",
]

while True:

    random_location = random.choice(locations)

    random_severity = random.choice(severities)

    data = {

        "image_url": "pothole1.png",

        "location_name":
            random_location["location"],

        "latitude":
            random_location["latitude"],

        "longitude":
            random_location["longitude"],

        "severity":
            random_severity,

        "status": "Pending"

    }

    try:

        response = requests.post(
            "http://127.0.0.1:8000/add-pothole",
            json=data
        )

        print(
            "Pothole sent:",
            response.json()
        )

    except Exception as e:

        print("Error:", e)

    time.sleep(10)