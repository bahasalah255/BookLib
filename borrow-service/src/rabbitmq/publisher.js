const amqp = require('amqplib');

const publishMessage = async (queue, message, retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
      console.log(`[RabbitMQ] Message publié sur "${queue}":`, JSON.stringify(message));
      await channel.close();
      await connection.close();
      return;
    } catch (err) {
      console.error(`[RabbitMQ] Tentative ${attempt}/${retries} échouée :`, err.message);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
  console.error('[RabbitMQ] Échec de publication après toutes les tentatives.');
};

module.exports = { publishMessage };
