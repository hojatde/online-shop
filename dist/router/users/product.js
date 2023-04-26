"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const product_1 = require("../../controller/users/product");
const productTitleRegex = /^[\u0600-\u06ff\sa-zA-Z]+$/;
const productRouter = (0, express_1.Router)();
productRouter.get('/products', [
    (0, express_validator_1.query)('title').optional({ checkFalsy: true }).matches(productTitleRegex).withMessage('عنوان در قالب صحیحی وارد نشده است.'),
    (0, express_validator_1.query)('sortBy').optional({ checkFalsy: true }).isAlpha().withMessage('استفاده از کارکتر های غیر مجاز'),
    (0, express_validator_1.query)('page').optional({ checkFalsy: true }).isNumeric().withMessage('استفاده از کارکتر های غیر مجاز')
], product_1.getAllProducts);
productRouter.get('/product/:productId', [
    (0, express_validator_1.param)('productId').exists().notEmpty().isNumeric().withMessage('استفاده از کارکتر های غیر مجاز')
], product_1.getProductIndex);
exports.default = productRouter;
