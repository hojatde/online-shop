"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../utils/database"));
const sequelize_1 = require("sequelize");
const role_1 = __importDefault(require("./role"));
const policy_1 = __importDefault(require("./policy"));
class RolePolicy extends sequelize_1.Model {
}
RolePolicy.init({
    id: {
        type: sequelize_1.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: database_1.default.fn('now'), },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: database_1.default.fn('now') }
}, { sequelize: database_1.default });
role_1.default.hasMany(RolePolicy, { foreignKey: { allowNull: false } });
RolePolicy.belongsTo(role_1.default, { foreignKey: { allowNull: false } });
policy_1.default.hasMany(RolePolicy, { foreignKey: { allowNull: false } });
RolePolicy.belongsTo(policy_1.default, { foreignKey: { allowNull: false } });
exports.default = RolePolicy;
