class Car {
    constructor(id, brand, model, year, items = [""]) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.items = items;
    }
}

class CarItem {
    constructor(id, name, carId) {
        this.id = id;
        this.name = name;
        this.carId = carId;
    }
}

module.exports = { Car, CarItem };
