"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_1 = require("../../controller/users/cart");
const user_1 = require("../../middleware/auth/user");
const express_validator_1 = require("express-validator");
const cartRouter = (0, express_1.Router)();
cartRouter.get('/cart', user_1.isLoginMiddleware, cart_1.getCart);
cartRouter.get('/cart/addToCart/:productId', user_1.isLoginMiddleware, [
    (0, express_validator_1.param)('productId').exists().isNumeric()
], cart_1.getAddToCart);
cartRouter.get('/cart/removeFromCart/:productId', user_1.isLoginMiddleware, [
    (0, express_validator_1.param)('productId').exists().isNumeric()
], cart_1.getRemoveFromCart);
exports.default = cartRouter;
