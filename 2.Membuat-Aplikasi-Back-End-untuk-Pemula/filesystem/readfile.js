const fs = require('fs');
const { resolve } = require('path');

const fileReadCallback = (error, data) => {
    if (error) {
        console.log(`Gagal membaca berkas! ${error}`);
        return;
    }

    console.log("Async: " +data);
}

// Read file Asyncronously
// Cara 1 tulisakan dengan full path
fs.readFile('./filesystem/notes.txt', 'UTF-8', fileReadCallback);
console.log("Async: Hello");

// Cara 2 dengan menggunakan path resolver
// fs.readFile(resolve(__dirname, 'notes.txt'), 'UTF-8', fileReadCallback);

// Read file Syncronously
const data = fs.readFileSync('./filesystem/notes.txt', 'UTF-8');
console.log("Sync: " +data);
console.log("Sync: Hello");