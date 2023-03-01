package com.example.demo.geoappdatagen.service;

import com.example.demo.geoappdatagen.model.BaseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

@Service
public class SensorMessageGenerator {

    Logger logger = LoggerFactory.getLogger(SensorMessageGenerator.class);

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


}
