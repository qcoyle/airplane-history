// NOTE: This module is not used because of CORS errors when calling https://flightaware.com. It appears they don't allow fetch calls to the raw HTML. The solution is signing up for access to their REST API but that requires a credit card

const airlineResponse = document.querySelector('#airline');
const originResponse = document.querySelector('#origin');
const destinationResponse = document.querySelector('#destination');
const registrationResponse = document.querySelector('#registrationResponse');
const imageResponse = document.querySelector('#imageResponse');
const equipmentResponse = document.querySelector('#equipment');

export const render = async(url) => {
    console.log(url);
    const response = await fetch(url);
    console.log(response);
    if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        if (jsonResponse.errors) {
            responseField.innerHTML = `<p>Error: couldn't format response</p>`;
        } else {
            renderSuccess(jsonResponse);
        }
    } else {
        renderRequestFailure();
    }
}

const renderSuccess = jsonResponse => {
    // // Uncomment to see raw JSON response
    // let structuredResponse = JSON.stringify(jsonResponse).replace(/,/g, ", \n");
    // structuredResponse = `<pre>${structuredResponse}</pre>`;
    // responseField.innerHTML = `<p>Raw JSON response is </p><p> ${structuredResponse} </p>`;

    let result = jsonResponse.result;
    let response = result.response;

    console.log(response);
    parseFlightData(response);
    parseImageData(response);
}

const renderRequestFailure = () => {
    registrationResponse.innerHTML = `Error: Request failed. Flight information might be invalid.`;
}

const renderInvalidResponse = () => {
    registrationResponse.innerHTML = `Error: The request succeeded but the flight could not be found. Flight information might be invalid.`;
}

const parseFlightData = response => {
    console.log("Parse flight data");
    let flights = response.data;
    let showFlight; // The flight we'll display info about

    let i = 0;
    // Once we select a flight, stop looping through flights
    while (showFlight === undefined) {
        let flight = flights[i];
        console.log(flight);
        // Find if the flight is live
        let status = flight.status;
        if (status.live === true) {
            showFlight = flight;

            //If flight isn't live, find the next scheduled one
        } else if (status.text.includes("Landed")) {
            showFlight = flights[i - 1];

        }
        i++;
    }

    if (showFlight === undefined) {
        renderInvalidResponse();
        console.log("no flight found");
    }

    console.log(showFlight.time.scheduled);
    let data = {
        airline: showFlight.airline.name,
        origin: showFlight.airport.origin.name,
        destination: showFlight.airport.destination.name,
        registration: showFlight.aircraft.registration,
        equipment: showFlight.aircraft.model.text,
        scheduledDepart: new Date(showFlight.time.scheduled.departure * 1000),
        scheduledArrive: new Date(showFlight.time.scheduled.arrival * 1000),
        status: showFlight.status.text
    }

    renderFlightData(data);
}

const parseImageData = response => {
    // Parse out JSON
    let aircraftImages = response.aircraftImages;
    let registration = aircraftImages[0].registration;
    let images = aircraftImages[0].images;
    let imageObject = images.medium[0];
    let imageData = {
            image: imageObject.src,
            copyright: imageObject.copyright
        }
        // let imageData = [registration, imageObject.src, imageObject.copyright]

    console.log(response.aircraftImages)
    console.log(imageData);
    renderImageData(imageData)
}

// Update DOM
const renderFlightData = flightData => {
    registrationResponse.innerHTML = `<p>Registration: ${flightData.airline} ${flightData.registration}</p>`;
    airlineResponse.innerHTML = `<p>Airline: ${flightData.airline}</p>`;
    originResponse.innerHTML = `<p>Origin: ${flightData.scheduledDepart} at ${flightData.origin}</p>`;
    destinationResponse.innerHTML = `<p>Destination: ${flightData.scheduledArrive} at ${flightData.destination}</p>`;
    equipmentResponse.innerHTML = `<p>Plane type: ${flightData.equipment}</p>`
}

const renderImageData = imageData => {
    imageResponse.innerHTML = `<p>Your plane:</p><img src=${imageData.image}>`;
    const para = document.createElement("p");
    const node = document.createTextNode(`Photo copyright: ${imageData.copyright}`);
    para.appendChild(node);
    imageResponse.appendChild(para);
}