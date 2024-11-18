// models/carModel.js
const db = require('../config/database');

const CarModel = {
    /*
    createCar: (car, callback) => {
        const { brand, model, year, items = [] } = car;
        const sql = 'INSERT INTO cars (brand, model, year, items) VALUES (?, ?, ?, ?)';
        db.query(sql, [brand, model, year, JSON.stringify(items)], (err, result) => {
            if (err) return callback(err);
            callback(null, result.insertId);
        });
    },*/

    createCar: (car, callback) => {
        const { brand, model, year, items = [] } = car;
        const queryCar = 'INSERT INTO cars (brand, model, year) VALUES (?, ?, ?)';

        // Inserir o carro
        db.query(queryCar, [brand, model, year], (err, result) => {
            if (err) {
                console.error('Erro ao inserir carro:', err);
                return callback(err);
            }

            const carId = result.insertId; // ID do carro recém-inserido
            console.log('Carro inserido com ID:', carId);

            // Inserir os itens associados ao carro
            const queryItems = 'INSERT INTO cars_items (name, car_id) VALUES (?, ?)';
            const uniqueItems = [...new Set(items)]; // Remover itens duplicados

            // Usar Promise.all para garantir que todos os itens sejam inseridos
            const itemPromises = uniqueItems.map(item => {
                const trimmedItem = item.trim();
                if (trimmedItem !== '') {
                    console.log('Inserindo item:', trimmedItem);
                    return new Promise((resolve, reject) => {
                        db.query(queryItems, [trimmedItem, carId], (err) => {
                            if (err) {
                                console.error('Erro ao inserir item:', err);
                                return reject(err);
                            }
                            resolve();
                        });
                    });
                }
            }).filter(Boolean); // Filtrar itens que não são promessas

            // Esperar todas as inserções de itens serem concluídas
            Promise.all(itemPromises)
                .then(() => {
                    console.log('Todos os itens inseridos com sucesso.');
                    callback(null, carId);
                })
                .catch(err => {
                    console.error('Erro ao inserir itens:', err);
                    callback(err);
                });
        });
    },

    getAllCars: (filters, pagination, callback) => {
        const { brand, model, year } = filters;
        const { limit, offset } = pagination;
        let sql = 'SELECT * FROM cars WHERE 1=1';
        const params = [];

        if (brand) {
            sql += ' AND brand LIKE ?';
            params.push(`%${brand}%`);
        }
        if (model) {
            sql += ' AND model LIKE ?';
            params.push(`%${model}%`);
        }
        if (year) {
            sql += ' AND year >= ?';
            params.push(year);
        }

        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        db.query(sql, params, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    getCarById: (id, callback) => {
        const sql = 'SELECT * FROM cars WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) return callback(err);
            callback(null, result[0]);
        });
    },

    updateCar: (id, car, callback) => {
        const { brand, model, year } = car;
        const sql = 'UPDATE cars SET brand = ?, model = ?, year = ? WHERE id = ?';
        db.query(sql, [brand, model, year, id], (err) => {
            if (err) return callback(err);
            callback(null);
        });
    },

    deleteCar: (id, callback) => {
        const sql = 'DELETE FROM cars WHERE id = ?';
        db.query(sql, [id], (err) => {
            if (err) return callback(err);
            callback(null);
        });
    },

    checkCarExists: (car, callback) => {
        const { brand, model, year } = car;
        const sql = 'SELECT * FROM cars WHERE brand = ? AND model = ? AND year = ?';
        db.query(sql, [brand, model, year], (err, results) => {
            if (err) return callback(err);
            callback(null, results.length > 0);
        });
    }
};

module.exports = CarModel;