/**
 * Demo Configuration
 */
const DEMO_MODE = false;
const ALERTS_URL = 'http://localhost:8080/geoapp/sensor/getAlertEvents';
const EVENTS_URL = 'http://localhost:8080/geoapp/sensor/getSensorEvents';

const startingLat = 31.33412133026897;
const startingLon = -109.9484372078248;
const startingZoom = 15;
const pollIntervalMs = 1000;

const demoDataRect = {
    latMin: 31.23863703909769,
    latMax: 31.414600276313234,
    lonMin: -109.46777343750001,
    lonMax: -110.17776489257814
};

// Anthony's token
const mapboxAccessToken = 'pk.eyJ1IjoiYWNsYXZpbyIsImEiOiJjbGVpc3R0cGUwNG01M3VteGJpdDhzdHc4In0.lzyOXbLNgerig5wE4KIclw';

const startingMarkers = DEMO_MODE ?
    [
        {
            "lgdsEventId": "lgds1",
            "lgdsEventLongitude": -109.560402,
            "lgdsEventLatitude": 31.3342,
            "lgdsEventTime": 1677169875537,
            "lgdsEventSeverity": "high",
            "lgdsEventType": "Fence Cutting",
            "lgdsGeoHash": "wdw4f820h17g",
            "rvssEventId": "rvss1",
            "rvssEventLongitude": -109.560403,
            "rvssEventLatitude": 31.33467,
            "rvssEventTime": 1677169875537,
            "rvssEventSeverity": "Critical",
            "rvssEventType": "Car Driving",
            "rvssGeoHash": "wdw4f820h17g"
        },
        {
            "lgdsEventId": "lgds2",
            "lgdsEventLongitude": -109.560402,
            "lgdsEventLatitude": 31.33467025,
            "lgdsEventTime": 1677169875537,
            "lgdsEventSeverity": "high",
            "lgdsEventType": "Jumping",
            "lgdsGeoHash": "wdw4f820h17g",
            "rvssEventId": "rvss2",
            "rvssEventLongitude": -109.560403,
            "rvssEventLatitude": 31.33467025,
            "rvssEventTime": 1677169875537,
            "rvssEventSeverity": "Critical",
            "rvssEventType": "Car Speeding",
            "rvssGeoHash": "wdw4f820h17g"
        }

    ] : [];

const alertTypes = ['Fence Cutting', 'Fence Climbing', 'Jumping', 'Car Driving', 'Car Speeding'];

/* End Configuration */

var map;
var alertMarkers = L.layerGroup([]);
var eventMarkers = L.layerGroup([]);
const alerts = [];

const alertList = document.querySelector('#alerts-container');
const alertsPane = document.querySelector('#alerts');
const btnAlertsShow = document.querySelector('#btn-alerts-show');
const btnAlertsHide = document.querySelector('#btn-alerts-hide');
var selectedAlert = null;

const eventIconRed = L.icon({
    iconUrl: 'images/map-pin-red.svg',
    iconSize: [20, 35],
    iconAnchor: [10, 34],
    popupAnchor: [0, -27],
});
const eventIconGreen = L.icon({
    iconUrl: 'images/map-pin-green.svg',
    iconSize: [20, 35],
    iconAnchor: [10, 34],
    popupAnchor: [0, 0],
});

let initialize = () => {
    console.log("initializing map...");

    // create base layers
    const baseLayers = {
        'OpenStreetMap': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
        'Mapbox Satellite': L.tileLayer('https://api.mapbox.com/v4/{tileset_id}/{z}/{x}/{y}.{format}?access_token={token}', {
            tileset_id: 'mapbox.satellite',
            format: 'png32',
            maxZoom: 18,
            token: mapboxAccessToken,
            attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
        })
    };

    // create overlay layers
    const overlayLayers = {
        'Alerts': alertMarkers,
        'Events': eventMarkers
    };

    // create the map with one base layer
    map = L.map('map', {
        center: [startingLat, startingLon],
        zoom: startingZoom,
        layers: [baseLayers['OpenStreetMap'], alertMarkers, eventMarkers]
    });

    // add map controls
    L.control.layers(baseLayers, overlayLayers).addTo(map);
    L.control.scale().addTo(map);

    // load initial markers
    startingMarkers.forEach(alert => addAlert(alert));

    // bind events
    map.on('click', onMapClick);
    btnAlertsShow.addEventListener('click', () => toggleAlertsPane(true));
    btnAlertsHide.addEventListener('click', () => toggleAlertsPane(false));

    // start polling for alerts
    setInterval(fetchEvents, pollIntervalMs);
    setInterval(fetchAlerts, pollIntervalMs);
};

const addEvent = (data) => {
    let pos = L.latLng(data.latitude, data.longitude);
    let marker = createSourceEventMarker(data.sensorType, data.eventType, pos);
    marker.bindPopup(createEventPopupHtml(data.eventType, data), {
        maxWidth: 350
    });
    eventMarkers.addLayer(marker);
};

