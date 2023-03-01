package com.example.demo.geoappdatagen.model;

public class LgdsEvent extends BaseEvent{
}



/*
CREATE STREAM lgds_events_stream (
  sensorType VARCHAR,
  eventId VARCHAR,
  eventTime BIGINT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  eventType VARCHAR,
  severity VARCHAR,
  geohash VARCHAR
)
 */