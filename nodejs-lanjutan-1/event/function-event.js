const EventEmitter = require('events');

const myEventEmitter = new EventEmitter();

const makeCoffee = (coffeeName) => {
    console.log(`Kopi ${coffeeName} telah dibuat!`);
}

const makeBill = (price) => {
    console.log(`Bill sebesar ${price} telah dibuat!`);
}

const onCoffeeOrderedListener = ({ coffeeName, price }) => {
    makeCoffee(coffeeName);
    makeBill(price);
}

myEventEmitter.on('coffee-order', onCoffeeOrderedListener);
myEventEmitter.emit('coffee-order', { coffeeName: 'Tubruk', price: 15000 });