const readlineSync = require('readline-sync');
const { kafka, topic } = require('./Gemeinsam');

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  const interpret = readlineSync.question('Interpret: ');
  const titel = readlineSync.question('Titel: ');
  const spielzeit = parseFloat(readlineSync.question('Spielzeit in Sekunden: '));

  const message = {
    Interpret: interpret,
    Titel: titel,
    Spielzeit: spielzeit
  };

  await producer.send({
    topic: topic,
    messages: [{ value: JSON.stringify(message) }]
  });

  await producer.disconnect();
};

run().catch(console.error);