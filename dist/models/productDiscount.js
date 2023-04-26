"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
const product_1 = __importDefault(require("./product"));
class ProductDiscount extends sequelize_1.Model {
}
ProductDiscount.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }, percentage: {
        type: sequelize_1.DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
    }, expirationDate: {
        type: sequelize_1.DataTypes.DATE, allowNull: false
    }, status: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: database_1.default.fn('now'), },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: database_1.default.fn('now') }
}, { sequelize: database_1.default });
ProductDiscount.belongsTo(product_1.default, { foreignKey: { allowNull: false } });
product_1.default.hasMany(ProductDiscount, { foreignKey: { allowNull: false } });
exports.default = ProductDiscount;
