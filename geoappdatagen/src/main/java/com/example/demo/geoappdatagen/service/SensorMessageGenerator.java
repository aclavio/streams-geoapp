package com.example.demo.geoappdatagen.service;

import com.example.demo.geoappdatagen.model.BaseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.elasticsearch.geo.utils.Geohash;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.validation.constraints.NotNull;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class SensorMessageGenerator {

    Logger logger = LoggerFactory.getLogger(SensorMessageGenerator.class);

    private static final List<String> SENSOR_TYPES = Arrays.asList("rvss", "lgds");
    private static final List<String> EVENT_TYPES = Arrays.asList("Fence Cutting", "Fence Climbing", "Jumping", "Car Driving", "Car Speeding");
    private static final List<String> SEVERITY = Arrays.asList("high", "medium", "low");
    @Value("${application.configs.latitude.min:-90}")
    private Double LAT_MIN;
    @Value("${application.configs.latitude.max:90}")
    private Double LAT_MAX;
    @Value("${application.configs.longitude.min:-180}")
    private Double LON_MIN;
    @Value("${application.configs.longitude.max:180}")
    private Double LON_MAX;

    @Autowired
    @Qualifier("objectMapper")
    private ObjectMapper objectMapper;

    private List<BaseEvent> messageList;
    private int index;

    @NotNull
    @Value("${application.configs.sensor.data.file.location}")
    private String testDataFile;

    @PostConstruct
    private void loadDataFileToList() {
        //String testDataFile = "data/messages";
        index = 0;
        try {
            messageList = readFileFromClasspath(testDataFile);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }


    private List<BaseEvent> readFileFromClasspath(String filenameWithPath)
            throws IOException {
        List<BaseEvent> messageList = new ArrayList();

        logger.info(String.format("Starting to read data from file %s", filenameWithPath));

        InputStream inputStream = null;
        try {
            ClassLoader classLoader = getClass().getClassLoader();
            inputStream = classLoader.getResourceAsStream(filenameWithPath);

            BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            while ((line = br.readLine()) != null) {
                logger.info("Read Line::" + line);
                BaseEvent baseEvent = objectMapper.readValue(line, BaseEvent.class);
                baseEvent.setEventTimeStrFormatted(getEventTimeFormatted());
                messageList.add(baseEvent);
            }
            logger.info("Read total of %s lines from source file", messageList.size());
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return messageList;
    }

    private String getEventTimeFormatted() {
        Date currentDate = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-YYYY HH:mm:ss z");
        sdf.setTimeZone(TimeZone.getTimeZone("MST"));
        return sdf.format(currentDate);
    }

    private int getIndex() {
        return index++;
    }

    public BaseEvent getNextMessage() {
        BaseEvent message = messageList.get(index);
        index++;
        return message;
    }

    public BaseEvent getMessage(int i) {
        BaseEvent message = messageList.get(index);
        return message;
    }

    public int getMessageCount() {
        return messageList.size();
    }

    public BaseEvent generateRandomEvent() {
        Random rand = ThreadLocalRandom.current();
        String sensorType = SENSOR_TYPES.get(rand.nextInt(SENSOR_TYPES.size()));
        BaseEvent event = new BaseEvent();
        event.setSensorType(sensorType);
        event.setEventId(String.format("%s-event-%s", sensorType, UUID.randomUUID()));
        event.setEventType(EVENT_TYPES.get(rand.nextInt(EVENT_TYPES.size())));
        event.setSeverity(SEVERITY.get(rand.nextInt(SEVERITY.size())));
        event.setEventTimeStrFormatted(getEventTimeFormatted());
        Double latitude = rand.nextDouble() * (LAT_MAX - LAT_MIN) + LAT_MIN;
        latitude = BigDecimal.valueOf(latitude)
                .setScale(6, RoundingMode.HALF_UP)
                .doubleValue();
        event.setLatitude(latitude);
        double longitude = rand.nextDouble() * (LON_MAX - LON_MIN) + LON_MIN;
        longitude = BigDecimal.valueOf(longitude)
                .setScale(6, RoundingMode.HALF_UP)
                .doubleValue();
        event.setLongitude(longitude);
        event.setGeohash(Geohash.stringEncode(longitude, latitude, 12));

        // CHAOS MONKEY
        int chaos = rand.nextInt(100);
        if (chaos > 95) event.setLatitude(-200.0);
        else if (chaos > 90) event.setLatitude(91.0);
        else if (chaos > 85) event.setLongitude(200.0);
        else if (chaos > 80) event.setLongitude(-181.0);

        return event;
    }
}
