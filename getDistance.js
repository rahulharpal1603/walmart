const axios = require('axios');

async function getCoordinatesFromZipCode(zipCode) {
    const url = `https://nominatim.openstreetmap.org/search`;
    const params = {
        postalcode: zipCode,
        country: 'USA',
        format: 'json'
    };

    try {
        const response = await axios.get(url, { params });
        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return [parseFloat(lon), parseFloat(lat)];
        } else {
            console.error(`No results found for ZIP code ${zipCode}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching coordinates for ZIP code ${zipCode}:`, error.message);
        return null;
    }
}

async function getOsrmRoute(startCoord, endCoord) {
    const baseUrl = "https://router.project-osrm.org/route/v1/driving/";
    const url = `${baseUrl}${startCoord[0]},${startCoord[1]};${endCoord[0]},${endCoord[1]}`;
    
    const params = {
        overview: "false",
        alternatives: "false",
        steps: "false"
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        if (data.code === "Ok") {
            const route = data.routes[0];
            const distance = route.distance / 1000; // Convert meters to kilometers
            const duration = route.duration / 3600; // Convert seconds to hours
            return { distance, duration };
        } else {
            console.error("OSRM response error:", data.code);
            return null;
        }
    } catch (error) {
        console.error("Error fetching route:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
        return null;
    }
}

async function getRouteFromZipCodes(startZip, endZip) {
    const startCoord = await getCoordinatesFromZipCode(startZip);
    const endCoord = await getCoordinatesFromZipCode(endZip);

    if (!startCoord || !endCoord) {
        console.log("Unable to get coordinates for one or both ZIP codes");
        return;
    }

    const result = await getOsrmRoute(startCoord, endCoord);
    if (result) {
        console.log(`Driving distance: ${result.distance.toFixed(2)} km`);
        console.log(`Estimated duration: ${result.duration.toFixed(2)} hours`);
    } else {
        console.log("Unable to calculate route");
    }
}

// Example usage
getRouteFromZipCodes('10001', '90001')  // New York to Los Angeles
    .catch(error => {
        console.error("Error:", error);
    });