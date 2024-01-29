#!/bin/sh

echo "starting infrastructure"
docker compose -f geoapp/docker-compose.yml up -d

echo "waiting 2 minutes..."
sleep 120

echo "creating topics"
export CONFLUENT_REST_URL=http://localhost:8082
confluent kafka topic create lgds_events_raw --if-not-exists --partitions 1 --no-authentication --url $CONFLUENT_REST_URL
confluent kafka topic create rvss_events_raw --if-not-exists --partitions 1 --no-authentication --url $CONFLUENT_REST_URL
confluent kafka topic create sensor_alerts_stream --if-not-exists --partitions 1 --no-authentication --url $CONFLUENT_REST_URL

echo "creating ksqldb application"
docker compose -f geoapp/docker-compose.yml cp geoapp/src/main/resources/ksql_scripts/ksql_scripts.sql ksqldb-cli:/tmp/
docker compose -f geoapp/docker-compose.yml exec ksqldb-cli ksql -f /tmp/ksql_scripts.sql -- http://ksqldb-server:8088

echo "done!"