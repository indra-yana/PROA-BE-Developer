const fs = require('fs');

const readableStream = fs.createReadStream('./writeable-stream/input.txt', {
    highWaterMark: 15
});

const writeableStream = fs.createWriteStream('./writeable-stream/output.txt');

readableStream.on('ready', () => {
    writeableStream.write('---------------------------\n');
});

readableStream.on('readable', () => {
    try {
        let result = readableStream.read();
        if (result) {
            writeableStream.write(`${result}\n`);
        }
    } catch (error) {
        console.log(error);
    }
});

readableStream.on('end', () => {
    writeableStream.end('---------------------------\n');
});