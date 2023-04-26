"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const order_1 = require("../../controller/users/order");
const user_1 = require("../../middleware/auth/user");
const orderRouter = (0, express_1.Router)();
orderRouter.get('/order/createOrder', user_1.isLoginMiddleware, order_1.getCreateOrder);
orderRouter.get('/orders', user_1.isLoginMiddleware, order_1.getOrdersList);
orderRouter.get('/order/:orderId', user_1.isLoginMiddleware, [
    (0, express_validator_1.param)('orderId').exists().isNumeric()
], order_1.getOrderIndex);
exports.default = orderRouter;
