package com.example.demo.geoappdatagen.kafka;

import com.example.demo.geoappdatagen.model.BaseEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.kafka.support.serializer.JsonSerializer;

@Service
public class KafkaMessageProducer {

    Logger logger = LoggerFactory.getLogger(KafkaMessageProducer.class);

    @Autowired
    @Qualifier("objectMapper")
    private ObjectMapper objectMapper;

    @Value("${application.configs.lgds.input.topic.name}")
    private String LGDS_INPUT_TOPIC_NAME;

    @Value("${application.configs.rvss.input.topic.name}")
    private String RVSS_INPUT_TOPIC_NAME;


    @Autowired
    private KafkaTemplate<String, BaseEvent> geoEventsKafkaTemplate;

    /*
      Publishes test messages on to the lgds input topic.
      Topic name specified in application yaml file
     */
    public void generateLgdsEvent(BaseEvent message) throws JsonProcessingException {
        logger.info(String.format("Producing LGDS Message: %s", message.getEventId()));
        logger.info(String.format("Producing LGDS Message: %s", objectMapper.writeValueAsString(message)));
        geoEventsKafkaTemplate.send(LGDS_INPUT_TOPIC_NAME, message);
    }

    /*
      Publishes test messages on to the RVSS input topic.
      Topic name specified in application yaml file
     */
    public void generateRvssEvent(BaseEvent message) throws JsonProcessingException {
        logger.info(String.format("Producing RVSS Message: %s", message.getEventId()));
        logger.info(String.format("Producing RVSS Message: %s", objectMapper.writeValueAsString(message)));
        geoEventsKafkaTemplate.send(RVSS_INPUT_TOPIC_NAME, message);
    }

}