let addAlert = (data) => {
    let name = `${data.lgdsEventType} - ${data.rvssEventType}`;
    let pos1 = L.latLng(data.lgdsEventLatitude, data.lgdsEventLongitude);
    let pos2 = L.latLng(data.rvssEventLatitude, data.rvssEventLongitude);
    let position = midpoint(
        pos1,
        pos2
    );
    // create map marker
    let marker = createAlertMarker(name, position);
    marker.bindPopup(createAlertPopupHtml(name, data), {
        maxWidth: 400
    });
    // create markers for source events
    let events = [
        createSourceEventMarker('LGDS', data.lgdsEventType, pos1, eventIconGreen),
        createSourceEventMarker('RVSS', data.rvssEventType, pos2, eventIconGreen)
    ];
    let features = [
        L.polyline([position, pos1], { color: 'red' }),
        L.polyline([position, pos2], { color: 'red' })
    ];
    // create list item
    let item = createAlertListItem(name, data);

    // add to tracking array
    let alert = {
        name,
        position,
        marker,
        item,
        events,
        features
    };
    alerts.push(alert);

    // add to map layer
    alertMarkers.addLayer(marker);
    // handle list clicks
    item.addEventListener('click', () => {
        console.log('clicked', alert);
        if (selectedAlert) selectedAlert.item.classList.remove('selected');
        selectedAlert = alert;
        item.classList.add('selected');
        item.classList.remove('alert-new');
        //map.flyTo(position, startingZoom);
        map.flyToBounds([
            position,
            pos1,
            pos2
        ]);
        marker.openPopup(position);
    });
    // handle popup events
    marker.on('popupopen', () => {
        console.log('opening popup for', alert);
        alert.features.forEach(feature => alertMarkers.addLayer(feature));
        alert.events.forEach(evt => alertMarkers.addLayer(evt));
        if (selectedAlert) selectedAlert.item.classList.remove('selected');
        selectedAlert = alert;
        item.classList.add('selected');
        item.classList.remove('alert-new');
    });
    marker.on('popupclose', () => {
        console.log('closing popup for', alert);
        alert.features.forEach(feature => alertMarkers.removeLayer(feature));
        alert.events.forEach(evt => alertMarkers.removeLayer(evt));
    });
    // add to nav list
    alertList.prepend(item);
};

let createAlertMarker = (name, position) => {
    return L.marker(
        position,
        {
            title: `Alert: ${name}`
        });
};

let createSourceEventMarker = (source, type, position, icon = eventIconRed) => {
    return L.marker(
        position,
        {
            title: `${source.toUpperCase()} Event: ${type}`,
            icon: icon
        });
};

let createEventPopupHtml = (name, event) => {
    return `
        <div id="popup">
            <h1>Event: ${name}</h1>           
            <article>
                <table>
                    <tr>
                        <th></th>
                        <th>Event Details</th>
                    </tr>
                    <tr>
                        <td>Sensor Type</td>
                        <td>${event.sensorType}</td>
                    </tr>
                    <tr>
                        <td>Id</td>
                        <td>${event.eventId}</td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>${new Date(event.eventTime).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td>Time</td>
                        <td>${new Date(event.eventTime).toLocaleTimeString()}</td>
                    </tr>
                    <tr>
                        <td>Severity</td>
                        <td>${event.severity}</td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>${event.eventType}</td>
                    </tr>
                    <tr>
                        <td>Latitude</td>
                        <td>${event.latitude}</td>
                    </tr>
                    <tr>
                        <td>Longitude</td>
                        <td>${event.longitude}</td>
                    </tr>
                    <tr>
                        <td>Geohash</td>
                        <td>${event.geohash}</td>
                    </tr>
                </table>
            </article>
            <footer>
                <button class="btn-control"><i class="fa-solid fa-trash"></i> Dismiss</button>
                <button class="btn-control"><i class="fa-solid fa-circle-plus"></i> Add to Case</button>
                <button class="btn-control"><i class="fa-solid fa-triangle-exclamation"></i> Dispatch Agents</button>
            </footer>
        </div>
    `;
};

