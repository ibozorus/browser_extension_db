import requests
from datetime import datetime
from datetime import timedelta

def get_departures(api_key, start_station, end_station, start_time, end_time):
    url = "https://github.com/JonasNau/Smart-departure-display/tree/master"
    # url = "https://apis.deutschebahn.com/db-api-marketplace/apis/ris-boards-transporteure/v1/public/arrivals"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json"
    }

    params = {
        "station": start_station,
        "dateTime": start_time.strftime("%Y-%m-%dT%H:%M:%S"),
        "direction": end_station,
        "duration": int((end_time - start_time).total_seconds() / 60)  # in minutes
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        departures = response.json()
        return departures
    else:
        print(f"Error: {response.status_code}")
        return None

# Set your API key and other parameters
api_key = "2af844b40b41cd154f776bb1eb1fb6e4"
start_station = "Berlin"
end_station = "Munich"
start_time = datetime.now()  # Replace with your desired start time
end_time = start_time + timedelta(hours=2)  # Replace with your desired end time

# Get departures
departures = get_departures(api_key, start_station, end_station, start_time, end_time)

# Print the departures
if departures:
    for departure in departures:
        print(departure)
