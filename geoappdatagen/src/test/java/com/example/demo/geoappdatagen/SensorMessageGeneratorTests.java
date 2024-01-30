package com.example.demo.geoappdatagen;

import com.example.demo.geoappdatagen.model.BaseEvent;
import com.example.demo.geoappdatagen.service.SensorMessageGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SensorMessageGeneratorTests {

    Logger logger = LoggerFactory.getLogger(SensorMessageGeneratorTests.class);

    @Autowired
    @Qualifier("objectMapper")
    private ObjectMapper objectMapper;

    @Test
    void RandomEventTest() throws JsonProcessingException {

        SensorMessageGenerator gen = new SensorMessageGenerator();

        for(int i = 0; i < 10; i++) {
            BaseEvent rndEvt = gen.generateRandomEvent();
            logger.info(objectMapper.writeValueAsString(rndEvt));
        }
    }

}
