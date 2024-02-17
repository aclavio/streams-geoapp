package com.example.demo.geoapp.rest;

import com.example.demo.geoapp.kafka.KafkaMessageProducer;
import com.example.demo.geoapp.model.AlertEvent;
import com.example.demo.geoapp.model.BaseEvent;
import com.example.demo.geoapp.model.SensorEvent;
import com.example.demo.geoapp.service.KafkaEventService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.elasticsearch.geo.utils.Geohash;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/sensor")
public class GeoappRestController {

    Logger logger = LoggerFactory.getLogger(GeoappRestController.class);

    @Autowired
    @Qualifier("objectMapper")
    private ObjectMapper objectMapper;

    @Autowired
    private KafkaEventService kafkaEventService;

    @Autowired
    KafkaMessageProducer kafkaMessageProducer;

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

    @PutMapping(path = "/createEvent", consumes="application/json")
    @ResponseBody
    public ResponseEntity putManualEvent(@RequestBody BaseEvent event) {
        try {
            event.setEventId("geoapp-producer-" + UUID.randomUUID());
            event.setEventTimeStrFormatted(getEventTimeFormatted());
            event.setGeohash(Geohash.stringEncode(event.getLongitude(), event.getLatitude(), 12));
            logger.info("attempting to publish manual event: {}", objectMapper.writeValueAsString(event));
            if ("rvss".equalsIgnoreCase(event.getSensorType())) {
                kafkaMessageProducer.generateRvssEvent(event);
            } else if ("lgds".equalsIgnoreCase(event.getSensorType())) {
                kafkaMessageProducer.generateLgdsEvent(event);
            } else {
                logger.error(">>>>>> INVALID MESSAGE TYPE <<<<<<, unable to determine destination");
                return new ResponseEntity(HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity(HttpStatus.CREATED);
        } catch (JsonProcessingException e) {
            logger.error("Unable to parse event", e);
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Unable to publish event", e);
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private String getEventTimeFormatted() {
        Date currentDate = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-YYYY HH:mm:ss z");
        sdf.setTimeZone(TimeZone.getTimeZone("MST"));
        return sdf.format(currentDate);
    }

/*
curl -v -X PUT http://localhost:8080/geoapp/sensor/createEvent --json @- <<EOF
{
"sensorType": "lgds",
"eventType": "LGDS-TEST",
"latitude": 31.33411,
"longitude": -109.95507,
"severity": "HIGH"
}
EOF

curl -v -X PUT http://localhost:8080/geoapp/sensor/createEvent --json @- <<EOF
{
"sensorType": "rvss",
"eventType": "RVSS-TEST",
"latitude": 31.33411,
"longitude": -109.95516,
"severity": "HIGH"
}
EOF
 */

}
