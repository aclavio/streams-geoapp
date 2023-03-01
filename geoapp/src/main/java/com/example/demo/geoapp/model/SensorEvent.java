package com.example.demo.geoapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SensorEvent {

    private String sensorType;
    private String eventId;
    private Double latitude;
    private Double longitude;
    private String eventType;
    private String severity;
    private String geohash;
    @JsonProperty("eventTime")
    private String eventTimeStrFormatted;

    public String getSensorType() {
        return sensorType;
    }

    public void setSensorType(String sensorType) {
        this.sensorType = sensorType;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getGeohash() {
        return geohash;
    }

    public void setGeohash(String geohash) {
        this.geohash = geohash;
    }

    public String getEventTimeStrFormatted() {
        return eventTimeStrFormatted;
    }

    public void setEventTimeStrFormatted(String eventTimeStrFormatted) {
        this.eventTimeStrFormatted = eventTimeStrFormatted;
    }
}
