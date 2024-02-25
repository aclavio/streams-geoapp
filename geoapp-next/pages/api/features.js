import { v4 as uuidv4 } from 'uuid';

const sensorTypes = process.env.SENSOR_TYPES.split(',');
const randomSensorType = () => sensorTypes[Math.floor(Math.random() * sensorTypes.length)];

const detectionTypes = process.env.DETECTION_TYPES.split(',');
const randomDetectionType = () => detectionTypes[Math.floor(Math.random() * detectionTypes.length)];

const randomInRange = (min, max) => parseFloat((Math.random() * (max - min) + min).toPrecision(5));
const randomLatitude = (min = -90, max = 90) => randomInRange(min, max);
const randomLongitude = (min = -180, max = 180) => randomInRange(min, max);

const BOUNDS = {
  latMin: parseFloat(process.env.BOUNDS_LAT_MIN),
  latMax: parseFloat(process.env.BOUNDS_LAT_MAX),
  lonMin: parseFloat(process.env.BOUNDS_LON_MIN),
  lonMax: parseFloat(process.env.BOUNDS_LON_MAX)
}

// GeoJSON: https://datatracker.ietf.org/doc/html/rfc7946
const createFeature = () => {
  return {
    type: 'Feature',
    id: uuidv4(),
    title: '',
    geometry: {
      type: 'Point',
      coordinates: [
        randomLongitude(BOUNDS.lonMin, BOUNDS.lonMax),
        randomLatitude(BOUNDS.latMin, BOUNDS.latMax)
      ]
    },
    properties: {
      sensorType: randomSensorType(),
      eventType: randomDetectionType(),
      severity: 'high',
      geohash: '9t9f60gsp9hc',
      eventTime: new Date().getTime(),
      isAlert: Math.random() > 0.8 ? true : false
    }
  };
};

export default function handler(req, res) {
  const events = [createFeature()];
  res.status(200).json(events);
}