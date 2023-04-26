"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
const role_1 = __importDefault(require("./role"));
const verifyEmail_1 = __importDefault(require("./verifyEmail"));
const forgetPassword_1 = __importDefault(require("./forgetPassword"));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    }, username: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    }, password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    }, firstName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    }, lastName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    }, birthDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }, isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
    }, phoneNumber: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false,
    }, email: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    createdAt: { type: sequelize_1.DataTypes.DATE, defaultValue: database_1.default.fn("NOW"), allowNull: false },
    updatedAt: { type: sequelize_1.DataTypes.DATE, defaultValue: database_1.default.fn("NOW"), allowNull: false }
}, { sequelize: database_1.default });
role_1.default.hasMany(User, { foreignKey: { allowNull: false }, onDelete: 'cascade' });
User.belongsTo(role_1.default, { foreignKey: { allowNull: false }, onDelete: 'cascade' });
User.hasOne(verifyEmail_1.default, { foreignKey: { allowNull: false } });
verifyEmail_1.default.belongsTo(User, { foreignKey: { allowNull: false } });
User.hasOne(forgetPassword_1.default, { foreignKey: { allowNull: false } });
forgetPassword_1.default.belongsTo(User, { foreignKey: { allowNull: false } });
exports.default = User;
