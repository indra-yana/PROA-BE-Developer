const amqp = require('amqplib');

const init = async () =>{
    const connection = await amqp.connect('amqp://guest:guest@localhost'); // amqp://user:pass@192.168.10.10 or amqp://guest:guest@localhost
    const channel = await connection.createChannel();

    const queueName = 'dicoding';

    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, (message) => {
        console.log(`Menerima pesan dari queue ${queueName}: ${message.content.toString()}`);
    }, { noAck: true });
};

init();