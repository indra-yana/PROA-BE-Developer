const fs = require('fs');

const writeableStream = fs.createWriteStream('./writeable-stream/output.txt');

writeableStream.write('Baris pertama\n');
writeableStream.write('Baris kedua\n');
writeableStream.write('Baris ketiga\n');
writeableStream.end();