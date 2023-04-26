"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const order_1 = require("../../controller/admin/order");
const adminOrderRouter = (0, express_1.Router)();
adminOrderRouter.get('/orders', order_1.getAdminOrders);
adminOrderRouter.get('/order/:orderId', order_1.getAdminOrderIndex);
adminOrderRouter.post('/order/:orderId/send', [
    (0, express_validator_1.body)('postalTrackingCode').exists().notEmpty().withMessage('کد رهگیری پستی را وارد کنید.')
        .isNumeric().withMessage('کد پستی فقط شامل اعداد است.')
], order_1.postAdminOrderSend);
exports.default = adminOrderRouter;
