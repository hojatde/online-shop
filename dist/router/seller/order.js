"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const order_1 = require("../../controller/seller/order");
const sellerOrderRouter = (0, express_1.Router)();
sellerOrderRouter.get('/orders', order_1.getSellerOrders);
sellerOrderRouter.get('/order/:orderId', order_1.getSellerOrderIndex);
sellerOrderRouter.post('/order/:orderId/send', [
    (0, express_validator_1.body)('postalTrackingCode').exists().notEmpty().withMessage('کد رهگیری پستی را وارد کنید.')
        .isNumeric().withMessage('کد پستی فقط شامل اعداد است.')
], order_1.postSellerOrderSend);
exports.default = sellerOrderRouter;
