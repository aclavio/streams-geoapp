package com.example.demo.geoappdatagen.config;

import com.example.demo.geoappdatagen.model.BaseEvent;
import io.confluent.kafka.serializers.json.KafkaJsonSchemaSerializer;
import io.confluent.kafka.serializers.json.KafkaJsonSchemaSerializerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {
    @Value("${spring.kafka.producer.schema.registry.url}")
    String schemaRegistryUrl;

    @Value("${spring.kafka.producer.auto.register.schemas}")
    Boolean autoRegister;

    @Bean(name="geoEventsKafkaTemplate")
    public KafkaTemplate<String, BaseEvent> geoEventsKafkaTemplate(ProducerFactory<String, BaseEvent> pf) {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.CLIENT_ID_CONFIG,"geoapp-data-simulator");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        //props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaJsonSchemaSerializer.class);
        //props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaAvroSerializer.class);
        props.put(KafkaJsonSchemaSerializerConfig.SCHEMA_REGISTRY_URL_CONFIG, schemaRegistryUrl);
        props.put(KafkaJsonSchemaSerializerConfig.AUTO_REGISTER_SCHEMAS, autoRegister);
        props.put(KafkaJsonSchemaSerializerConfig.USE_SCHEMA_ID, 1);

        return new KafkaTemplate<>(pf,
                props);
    }

}
