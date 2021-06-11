const orderCoffee = (callback) => {
    let coffee = null;
    console.log("Sedang membuat kopi, silahkan tunggu!");
    setTimeout(() => {
        coffee = "Kopi sudah jadi!";
        callback(coffee, "Silahkan dinikmati!");
    }, 2000);
}

orderCoffee((coffee, message) => {
    console.log(coffee);
    console.log(message);
});