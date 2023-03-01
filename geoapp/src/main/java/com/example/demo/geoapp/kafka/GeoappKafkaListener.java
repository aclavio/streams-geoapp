package com.example.demo.geoapp.kafka;

import com.example.demo.geoapp.model.AlertEvent;
import com.example.demo.geoapp.model.SensorEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;

import java.util.List;

@Configuration
public class GeoappKafkaListener {

    Logger logger = LoggerFactory.getLogger(GeoappKafkaListener.class);

    @Autowired
    @Qualifier("alertEventsList")
    private List<AlertEvent> alertEventsList;

    @Autowired
    @Qualifier("sensorEventsList")
    private List<SensorEvent> sensorEventsList;


    @KafkaListener(id = "alertEventsGrp", topics = "${alert.events.topic.name}" , clientIdPrefix = "geoAppAlertsClient")
    public void listenAlertEvents(@Payload String message) {
        logger.info("Consumer Read Alert Event::" + message);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            AlertEvent alertEvent = objectMapper.readValue(message, AlertEvent.class);
            //add to event list
            alertEventsList.add(alertEvent);

        }catch (JsonProcessingException jpEx) {
            logger.error("Exception in parsing Alert Event message::", jpEx);
            jpEx.printStackTrace();
        }

    }

    @KafkaListener(id = "sensorEventsGrp", topics = {"${rvss.sensor.events.topic.name}","${lgds.sensor.events.topic.name}"}, clientIdPrefix = "geoAppSensorClient")
    public void listenSensorEvents(@Payload String message) {
        logger.info("Consumer Read SensorEvent::" + message);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            SensorEvent sensorEvent = objectMapper.readValue(message, SensorEvent.class);
            //add to event list
            sensorEventsList.add(sensorEvent);

        }catch (JsonProcessingException jpEx) {
            logger.error("Exception in parsing SensorEvent message::", jpEx);
            jpEx.printStackTrace();
        }

    }



}
