-- Creates a stream of lgds events data
DROP STREAM lgds_events_stream;

CREATE STREAM lgds_events_stream (
  sensorType VARCHAR,
  eventId VARCHAR,
  eventTime VARCHAR,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  eventType VARCHAR,
  severity VARCHAR,
  geohash VARCHAR
) WITH (
  KAFKA_TOPIC = 'lgds_events_raw',
  VALUE_FORMAT = 'JSON'
);


-- Creates a stream of rvvs events data
DROP STREAM rvss_events_stream;

CREATE STREAM rvss_events_stream (
  sensorType VARCHAR,
  eventId VARCHAR,
  eventTime VARCHAR,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  eventType VARCHAR,
  severity VARCHAR,
  geohash VARCHAR
) WITH (
  KAFKA_TOPIC = 'rvss_events_raw',
  VALUE_FORMAT = 'JSON'
);




-- drop stream
DROP STREAM sensor_alerts_stream ;

CREATE STREAM sensor_alerts_stream 
WITH (
  kafka_topic= 'sensor_alerts_stream',
  value_format= 'JSON'
) 
AS SELECT
  rowkey as id,
  lgds_events_stream.eventid as lgdsEventId, 
  lgds_events_stream.latitude as lgdsEventLatitude,
  lgds_events_stream.longitude as lgdsEventLongitude,
  lgds_events_stream.eventtime as lgdsEventTime,
  lgds_events_stream.severity as lgdsEventSeverity,
  lgds_events_stream.eventtype as lgdsEventType,
  lgds_events_stream.geohash as lgdsGeoHash,  
  rvss_events_stream.eventid as rvssEventId, 
  rvss_events_stream.latitude as rvssEventLatitude,
  rvss_events_stream.longitude as rvssEventLongitude,
  rvss_events_stream.eventtime as rvssEventTime,
  rvss_events_stream.severity as rvssEventSeverity,
  rvss_events_stream.eventtype as rvssEventType,
  rvss_events_stream.geohash as rvssGeoHash,  
  GEO_DISTANCE(
          lgds_events_stream.latitude, lgds_events_stream.longitude,
        rvss_events_stream.latitude, rvss_events_stream.longitude, 'MILES') as geoDistance
FROM lgds_events_stream
 INNER JOIN rvss_events_stream 
 WITHIN 2 MINUTES
 ON SUBSTRING(lgds_events_stream.geohash, 1, 6) = 
 			SUBSTRING(rvss_events_stream.geohash, 1, 6)
WHERE GEO_DISTANCE(
        lgds_events_stream.latitude, lgds_events_stream.longitude,
        rvss_events_stream.latitude, rvss_events_stream.longitude, 'MILES') < 10.06
EMIT CHANGES;

-- drop stream
DROP STREAM sensor_alerts_stream2 ;

CREATE STREAM sensor_alerts_stream2
WITH (
  kafka_topic= 'sensor_alerts_stream2',
  value_format= 'JSON'
)
AS SELECT
  rowkey as id,
  GEO_DISTANCE(
          lgds_events_stream.latitude, lgds_events_stream.longitude,
          rvss_events_stream.latitude, rvss_events_stream.longitude, 'MILES') as geoDistance,
  ARRAY[
    MAP(
        'eventSource' := 'lgds',
        'eventId' := lgds_events_stream.eventid,
        'latitude' := lgds_events_stream.latitude,
        'longitude' := lgds_events_stream.longitude,
        'eventtime' := lgds_events_stream.eventtime,
        'severity' := lgds_events_stream.severity,
        'eventtype' := lgds_events_stream.eventtype,
        'geohash' := lgds_events_stream.geohash
    ),
    MAP(
        'eventSource' := 'rvss',
        'eventId' := rvss_events_stream.eventid,
        'latitude' := rvss_events_stream.latitude,
        'longitude' := rvss_events_stream.longitude,
        'eventtime' := rvss_events_stream.eventtime,
        'severity' := rvss_events_stream.severity,
        'eventtype' := rvss_events_stream.eventtype,
        'geohash' := rvss_events_stream.geohash
    ),

  ] as events
FROM lgds_events_stream
 INNER JOIN rvss_events_stream
 WITHIN 2 MINUTES
 ON SUBSTRING(lgds_events_stream.geohash, 1, 6) =
    SUBSTRING(rvss_events_stream.geohash, 1, 6)
WHERE GEO_DISTANCE(
        lgds_events_stream.latitude, lgds_events_stream.longitude,
        rvss_events_stream.latitude, rvss_events_stream.longitude, 'MILES') < 0.06
EMIT CHANGES;
