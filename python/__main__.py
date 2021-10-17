import request
import json
import xml.dom.minidom

fr24_url = "https://api.flightradar24.com/common/v1"
fr24_flight = "/flight/list.json?&fetchBy=flight&page=1&limit=10&query="
flightaware_url = "https://flightaware.com/live/flight/"
flightware_params = "/history/320"

def getFlight(id):
    endpoint = fr24_url + fr24_flight + id
    r = request.flightradar(endpoint).json()
    result = r["result"]
    response = result["response"]
    return(response)

def getRegistration(response):
    aircraftImages=response["aircraftImages"]
    registration = aircraftImages[0]["registration"]
    return registration

def getPhoto(response):
    aircraftImages=response["aircraftImages"]
    images = aircraftImages[0]["images"]
    obj = images["medium"][0]
    link = obj["src"]
    copyright = obj["copyright"]
    return [link, copyright]

def getAircraft(id):
    endpoint = flightaware_url+id+flightware_params
    r = request.flightaware(endpoint)
    return(r.text) # As HTML

# Example
flight = getFlight("DL328")
registration = getRegistration(flight) # Tail number
photo = getPhoto(flight) # Photo and copyright