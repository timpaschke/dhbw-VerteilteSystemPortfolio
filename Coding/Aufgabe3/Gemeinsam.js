const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'musik-client-tp',
  brokers: ['zimolong.eu:9092'],
  sasl: {
    mechanism: "plain",
    username: "dhbw",
    password: "dhbw"
  }
});

const topic = 'WWI22B4.PaschkeTim.Aufgabenblatt';

module.exports = { kafka, topic }; 