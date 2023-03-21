const sensorTypes = ['lgds', 'rvss'];

const randomSensorType = () => sensorTypes[Math.floor(Math.random() * sensorTypes.length)];

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

const createEvent = () => {
  return {
    "sensorType": randomSensorType(),
    "eventId": "lgds-event-1",
    "latitude": randomLatitude(BOUNDS.latMin, BOUNDS.latMax),
    "longitude": randomLongitude(BOUNDS.lonMin, BOUNDS.lonMax),
    "eventType": randomAlertType(),
    "severity": "high",
    "geohash": "9t9f60gsp9hc",
    "eventTime": new Date().getTime()
  };
};

export default function handler(req, res) {
  res.status(200).json(createEvent());
}