const amqp = require('amqplib');

const QUEUE = 'emprunt_effectue';

let channel = null;

const connectPublisher = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    console.log(`[RabbitMQ] Publisher connecté à la queue "${QUEUE}".`);

    // Reconnect on connection close
    connection.on('close', () => {
      console.warn('[RabbitMQ] Connexion fermée, reconnexion dans 5s...');
      channel = null;
      setTimeout(connectPublisher, 5000);
    });
  } catch (err) {
    console.error('[RabbitMQ] Connexion échouée, nouvelle tentative dans 5s...', err.message);
    setTimeout(connectPublisher, 5000);
  }
};

const publishMessage = (livreId, action) => {
  if (!channel) {
    console.error('[RabbitMQ] Le canal n\'est pas disponible. Message non envoyé.');
    return false;
  }

  const message = JSON.stringify({ livreId, action });

  channel.sendToQueue(QUEUE, Buffer.from(message), { persistent: true });

  console.log(`[RabbitMQ] Message publié : ${message}`);
  return true;
};

module.exports = { connectPublisher, publishMessage };