let createAlertPopupHtml = (name, alert) => {
    let table = document.createElement('table');
    Object.keys(alert).forEach(key => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${key}</td><td>${alert[key]}</td>`;
        table.appendChild(tr);
    });

    /*
     <article>
        ${table.outerHTML}
    </article>
    */
    return `
        <div id="popup">
            <h1>Alert: ${name}</h1>           
            <article>
                <table>
                    <tr>
                        <th></th>
                        <th>LGDS Event</th>
                        <th>RVSS Event</th>
                    </tr>
                    <tr>
                        <td>Id</td>
                        <td>${alert.lgdsEventId}</td>
                        <td>${alert.rvssEventId}</td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>${new Date(alert.lgdsEventTime).toLocaleDateString()}</td>
                        <td>${new Date(alert.rvssEventTime).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td>Time</td>
                        <td>${new Date(alert.lgdsEventTime).toLocaleTimeString()}</td>
                        <td>${new Date(alert.rvssEventTime).toLocaleTimeString()}</td>
                    </tr>
                    <tr>
                        <td>Severity</td>
                        <td>${alert.lgdsEventSeverity}</td>
                        <td>${alert.rvssEventSeverity}</td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>${alert.lgdsEventType}</td>
                        <td>${alert.rvssEventType}</td>
                    </tr>
                    <tr>
                        <td>Latitude</td>
                        <td>${alert.lgdsEventLatitude}</td>
                        <td>${alert.rvssEventLatitude}</td>
                    </tr>
                    <tr>
                        <td>Longitude</td>
                        <td>${alert.lgdsEventLongitude}</td>
                        <td>${alert.rvssEventLongitude}</td>
                    </tr>
                    <tr>
                        <td>Geohash</td>
                        <td>${alert.lgdsGeoHash}</td>
                        <td>${alert.rvssGeoHash}</td>
                    </tr>
                </table>
            </article>
            <footer>
                <button class="btn-control"><i class="fa-solid fa-trash"></i> Dismiss</button>
                <button class="btn-control"><i class="fa-solid fa-circle-plus"></i> Add to Case</button>
                <button class="btn-control"><i class="fa-solid fa-triangle-exclamation"></i> Dispatch Agents</button>
            </footer>
        </div>
    `;
};

let createAlertListItem = (name, alert) => {
    let lgdsDate = new Date(alert.lgdsEventTime);
    let rvssDate = new Date(alert.rvssEventTime);
    let when = new Date(Math.min(lgdsDate.getTime(), rvssDate.getTime()));
    let item = document.createElement('div');
    item.setAttribute('class', 'alert alert-new');
    item.innerHTML = `
    <i class="alert-notice fa-solid fa-circle"></i>
    <div class="alert-name">${name}</div>
    <div class="alert-time">${when.toLocaleString()}</div>
    `;
    return item;
};

let onMapClick = (e) => {
    console.log('map click', e);
};

let fetchAlerts = () => {
    console.log('calling alert api...');

    const fetcher = DEMO_MODE ?
        createDemoAlerts() :
        fetch(ALERTS_URL, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => response.json())

    fetcher
        .then(data => {
            data = Array.isArray(data) ? data : [data];
            // load the data on the map
            data.forEach(alert => {
                console.log(`adding marker at [${alert.lgdsEventLatitude}, ${alert.lgdsEventLongitude}]`);
                addAlert(alert);
            });
        })
        .catch(e => {
            console.error(e);
        });
};

let fetchEvents = () => {
    console.log('calling event api...');

    const fetcher = DEMO_MODE ?
        createDemoEvents() :
        fetch(EVENTS_URL, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => response.json())

    fetcher
        .then(data => {
            data = Array.isArray(data) ? data : [data];
            // load the data on the map
            data.forEach(event => {
                console.log(`adding marker at [${event.latitude}, ${event.longitude}]`);
                addEvent(event);
            });
        })
        .catch(e => {
            console.error(e);
        });
};

let toggleAlertsPane = (show) => {
    if (show) {
        alertsPane.classList.remove('alerts-hidden');
        alertsPane.classList.add('alerts-visible');
    } else {
        alertsPane.classList.add('alerts-hidden');
        alertsPane.classList.remove('alerts-visible');
    }

    // invalidate map context
    map.invalidateSize(false);
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const randomInRange = (min, max) => Math.random() * (max - min) + min;
const randomLatitude = (min = -90, max = 90) => randomInRange(min, max);
const randomLongitude = (min = -180, max = 180) => randomInRange(min, max);
const randomAlertType = () => alertTypes[Math.floor(randomInRange(0, alertTypes.length - 1))];
const midpoint = (pos1, pos2) => L.latLng((pos1.lat + pos2.lat) / 2, (pos1.lng + pos2.lng) / 2);

const createDemoAlerts = () => {
    const data = {
        "lgdsEventId": "lgds2",
        "lgdsEventLongitude": randomLongitude(demoDataRect.lonMin, demoDataRect.lonMax),
        "lgdsEventLatitude": randomLatitude(demoDataRect.latMin, demoDataRect.latMax),
        "lgdsEventTime": new Date().getTime(),
        "lgdsEventSeverity": "high",
        "lgdsEventType": randomAlertType(),
        "lgdsGeoHash": "wdw4f820h17g",
        "rvssEventId": "rvss2",
        "rvssEventLongitude": randomLongitude(demoDataRect.lonMin, demoDataRect.lonMax),
        "rvssEventLatitude": randomLatitude(demoDataRect.latMin, demoDataRect.latMax),
        "rvssEventTime": new Date().getTime(),
        "rvssEventSeverity": "Critical",
        "rvssEventType": randomAlertType(),
        "rvssGeoHash": "wdw4f820h17g"
    };
    return new Promise((resolve, reject) => {
        resolve(data);
    });
};

const createDemoEvents = () => {
    const data = {
        "sensorType": "lgds",
        "eventId": "lgds-event-1",
        "latitude": randomLatitude(demoDataRect.latMin, demoDataRect.latMax),
        "longitude": randomLongitude(demoDataRect.lonMin, demoDataRect.lonMax),
        "eventType": randomAlertType(),
        "severity": "high",
        "geohash": "9t9f60gsp9hc",
        "eventTime": new Date().getTime()
    };
    return new Promise((resolve, reject) => {
        resolve(data);
    });
};

initialize();
