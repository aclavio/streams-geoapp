package com.example.demo.geoappdatagen.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeoAppConfig {

    private ObjectMapper objectMapper;

    @Bean(name="objectMapper")
    public ObjectMapper initObjectMapper() {
        objectMapper = new ObjectMapper();
        return objectMapper;
    }


}
