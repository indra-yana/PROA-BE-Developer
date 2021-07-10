const amqp = require('amqplib');

const init = async () =>{
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queueName = 'dicoding';

    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, (message) => {
        console.log(`Menerima pesan dari queue ${queueName}: ${message.content.toString()}`);
    }, { noAck: true });
};

init();