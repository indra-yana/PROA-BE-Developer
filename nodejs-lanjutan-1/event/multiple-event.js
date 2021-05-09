const EventEmitter = require('events');

const myEventEmitter = new EventEmitter();

// Latihan 1
const makeCoffee = ({ coffeeName }) => {
    console.log(`Kopi ${coffeeName} telah dibuat!`);
} 

const makeBill = ({ price, message }) => {
    console.log(`Bill sebesar ${price} telah dibuat. ${message}`);
}

// Mendaftarkan event = on; Memicu event = emit
myEventEmitter.on('coffee-order', makeCoffee);
myEventEmitter.on('coffee-order', makeBill);
myEventEmitter.emit('coffee-order', { coffeeName: 'Tubruk', price: 15000, message: 'Terima kasih'})

