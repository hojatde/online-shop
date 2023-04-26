"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("./user"));
class Order extends sequelize_1.Model {
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }, status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: 0
    }, address: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    }, totalPrice: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false
    }, postalTrackingCode: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    }, shippingTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: database_1.default.fn('now'), },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: database_1.default.fn('now') }
}, { sequelize: database_1.default });
Order.belongsTo(user_1.default, { foreignKey: { allowNull: false } });
user_1.default.hasMany(Order, { foreignKey: { allowNull: false } });
user_1.default.hasMany(Order, { as: 'Sender', foreignKey: { allowNull: true } });
Order.belongsTo(user_1.default, { as: 'Sender', foreignKey: { allowNull: true } });
exports.default = Order;
