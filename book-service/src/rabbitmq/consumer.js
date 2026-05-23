const amqp = require('amqplib');
const Book = require('../models/Book');

const QUEUE = 'emprunt_effectue';

const connectConsumer = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    console.log(`[RabbitMQ] En attente de messages sur la queue "${QUEUE}"...`);

    channel.consume(QUEUE, async (msg) => {
      if (!msg) return;

      try {
        const { livreId, action } = JSON.parse(msg.content.toString());

        if (action === 'emprunter') {
          await Book.findByIdAndUpdate(livreId, { disponible: false });
          console.log(`[RabbitMQ] Livre ${livreId} marqué comme indisponible.`);
        } else if (action === 'retourner') {
          await Book.findByIdAndUpdate(livreId, { disponible: true });
          console.log(`[RabbitMQ] Livre ${livreId} marqué comme disponible.`);
        } else {
          console.warn(`[RabbitMQ] Action inconnue : ${action}`);
        }

        channel.ack(msg);
      } catch (err) {
        console.error('[RabbitMQ] Erreur de traitement du message :', err.message);
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    console.error('[RabbitMQ] Connexion échouée, nouvelle tentative dans 5s...', err.message);
    setTimeout(connectConsumer, 5000);
  }
};

module.exports = connectConsumer;
