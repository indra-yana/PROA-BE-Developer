const getCoffee = () => {
    return new Promise((resolve, reject) => {
        const seeds = 100;
        setTimeout(() => {
            if (seeds >= 100) {
                resolve("Kopi didapatkan!");
            } else {
                reject("Biji kopi habis!");
            }
        }, 1000);
    })
}

function makeCoffee() {
    getCoffee().then(coffee => {
        console.log(coffee);
    });
    console.log("Done!");
}

async function makeCoffeeAsync() {
    try {
        const coffee = await getCoffee();
        console.log(coffee);
        console.log("Done!");
    } catch (error) {
        console.log(error);
    }
}

makeCoffee();
makeCoffeeAsync();

// Import
import { checkAvailability, checkStock, brewCoffee, boilWater, grindCoffeeBeans } from './async-chaining-promise.js';

async function makeEspressoAsync() {
    try {
        await checkAvailability();
        await checkStock();
        const coffee = await brewCoffee();
        console.log(coffee);
    } catch (error) {
        console.log(error);
    }
}

makeEspressoAsync();

function fetchUsername() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('JSUser');
        }, 3000);
    })
}

console.log("Fetching username...");
const username = fetchUsername();
console.log(`You are logged in as ${username}`);
console.log("Welcome!");