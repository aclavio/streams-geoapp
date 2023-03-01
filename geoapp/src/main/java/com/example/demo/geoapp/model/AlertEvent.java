package com.example.demo.geoapp.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AlertEvent {

    //@JsonProperty("LGDSEVENTID")
    @JsonAlias("LGDSEVENTID")
    private String lgdsEventId;
    @JsonAlias("LGDSEVENTLATITUDE")
    private Double lgdsEventLatitude;
    @JsonAlias("LGDSEVENTLONGITUDE")
    private Double lgdsEventLongitude;
    @JsonAlias("LGDSEVENTTIME")
    private String lgdsEventTime;
    @JsonAlias("LGDSEVENTSEVERITY")
    private String lgdsEventSeverity;
    @JsonAlias("LGDSEVENTTYPE")
    private String lgdsEventType;
    @JsonAlias("LGDSGEOHASH")
    private String lgdsGeoHash;

    @JsonAlias("RVSSEVENTID")
    private String rvssEventId;
    @JsonAlias("RVSSEVENTLATITUDE")
    private Double rvssEventLatitude;
    @JsonAlias("RVSSEVENTLONGITUDE")
    private Double rvssEventLongitude;
    @JsonAlias("RVSSEVENTTIME")
    private String rvssEventTime;
    @JsonAlias("RVSSEVENTSEVERITY")
    private String rvssEventSeverity;
    @JsonAlias("RVSSEVENTTYPE")
    private String rvssEventType;
    @JsonAlias("RVSSGEOHASH")
    private String rvssGeoHash;

    public String getLgdsEventSeverity() {
        return lgdsEventSeverity;
    }

    public void setLgdsEventSeverity(String lgdsEventSeverity) {
        this.lgdsEventSeverity = lgdsEventSeverity;
    }

    public String getRvssEventSeverity() {
        return rvssEventSeverity;
    }

    public void setRvssEventSeverity(String rvssEventSeverity) {
        this.rvssEventSeverity = rvssEventSeverity;
    }

    public String getLgdsEventId() {
        return lgdsEventId;
    }

    public void setLgdsEventId(String lgdsEventId) {
        this.lgdsEventId = lgdsEventId;
    }

    public Double getLgdsEventLongitude() {
        return lgdsEventLongitude;
    }

    public void setLgdsEventLongitude(Double lgdsEventLongitude) {
        this.lgdsEventLongitude = lgdsEventLongitude;
    }

    public Double getLgdsEventLatitude() {
        return lgdsEventLatitude;
    }

    public void setLgdsEventLatitude(Double lgdsEventLatitude) {
        this.lgdsEventLatitude = lgdsEventLatitude;
    }

    public String getLgdsEventTime() {
        return lgdsEventTime;
    }

    public void setLgdsEventTime(String lgdsEventTime) {
        this.lgdsEventTime = lgdsEventTime;
    }

    public String getLgdsEventType() {
        return lgdsEventType;
    }

    public void setLgdsEventType(String lgdsEventType) {
        this.lgdsEventType = lgdsEventType;
    }

    public String getRvssEventId() {
        return rvssEventId;
    }

    public void setRvssEventId(String rvssEventId) {
        this.rvssEventId = rvssEventId;
    }

    public Double getRvssEventLongitude() {
        return rvssEventLongitude;
    }

    public void setRvssEventLongitude(Double rvssEventLongitude) {
        this.rvssEventLongitude = rvssEventLongitude;
    }

    public Double getRvssEventLatitude() {
        return rvssEventLatitude;
    }

    public void setRvssEventLatitude(Double rvssEventLatitude) {
        this.rvssEventLatitude = rvssEventLatitude;
    }

    public String getRvssEventTime() {
        return rvssEventTime;
    }

    public void setRvssEventTime(String rvssEventTime) {
        this.rvssEventTime = rvssEventTime;
    }

    public String getRvssEventType() {
        return rvssEventType;
    }

    public void setRvssEventType(String rvssEventType) {
        this.rvssEventType = rvssEventType;
    }

    public String getLgdsGeoHash() {
        return lgdsGeoHash;
    }

    public void setLgdsGeoHash(String lgdsGeoHash) {
        this.lgdsGeoHash = lgdsGeoHash;
    }

    public String getRvssGeoHash() {
        return rvssGeoHash;
    }

    public void setRvssGeoHash(String rvssGeoHash) {
        this.rvssGeoHash = rvssGeoHash;
    }
}
