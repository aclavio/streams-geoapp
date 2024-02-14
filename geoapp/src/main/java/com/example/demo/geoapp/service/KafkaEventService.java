package com.example.demo.geoapp.service;

import com.example.demo.geoapp.model.AlertEvent;
import com.example.demo.geoapp.model.BaseEvent;
import com.example.demo.geoapp.model.SensorEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KafkaEventService {

    Logger logger = LoggerFactory.getLogger(KafkaEventService.class);

    @Autowired
    @Qualifier("alertEventsList")
    private List<AlertEvent> alertEventsList;

    @Autowired
    @Qualifier("sensorEventsList")
    private List<BaseEvent> sensorEventsList;

    private int alertsCurrentOffset;
    private int alertsLastOffset;

    private int sensorEventsCurrentOffset;
    private int sensorEventsLastOffset;


    /*
    Return a List of Alert Events
     */
    public List<AlertEvent> getAlertEvents() {
        alertsLastOffset = alertEventsList.size();
        logger.info("Alerts Cache Last offset:: {}, Current Offset:: {}", alertsLastOffset, alertsCurrentOffset);
        List<AlertEvent> eventsListSinceLastFetch = alertEventsList.subList(alertsCurrentOffset, alertsLastOffset);
        alertsCurrentOffset = alertsLastOffset;
        return eventsListSinceLastFetch;
    }


    /*
    Return a List of Sensor Events from ArrayList
     */
    public List<BaseEvent> getSensorEvents() {
        sensorEventsLastOffset = sensorEventsList.size();
        logger.info("Sensor Events Cache Last Offset:: {}, Current Offset:: {}", sensorEventsLastOffset, sensorEventsCurrentOffset);
        List<BaseEvent> sensorEventsListSinceLastFetch = sensorEventsList.subList(sensorEventsCurrentOffset, sensorEventsLastOffset);
        sensorEventsCurrentOffset = sensorEventsLastOffset;
        return sensorEventsListSinceLastFetch;
    }

}
