const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['zimolong.eu:9092']
});

const topic = 'WWI22B4.PaschkeTim.Aufgabenblatt';

module.exports = { kafka, topic };