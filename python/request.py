import requests

def flightradar(endpoint):
    request_base_headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
        "accept": "application/jsoN",
        "accept-language": "en-EN",
        "cache-control": "max-age=0",
        "origin": "https://www.flightradar24.com",
        "referer": "https://www.flightradar24.com/"

    }
    r = requests.get(endpoint, headers=request_base_headers)
    if r.status_code == 402:
        raise RuntimeError("Request to " + endpoint + " requires payment")
    if r.status_code == 403:
        raise RuntimeError("Request to " + endpoint + " is Forbidden")
    if r.status_code == 404:
        raise RuntimeError("Request to " + endpoint + " is NotFound")
    if r.status_code == 500:
        raise RuntimeError("Request to " + endpoint + " returns InternalServerError")
    return r

def flightaware(endpoint):
    r = requests.get(endpoint)
    return(r)