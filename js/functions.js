let nearbyStations = {};
let stations = {};

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    switch (xhr.readyState) {
        case 4: {
            if(xhr.status == 200 || xhr.status == 304) {
                stations = JSON.parse(xhr.responseText);
            } else {
                console.log('Failed. HttpStatus: ' + xhr.statusText);
            }
            break;
        }
    }
};
    
let userPosition = {
    latitude: null,
    longitude: null
}
const deriveNearbyStations = () => {
    const stationsArray = Object.values(stations);
    stationsArray.sort((a, b) => {
        const aDiff = Math.abs(userPosition.latitude - a.lat) + Math.abs(userPosition.longitude - a.lon);
        const bDiff = Math.abs(userPosition.latitude - b.lat) + Math.abs(userPosition.longitude - b.lon);
        if (aDiff < bDiff) return -1;
        if (aDiff > bDiff) return 1;
        return 0;
    });

    for (let i = 0; i < 10; i++) {
        nearbyStations[i] = stationsArray[i];
    }
}
const updateUserPosition = () => {
    if (!navigator.geolocation){
        window.alert("Geolocation is not supported.");
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            userPosition.latitude = position.coords.latitude;
            userPosition.longitude = position.coords.longitude;
            deriveNearbyStations();

            console.log(userPosition.latitude, userPosition.longitude);
            console.log(nearbyStations);
            document.getElementById("outtest").value = JSON.stringify(nearbyStations, null, "\t");
        },
        error => {
            window.alert("Unable to retrieve your location.");
        }
    );
}

const doRequest = (method, url) => {
    xhr.open(method, url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.abort();
}
doRequest("GET", "https://dashimaki929.github.io/json/stations.json");