// Contoh 1
const executorFunction = (resolve, reject) => {
    const isCoffeeMachineReady = true;
    if (isCoffeeMachineReady) {
        resolve("Kopi berhasil dibuat!");
    } else {
        reject("Mesin kopi rusak!");
    }
}

const makeCoffee = () => {
    return new Promise(executorFunction);
}

makeCoffee().then(
    onResolved => {
        console.log(onResolved);
    }, 
    onRejected => {
        console.log(onRejected);
    });

// Contoh 2
const stock = {
    coffeeBeans: 250,
    water: 1000,
}

const checkStock = () => {
    return new Promise((resolve, reject) => {
        if (stock.coffeeBeans >= 16 && stock.water >= 250) {
            resolve("Stock cukup. Bisa membuat kopi");
        } else {
            reject("Stock tidak cukup");
        }
    });
}

const handleSuccess = resolvedValue => {
    console.log(resolvedValue);
}

const handelFailure = rejectionValue => {
    console.log(rejectionValue);
}

checkStock().then(handleSuccess, handelFailure);

// onRejected with Catch Method
checkStock().then(handleSuccess).catch(handelFailure);