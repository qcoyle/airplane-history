export const render = async(url) => {

    // All elements we will update
    const DOMElements = {
        airlineResponse: document.querySelector('#airline'),
        originResponse: document.querySelector('#origin'),
        destinationResponse: document.querySelector('#destination'),
        registrationResponse: document.querySelector('#registrationResponse'),
        imageResponse: document.querySelector('#imageResponse'),
        equipmentResponse: document.querySelector('#equipment'),
        flightTimeResponse: document.querySelector("#flightTime"),
        statusResponse: document.querySelector("#status")
    }

    console.log(url);
    const response = await fetch(url);
    console.log(response);
    if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        if (jsonResponse.errors) {
            renderRequestFailure(DOMElements);
        } else {
            renderSuccess(jsonResponse, DOMElements); // Promise fails
        }
    } else {
        renderRequestFailure(DOMElements); // Bad HTTP response
    }
}

const renderSuccess = (jsonResponse, elements) => {
    // // Uncomment to see raw JSON response
    // let structuredResponse = JSON.stringify(jsonResponse).replace(/,/g, ", \n");
    // structuredResponse = `<pre>${structuredResponse}</pre>`;
    // responseField.innerHTML = `<p>Raw JSON response is </p><p> ${structuredResponse} </p>`;

    let result = jsonResponse.result;
    let response = result.response;

    console.log(response);
    renderFlightData(response, elements)
    renderImageData(response, elements);
}

const renderRequestFailure = elements => {
    clearElements(elements)
    elements.originResponse.innerHTML = `Error: Request failed. Flight information might be invalid.`;
}

const renderInvalidResponse = elements => {
    clearElements(elements)
    elements.originResponse.innerHTML = `Error: The request succeeded but the flight could not be found. Flight information might be invalid.`;
}

const clearElements = elements => {
    let DOMResponsesValues = Object.values(elements);
    DOMResponsesValues.forEach(element => {
        element.innerHTML = ""
    });
}

const renderFlightData = (response, elements) => {
    const parsedData = parseFlightData(response, elements)

    // Update DOM
    elements.registrationResponse.innerHTML = `<p>Registration: ${parsedData.airline} ${parsedData.registration}</p>`;
    elements.airlineResponse.innerHTML = `<p>Airline: ${parsedData.airline}</p>`;
    elements.originResponse.innerHTML = `<p>Origin: ${parsedData.scheduledDepart} (local time) at ${parsedData.origin}</p>`;
    elements.destinationResponse.innerHTML = `<p>Destination: ${parsedData.scheduledArrive} (local time) at ${parsedData.destination}</p>`;
    elements.flightTimeResponse.innerHTML = `<p>Flight duration: ${parsedData.flightTime}</p>`
    elements.statusResponse.innerHTML = `<p>Status: <span style="font-family: monospace">${parsedData.status}</span>`
    elements.equipmentResponse.innerHTML = `<p>Plane type: ${parsedData.equipment}</p>`
}

const renderImageData = (response, elements) => {
    const parsedData = parseImageData(response, elements)

    // Update DOM
    elements.imageResponse.innerHTML = `<p>Your plane:</p><img src=${parsedData.image}>`;
    let para = document.createElement("p");
    let node = document.createTextNode(`Photo copyright: ${parsedData.copyright}`);
    para.appendChild(node);
    elements.imageResponse.appendChild(para);
}

const parseFlightData = (response, elements) => {
    console.log("Parse flight data");
    let flights = response.data;
    let showFlight; // The flight we'll display info about
    let i = 0;

    try {
        // Once we select a flight, stop looping through flights
        while (showFlight === undefined) {
            let flight = flights[i];
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
    } catch (error) {
        renderInvalidResponse(elements);
        console.log(error);
    }

    // If live or next scheduled flight conditions aren't met
    if (showFlight === undefined) {
        renderInvalidResponse(elements);
        console.log("no flight found");
    }

    console.log(showFlight);
    let originAirport = showFlight.airport.origin;
    let destinationAirport = showFlight.airport.destination;
    let originTimezone = originAirport.timezone.name;
    // let destinationTimeOffset = destinationAirport.timezone.offset;
    let departureTimeRaw = showFlight.time.scheduled.departure;
    let arrivalTimeRaw = showFlight.time.scheduled.arrival;
    let scheduledDepartureTime = new Date(departureTimeRaw * 1000).toLocaleString("en-US", { timeZone: originTimezone });
    let destinationTimezone = destinationAirport.timezone.name;
    let scheduledArrivalTime = new Date(arrivalTimeRaw * 1000).toLocaleString("en-US", { timeZone: destinationTimezone });

    let data = {
        airline: showFlight.airline.name,
        origin: originAirport.name,
        destination: destinationAirport.name,
        registration: showFlight.aircraft.registration,
        equipment: showFlight.aircraft.model.text,
        scheduledDepart: scheduledDepartureTime,
        scheduledArrive: scheduledArrivalTime,
        originTimezone: originTimezone,
        flightTime: new Date((arrivalTimeRaw - departureTimeRaw) * 1000).toISOString().substr(11, 8),
        status: showFlight.status.text
    }

    return data;
}

const parseImageData = (response, elements) => {
    // Parse out JSON
    let aircraftImages = response.aircraftImages;
    let images = aircraftImages[0].images;
    let imageObject = images.medium[0];
    let data = {
            image: imageObject.src,
            copyright: imageObject.copyright
        }
        // If errors come up as future bugs, call error functions via elements

    return data;
}