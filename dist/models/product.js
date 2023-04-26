"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
const category_1 = __importDefault(require("./category"));
const user_1 = __importDefault(require("./user"));
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }, title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    }, description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }, imageUrl1: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    }, imageUrl2: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    }, imageUrl3: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    }, imageUrl4: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    }, isPublished: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }, realCount: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false
    }, sellCount: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false
    }, realPrice: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false
    }, sellPrice: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false
    },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: database_1.default.fn('now'), },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: database_1.default.fn('now') }
}, { sequelize: database_1.default });
user_1.default.hasMany(Product, { foreignKey: { name: 'CreatorId', allowNull: false }, onDelete: 'cascade' });
Product.belongsTo(user_1.default, { foreignKey: { name: 'CreatorId', allowNull: false }, onDelete: 'cascade' });
Product.belongsTo(category_1.default, { foreignKey: { allowNull: false }, onDelete: 'cascade' });
category_1.default.hasMany(Product, { foreignKey: { allowNull: false }, onDelete: 'cascade' });
exports.default = Product;
