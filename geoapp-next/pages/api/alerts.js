const alertTypes = ['Fence Cutting', 'Fence Climbing', 'Jumping', 'Car Driving', 'Car Speeding'];

const randomAlertType = () => alertTypes[Math.floor(Math.random() * alertTypes.length)];

const randomInRange = (min, max) => Math.random() * (max - min) + min;
const randomLatitude = (min = -90, max = 90) => randomInRange(min, max);
const randomLongitude = (min = -180, max = 180) => randomInRange(min, max);

const BOUNDS = {
  latMin: parseFloat(process.env.BOUNDS_LAT_MIN),
  latMax: parseFloat(process.env.BOUNDS_LAT_MAX),
  lonMin: parseFloat(process.env.BOUNDS_LON_MIN),
  lonMax: parseFloat(process.env.BOUNDS_LON_MAX)
}

const createAlert = () => {
  return {
    "lgdsEventId": "lgds2",
    "lgdsEventLongitude": randomLongitude(BOUNDS.lonMin, BOUNDS.lonMax),
    "lgdsEventLatitude": randomLatitude(BOUNDS.latMin, BOUNDS.latMax),
    "lgdsEventTime": new Date().getTime(),
    "lgdsEventSeverity": "high",
    "lgdsEventType": randomAlertType(),
    "lgdsGeoHash": "wdw4f820h17g",
    "rvssEventId": "rvss2",
    "rvssEventLongitude": randomLongitude(BOUNDS.lonMin, BOUNDS.lonMax),
    "rvssEventLatitude": randomLatitude(BOUNDS.latMin, BOUNDS.latMax),
    "rvssEventTime": new Date().getTime(),
    "rvssEventSeverity": "Critical",
    "rvssEventType": randomAlertType(),
    "rvssGeoHash": "wdw4f820h17g"
  };
};

export default function handler(req, res) {
  res.status(200).json(createAlert());
}