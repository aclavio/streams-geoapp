const { EVENT_LIST } = require('/lib/kafka-consumer-service.js')

export default function handler(req, res) {
  const events = [...EVENT_LIST];
  EVENT_LIST.length = 0;
  res.status(200).json(events);
}