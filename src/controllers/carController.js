const CarModel = require('../models/carModel');
const db = require('../config/database');

const CarsController = {
    /*
    createCar: (req, res) => {
        const { brand, model, year, items } = req.body;

        // Validações
        if (!brand) return res.status(400).json({ error: "marca é necessária" });
        if (!model) return res.status(400).json({ error: "modelo é necessário" });
        if (!year) return res.status(400).json({ error: "ano é necessário" });
        if (year < 2015 || year > 2025) return res.status(400).json({ error: "o ano deve ser entre 2015 e 2025" });

        const car = { brand, model, year };

        CarModel.checkCarExists(car, (err, exists) => {
            if (err) return res.status(500).json({ error: "Erro no Servidor Interno" });
            if (exists) return res.status(409).json({ error: "já existe um carro com esses dados" });

            CarModel.createCar(car, (err, id) => {
                if (err) return res.status(500).json({ error: "Erro no Servidor Interno" });
                res.status(201).json({ id });
            });
        });
    },*/

    createCar: (req, res) => {
        const { brand, model, year, items } = req.body; // Supondo que os itens venham no corpo da requisição
        const uniqueItems = [...new Set(items)]; // Remove itens duplicados, se necessário

        const queryCar = 'INSERT INTO cars (brand, model, year) VALUES (?, ?, ?)';

        db.beginTransaction(err => {
            if (err) throw err;

            db.query(queryCar, [brand, model, year], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Erro ao inserir carro:', err);
                        return res.status(500).json({ error: err.message });
                    });
                }

                const carId = result.insertId;

                const itemPromises = uniqueItems.map(item => {
                    return new Promise((resolve, reject) => {
                        // Verifica se o item já existe
                        const queryCheckItem = 'SELECT id FROM cars_items WHERE name = ?';
                        db.query(queryCheckItem, [item], (err, rows) => {
                            if (err) {
                                return reject(err);
                            }

                            if (rows.length > 0) {
                                // O item já existe, pega o ID
                                const itemId = rows[0].id;

                                // Verifica se o carro já tem esse item
                                const queryCheckCarItem = 'SELECT * FROM cars_items WHERE car_id = ? AND id = ?';
                                db.query(queryCheckCarItem, [carId, itemId], (err, rows) => {
                                    if (err) {
                                        return reject(err);
                                    }

                                    if (rows.length === 0) {
                                        // O carro não tem esse item, insere a relação
                                        const queryInsertCarItem = 'INSERT INTO cars_items (car_id, name) VALUES (?, ?)';
                                        db.query(queryInsertCarItem, [carId, item], (err) => {
                                            if (err) {
                                                return reject(err);
                                            }
                                            resolve();
                                        });
                                    } else {
                                        // O carro já tem esse item, ignora
                                        resolve();
                                    }
                                });
                            } else {
                                // O item não existe, insere o novo item
                                const queryInsertItem = 'INSERT INTO cars_items (name) VALUES (?)';
                                db.query(queryInsertItem, [item], (err, result) => {
                                    if (err) {
                                        return reject(err);
                                    }

                                    const newItemId = result.insertId;

                                    // Insere a relação entre o carro e o novo item
                                    const queryInsertCarItem = 'INSERT INTO cars_items (car_id, name) VALUES (?, ?)';
                                    db.query(queryInsertCarItem, [carId, item], (err) => {
                                        if (err) {
                                            return reject(err);
                                        }
                                        resolve();
                                    });
                                });
                            }
                        });
                    });
                });

                Promise.all(itemPromises)
                    .then(() => {
                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Erro ao inserir itens:', err);
                                    return res.status(500).json({ error: err.message });
                                });
                            }
                            console.log('Transação concluída com sucesso.');
                            res.status(201).json({ message: 'Carro e itens inseridos com sucesso.', carId });
                        });
                    })
                    .catch(err => {
                        db.rollback(() => {
                            console.error('Erro ao inserir itens:', err);
                            return res.status(500).json({ error: err.message });
                        });
                    });
            });
        });
    },

    /*
    getAllCars: (req, res) => {
        const { page = 1, limit = 5, brand, model, year } = req.query;
        const offset = (page - 1) * limit;

        CarModel.getAllCars({ brand, model, year }, { limit: Math.min(limit, 10), offset }, (err, cars) => {
            if (err) return res.status(500).json({ error: "Erro no Servidor Interno" });
            if (cars.length === 0) return res.status(204).send();

            res.status(200).json({
                count: cars.length,
                pages: Math.ceil(cars.length / limit),
                data: cars
            });
        });
    },*/

    getAllCars: (req, res) => {
        const { page = 1, limit = 5, brand, model, year } = req.query;
        const offset = (page - 1) * limit;

        // Consulta SQL para obter carros e seus itens
        const sql = `
        SELECT c.id AS car_id, c.brand, c.model, c.year, ci.name AS item_name
        FROM cars c
        LEFT JOIN cars_items ci ON c.id = ci.car_id
        WHERE (c.brand = ? OR ? IS NULL)
        AND (c.model = ? OR ? IS NULL)
        AND (c.year = ? OR ? IS NULL)
        LIMIT ? OFFSET ?
    `;

        db.query(sql, [brand, brand, model, model, year, year, Math.min(limit, 10), offset], (err, results) => {
            if (err) return res.status(500).json({ error: "Erro no Servidor Interno" });

            // Agrupar os resultados por carro
            const cars = {};
            results.forEach(row => {
                const { car_id, brand, model, year, item_name } = row;

                if (!cars[car_id]) {
                    cars[car_id] = {
                        id: car_id,
                        brand,
                        model,
                        year,
                        items: []
                    };
                }

                if (item_name) {
                    cars[car_id].items.push(item_name);
                }
            });

            // Converter o objeto em um array
            const carsArray = Object.values(cars);
            res.status(200).json({
                count: carsArray.length,
                pages: Math.ceil(carsArray.length / limit),
                data: carsArray
            });
        });
    },

    getCarById: (req, res) => {
        const { id } = req.params;

        CarModel.getCarById(id, (err, car) => {
            if (err) return res.status(500).json({ error: "Erro no Servidor Interno" });
            if (!car) return res.status(404).json({ error: "carro não encontrado" });

            res.status(200).json(car);
        });
    },

    updateCar: (req, res) => {
        const { id } = req.params;
        const { brand, model, year, items } = req.body;

        const car = { brand, model, year };

        CarModel.getCarById(id, (err, existingCar) => {
            if (err) return res.status(500).json({ error: "Erro no Servidor Interno" });
            if (!existingCar) return res.status(404).json({ error: "Erro no Servidor Interno" });

            if (year && (year < 2015 || year > 2025)) return res.status(400).json({ error: "year should be between 2015 and 2025" });

            CarModel.checkCarExists(car, (err, exists) => {
                if (err) return res.status(500).json({ error: "Erro no Servidor Interno" });
                if (exists) return res.status(409).json({ error: "já existe um carro com esses dados" });

                CarModel.updateCar(id, car, (err) => {
                    if (err) return res.status(500).json({ error: "Erro no Servidor Interno" });
                    res.status(204).send();
                });
            });
        });
    },

    deleteCar: (req, res) => {
        const { id } = req.params;

        CarModel.getCarById(id, (err, car) => {
            if (err) return res.status(500).json({ error: "Erro no Servidor Interno" });
            if (!car) return res.status(404).json({ error: "Erro no Servidor Interno" });

            CarModel.deleteCar(id, (err) => {
                if (err) return res.status(500).json({ error: "Erro no Servidor Interno" });
                res.status(204).send();
            });
        });
    },

    getCarItems: (req, res) => {
        const carId = req.params.id;
        const sql = 'SELECT * FROM cars_items WHERE car_id = ?';
        db.query(sql, [carId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    },
    getAllCarItems: (req, res) => {
        const sql = 'SELECT * FROM cars_items';
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                count: results.length,
                pages: 1,
                data: results
            });
        });
    }
};

module.exports = CarsController;