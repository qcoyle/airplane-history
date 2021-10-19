import * as render from "./render-flightradar.js"

export const flightData = response => {
    console.log("Parse flight data");
    let flights = response.data;
    let showFlight; // The flight we'll display info about
    let i = 0;

    return function parseAndRenderErrors(elements) {
        try {
            // Once we select the necessary flight, stop looping through flights
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
            render.renderInvalidResponse(elements);
            console.log(error);
        }

        console.log(showFlight);
        // If live or next scheduled flight conditions aren't met
        if (showFlight === undefined) {
            render.renderInvalidResponse(elements); // Call back to clear DOM
            console.log("no flight found");
        }

        // Pull out what we need
        let originAirport = showFlight.airport.origin;
        let destinationAirport = showFlight.airport.destination;
        let originTimezone = originAirport.timezone.name;
        let departureTimeRaw = showFlight.time.scheduled.departure;
        let arrivalTimeRaw = showFlight.time.scheduled.arrival;
        let scheduledDepartureTime = new Date(departureTimeRaw * 1000).toLocaleString("en-US", { timeZone: originTimezone });
        let destinationTimezone = destinationAirport.timezone.name;
        let scheduledArrivalTime = new Date(arrivalTimeRaw * 1000).toLocaleString("en-US", { timeZone: destinationTimezone });

        // Data object for export
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
}


export const imageData = response => {
    // Parse out JSON
    let aircraftImages = response.aircraftImages;
    let data;
    try {
        let images = aircraftImages[0].images;
        let imageObject = images.medium[0];
        data = {
            image: imageObject.src,
            copyright: imageObject.copyright
        }
    } catch (error) {
        console.log(error);
    }

    return data;
}