const { kafka, topic } = require('./Gemeinsam');

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString());
      console.log('Nachricht erhalten:', value);
    },
  });
};

run().catch(console.error);