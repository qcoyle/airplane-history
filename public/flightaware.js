// NOTE: This module is not used because of CORS errors when calling https://flightaware.com. It appears they don't allow fetch calls to the raw HTML. The solution is signing up for access to their REST API but that requires a credit card


const pastFlights = document.querySelector('#pastFlights');

export const render = async(url) => {
    console.log(url);
    const response = await fetch("https://flightaware.com/live/flight/N513DZ/history/80", { mode: "cors" }); // Browser throws CORS error without mode: "no-cors" header
    console.log(response);
    const textResponse = await response.text();
    console.log(textResponse);
    var parser = new DOMParser();
    var doc = parser.parseFromString(textResponse, 'text/html');
    console.log(doc);
    // pastFlights.innerHTML = `<p>Error: couldn't format response</p>`;
    // console.log(textResponse);
}