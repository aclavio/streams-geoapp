#!/bin/sh

export CONFLUENT_REST_URL=http://localhost:8082

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

echo "deleting topics"
confluent kafka topic delete lgds_events_raw rvss_events_raw sensor_alerts_stream bad_geo_data_dlq --force --no-authentication --url $CONFLUENT_REST_URL

echo "creating topics"
confluent kafka topic create lgds_events_raw --if-not-exists --partitions 1 --config confluent.value.schema.validation=true --no-authentication --url $CONFLUENT_REST_URL
confluent kafka topic create rvss_events_raw --if-not-exists --partitions 1 --config confluent.value.schema.validation=true --no-authentication --url $CONFLUENT_REST_URL
confluent kafka topic create sensor_alerts_stream --if-not-exists --partitions 1 --no-authentication --url $CONFLUENT_REST_URL
confluent kafka topic create bad_geo_data_dlq --if-not-exists --partitions 1 --no-authentication --url $CONFLUENT_REST_URL

echo "registering schemas"
curl -s -X POST -d @geoappdatagen/src/main/resources/schemas/base_event.sr.json \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  http://localhost:8081/subjects/lgds_events_raw-value/versions | jq '.'
curl -s -X POST -d @geoappdatagen/src/main/resources/schemas/base_event.sr.json \
  -H "Content-Type: application/vnd.schemaregistry.v1+json" \
  http://localhost:8081/subjects/rvss_events_raw-value/versions | jq '.'


echo "done!"