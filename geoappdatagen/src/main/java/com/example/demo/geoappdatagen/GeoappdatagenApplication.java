package com.example.demo.geoappdatagen;

import com.example.demo.geoappdatagen.kafka.KafkaMessageProducer;
import com.example.demo.geoappdatagen.model.BaseEvent;
import com.example.demo.geoappdatagen.service.SensorMessageGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GeoappdatagenApplication implements ApplicationRunner {

	Logger logger = LoggerFactory.getLogger(GeoappdatagenApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(GeoappdatagenApplication.class, args);
	}


	@Autowired
	private KafkaMessageProducer kafkaMessageProducer;

	@Autowired
	private SensorMessageGenerator sensorMessageGenerator;

	@Value("${application.configs.random.event.count:0}")
	private int randomEventCount;

	@Override
	public void run(ApplicationArguments args) throws Exception {
		/*
		   Generate sample events
		 */
		logger.info("Inside run method...");
		int messageCount = sensorMessageGenerator.getMessageCount();

		for (int i = 0; i < messageCount; i++) {
			try {
				BaseEvent event = sensorMessageGenerator.getNextMessage();
				publishEvent(event);
				Thread.sleep(1400);
			} catch (Exception ex) {
				logger.error("Exception Thrown while publishing messages", ex);
			}
		}

		for (int i = 0; i < randomEventCount; i++) {
			try {
				BaseEvent event = sensorMessageGenerator.generateRandomEvent();
				publishEvent(event);
				Thread.sleep(1400);
			} catch (Exception ex) {
				logger.error("Exception Thrown while publishing random messages", ex);
			}
		}
	}

	private void publishEvent(BaseEvent event) throws Exception {
		if (event.getSensorType().equalsIgnoreCase("rvss")) {
			kafkaMessageProducer.generateRvssEvent(event);
		} else if (event.getSensorType().equalsIgnoreCase("lgds")) {
			kafkaMessageProducer.generateLgdsEvent(event);
		} else {
			logger.error(">>>>>> INVALID MESSAGE TYPE <<<<<<, unable to determine destination");
		}
	}


}
