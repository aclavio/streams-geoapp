package com.example.demo.geoapp.config;

import com.example.demo.geoapp.model.AlertEvent;
import com.example.demo.geoapp.model.BaseEvent;
import com.example.demo.geoapp.model.SensorEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class EventsCacheConfig {


    //List to hold Alerts data
    private List<AlertEvent> alertEventsList;

    //List to hold Sensor Events data
    private List<BaseEvent> sensorEventsList;



    @Bean(name="alertEventsList")
    public List<AlertEvent> initAlertEventsList() {
        alertEventsList = new ArrayList<>();
        //setMockAlertData();
        return alertEventsList;
    }

    @Bean(name="sensorEventsList")
    public List<BaseEvent> initSensorEventsList() {
        sensorEventsList = new ArrayList<>();
        return sensorEventsList;
    }



    /*
      Test method to load dummy events to test REST API
     */
    private void setMockAlertData() {
        AlertEvent alertEvent1 = new AlertEvent();
        alertEvent1.setLgdsEventId("lgds1");
        alertEvent1.setLgdsEventLatitude(14.5472791);
        alertEvent1.setLgdsEventLongitude(121.0475401);
        alertEvent1.setLgdsEventSeverity("high");
        alertEvent1.setLgdsEventTime("1677169875537");
        alertEvent1.setLgdsEventType("Fence Cutting");
        alertEvent1.setLgdsGeoHash("wdw4f820h17g");

        alertEvent1.setRvssEventId("rvss1");
        alertEvent1.setRvssEventLatitude(14.5472791);
        alertEvent1.setRvssEventLongitude(121.0475401);
        alertEvent1.setRvssEventSeverity("Critical");
        alertEvent1.setRvssEventTime("1677169875537");
        alertEvent1.setRvssEventType("Car Driving");
        alertEvent1.setRvssGeoHash("wdw4f820h17g");

        AlertEvent alertEvent2 = new AlertEvent();
        alertEvent2.setLgdsEventId("lgds2");
        alertEvent2.setLgdsEventLatitude(14.5472791);
        alertEvent2.setLgdsEventLongitude(121.0475401);
        alertEvent2.setLgdsEventSeverity("high");
        alertEvent2.setLgdsEventTime("1677169875537");
        alertEvent2.setLgdsEventType("Jumping");
        alertEvent2.setLgdsGeoHash("wdw4f820h17g");

        alertEvent2.setRvssEventId("rvss2");
        alertEvent2.setRvssEventLatitude(14.5472791);
        alertEvent2.setRvssEventLongitude(121.0475401);
        alertEvent2.setRvssEventSeverity("Critical");
        alertEvent2.setRvssEventTime("1677169875537");
        alertEvent2.setRvssEventType("Car Speeding");
        alertEvent2.setRvssGeoHash("wdw4f820h17g");

        alertEventsList.add(alertEvent1);
        alertEventsList.add(alertEvent2);

    }

}
