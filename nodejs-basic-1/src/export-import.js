// const {coffeeStock, isCoffeeMachineReady} = require("./state");  // Default
import {coffeeStock, isCoffeeMachineReady} from "./state.js";       // ES6

console.log(coffeeStock);
console.log(isCoffeeMachineReady);

const makeCoffee = (type, miligrams) => {
    if (coffeeStock[type] >= miligrams) {
        console.log("Kopi berhasil dibuat!");
    } else {
        console.log("Biji kopi habis!");
    }
}

makeCoffee("robusta", 80);