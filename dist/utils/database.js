"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const DB_NAME = process.env.DB_NAME || '';
const DB_USERNAME = process.env.DB_USERNAME || '';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || '';
const DB_PORT = process.env.DB_PORT || '';
const sequelize = new sequelize_1.Sequelize({
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: 'mysql',
    port: parseInt(DB_PORT),
    host: DB_HOST,
    logging: false,
    define: {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    }
});
exports.default = sequelize;
