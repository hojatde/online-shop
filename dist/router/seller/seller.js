"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const is_seller_1 = require("../../middleware/auth/is-seller");
const order_1 = __importDefault(require("./order"));
const sellerRouter = (0, express_1.Router)();
sellerRouter.use('/seller', is_seller_1.isSellerMiddleware, order_1.default);
exports.default = sellerRouter;
