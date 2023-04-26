"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
const category_1 = __importDefault(require("./category"));
class CategoryDiscount extends sequelize_1.Model {
}
CategoryDiscount.init({
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
CategoryDiscount.belongsTo(category_1.default, { foreignKey: { allowNull: false } });
category_1.default.hasMany(CategoryDiscount, { foreignKey: { allowNull: false } });
exports.default = CategoryDiscount;
