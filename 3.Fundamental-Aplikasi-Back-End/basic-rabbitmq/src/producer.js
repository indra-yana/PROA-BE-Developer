const amqp = require('amqplib');

const init = async () =>{
    const connection = await amqp.connect('amqp://guest:guest@localhost'); // amqp://user:pass@192.168.10.10 or amqp://guest:guest@localhost
    const channel = await connection.createChannel();

    const queueName = 'dicoding';
    const message = 'Selamat belajar message broker';

    await channel.assertQueue(queueName, { durable: true });
    await channel.sendToQueue(queueName, Buffer.from(message));

    console.log('Pesan berhasil terkirim');

    setTimeout(() => {
        connection.close()
    }, 1000);
};

init();