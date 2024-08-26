const { ALERT_LIST } = require('/lib/kafka-consumer-service.js')

function translateAlertFormat(raw) {
  return {
    "lgdsEventId": raw.LGDSEVENTID,
    "lgdsEventLongitude": raw.LGDSEVENTLONGITUDE,
    "lgdsEventLatitude": raw.LGDSEVENTLATITUDE,
    "lgdsEventTime": raw.LGDSEVENTTIME,
    "lgdsEventSeverity": raw.LGDSEVENTSEVERITY,
    "lgdsEventType": raw.LGDSEVENTTYPE,
    "lgdsGeoHash": raw.LGDSGEOHASH,
    "rvssEventId": raw.RVSSEVENTID,
    "rvssEventLongitude": raw.RVSSEVENTLONGITUDE,
    "rvssEventLatitude": raw.RVSSEVENTLATITUDE,
    "rvssEventTime": raw.RVSSEVENTTIME,
    "rvssEventSeverity": raw.RVSSEVENTSEVERITY,
    "rvssEventType": raw.RVSSEVENTTYPE,
    "rvssGeoHash": raw.RVSSGEOHASH,
    "geodistance": raw.GEODISTANCE
  };
}

export default function handler(req, res) {
  //const alerts = [...ALERT_LIST];
  const alerts = ALERT_LIST.map(alert => translateAlertFormat(alert));
  ALERT_LIST.length = 0;
  res.status(200).json(alerts);
}