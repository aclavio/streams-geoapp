const { Kafka } = require('@confluentinc/kafka-javascript').KafkaJS;
const { SchemaRegistry, SchemaType } = require('@kafkajs/confluent-schema-registry');

export const ALERT_LIST = [];
export const EVENT_LIST = [];

async function consumerStart() {
    console.log('Initializing Kafka Consumer');
    let consumer;
    let stopped = false;

    // Initialization
    let registry = new SchemaRegistry({
        host: process.env.KAFKA_SCHEMA_REGISTRY_URL
    }, {
        [SchemaType.JSON]: {
            strict: false
        }
    });
    consumer = new Kafka().consumer({
        'bootstrap.servers': process.env.KAFKA_BOOTSTRAP_SERVERS,
        'group.id': process.env.KAFKA_CONSUMER_GROUP_ID,
        'auto.offset.reset': process.env.KAFKA_AUTO_OFFSET_RESET,
    });

    console.log('Kafka Consumer connecting...');
    await consumer.connect();
    console.log('Kafka Consumer subscribing...');

    const alertTopics = ('' + process.env.ALERT_TOPICS).split(',');
    const eventTopics = ('' + process.env.EVENT_TOPICS).split(',');

    await consumer.subscribe({ topics: [].concat(alertTopics, eventTopics) });

    console.log('Kafka Consumer running...');
    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let data = {
                topic,
                partition,
                offset: message.offset,
                key: message.key?.toString(),
                value: message.value.toString(),
                decodedValue: await registry.decode(message.value)
            };
            console.log(data);

            if (alertTopics.includes(topic)) {
                ALERT_LIST.push(data.decodedValue);
                console.debug('added new Alert: ', ALERT_LIST.length);
            } else if (eventTopics.includes(topic)) {
                EVENT_LIST.push(data.decodedValue);
                console.debug('added new Event: ', EVENT_LIST.length);
            } else {
                console.error(`unknown topic ${topic}`);
            }
        }
    });

    // Update stopped whenever we're done consuming.
    // The update can be in another async function or scheduled with setTimeout etc.
    while (!stopped) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Kafka Consumer disconnecting...');
    await consumer.disconnect();
}

consumerStart();
