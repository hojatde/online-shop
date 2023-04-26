"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//user Router
const common_1 = __importDefault(require("./common"));
const product_1 = __importDefault(require("./product"));
const cart_1 = __importDefault(require("./cart"));
const order_1 = __importDefault(require("./order"));
const userRouter = (0, express_1.Router)();
userRouter.use(common_1.default);
userRouter.use(product_1.default);
userRouter.use(cart_1.default);
userRouter.use(order_1.default);
exports.default = userRouter;
