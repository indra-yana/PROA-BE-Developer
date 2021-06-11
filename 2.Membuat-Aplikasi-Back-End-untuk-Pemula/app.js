// const initialMemoryUsage = process.memoryUsage().heapUsed;     // TODO 1
// const yourName = process.argv[2];     // TODO 2
// const env = process.env.USERNAME;     // TODO 3

// for (let i = 0; i < 10000; i++) {
//     // Some logic
// }

// const currentMemoryUsage = process.memoryUsage().heapUsed; // TODO 4

// console.log(`Hai, ${yourName}`);
// console.log(`Mode environtment, ${env}`);
// console.log(`Penggunaan memory dari, ${initialMemoryUsage} naik ke ${currentMemoryUsage}`);


const moment = require('moment');

const date = moment().locale('id').format("DD MMM YYYY");
console.log(date);