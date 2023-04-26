"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
const product_1 = __importDefault(require("./product"));
const order_1 = __importDefault(require("./order"));
class OrderItem extends sequelize_1.Model {
}
OrderItem.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }, quantity: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false
    }, realPrice: { type: sequelize_1.DataTypes.DECIMAL, allowNull: false },
    sellPrice: { type: sequelize_1.DataTypes.DECIMAL, allowNull: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: database_1.default.fn('now'), },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: database_1.default.fn('now') }
}, { sequelize: database_1.default });
OrderItem.belongsTo(order_1.default, { foreignKey: { allowNull: false } });
order_1.default.hasMany(OrderItem, { foreignKey: { allowNull: false } });
OrderItem.belongsTo(product_1.default, { foreignKey: { allowNull: false } });
product_1.default.hasMany(OrderItem, { foreignKey: { allowNull: false } });
exports.default = OrderItem;
