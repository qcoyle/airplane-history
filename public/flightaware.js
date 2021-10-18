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