package com.example.demo.geoapp.rest;

import com.example.demo.geoapp.model.AlertEvent;
import com.example.demo.geoapp.model.BaseEvent;
import com.example.demo.geoapp.model.SensorEvent;
import com.example.demo.geoapp.service.KafkaEventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/sensor")
public class GeoappRestController {

    Logger logger = LoggerFactory.getLogger(GeoappRestController.class);

    @Autowired
    private KafkaEventService kafkaEventService;

    @GetMapping(path="/getAlertEvents", produces="application/json")
    public List<AlertEvent> getAlertEvents() {
        logger.info("getAlertEvents API called, time {}", new Date());
        return kafkaEventService.getAlertEvents();
    }


    @GetMapping(path="/getSensorEvents", produces="application/json")
    public List<BaseEvent> getSensorEvents() {
        logger.info("getSensorEvents API called, time {}", new Date());
        return kafkaEventService.getSensorEvents();
    }

}
