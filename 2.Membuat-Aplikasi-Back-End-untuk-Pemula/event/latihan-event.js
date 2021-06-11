const EventEmitter = require('events');

const myEventEmitter = new EventEmitter();

const gretting = (name, message) => {
    console.log(`Happy birthday ${name}! ${message}`);
}

const onBirthdayEventListener = (name, message) => {
    gretting(name, message);
}

myEventEmitter.on('my-birthday-come', onBirthdayEventListener);
myEventEmitter.emit('my-birthday-come', 'Indra Muliana', 'Semoga panjang umur');