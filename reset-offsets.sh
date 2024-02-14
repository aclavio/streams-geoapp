#!/bin/sh

echo "resetting offsets"

kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --group alertEventsGrp \
  --all-topics \
  --reset-offsets \
  --to-earliest \
  --execute
kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --group sensorEventsGrp \
  --all-topics \
  --reset-offsets \
  --to-earliest \
  --execute

echo "done!"