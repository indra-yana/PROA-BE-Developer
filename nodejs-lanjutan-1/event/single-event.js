const EventEmitter = require('events');

const myEventEmitter = new EventEmitter();

// Latihan 1
const makeCoffee = ({ coffeeName }) => {
    console.log(`Kopi ${coffeeName} telah dibuat!`);
} 

// Mendaftarkan event = on; Memicu event = emit
myEventEmitter.on('coffee-order', makeCoffee);
myEventEmitter.emit('coffee-order', { coffeeName: 'Tubruk'});