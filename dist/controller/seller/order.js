"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSellerOrderSend = exports.getSellerOrderIndex = exports.getSellerOrders = void 0;
const express_validator_1 = require("express-validator");
const order_1 = __importDefault(require("../../models/order"));
const orderItem_1 = __importDefault(require("../../models/orderItem"));
const product_1 = __importDefault(require("../../models/product"));
const user_1 = __importDefault(require("../../models/user"));
const getSellerOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_1.default.findAll({ where: { status: false }, include: { model: user_1.default } });
    res.render('admin/order/list', {
        'pageTitle': 'سفارشات',
        orders
    });
});
exports.getSellerOrders = getSellerOrders;
const getSellerOrderIndex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inputOrderId = parseInt(req.params.orderId);
    const order = yield order_1.default.findOne({ where: { id: inputOrderId }, include: [{ model: orderItem_1.default, include: [{ model: product_1.default }] }, { model: user_1.default }] });
    if (!order) {
        return res.redirect('admin/orders');
    }
    res.render('admin/order/index', {
        'pageTitle': 'سفارش',
        order,
        'error': req.flash('error')[0]
    });
});
exports.getSellerOrderIndex = getSellerOrderIndex;
const postSellerOrderSend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('back');
    }
    const body = req.body;
    const inputOrderId = parseInt(req.params.orderId);
    const inputPostalTrackingCode = body.postalTrackingCode;
    const order = yield order_1.default.findOne({ where: { id: inputOrderId } });
    if (!order || !req.currentUser) {
        return res.redirect('/seller/orders');
    }
    order.status = true;
    order.postalTrackingCode = inputPostalTrackingCode;
    order.SenderId = req.currentUser.id || 0;
    order.shippingTime = new Date();
    order.save()
        .then(updatedOrder => {
        console.log('updated');
        return res.redirect('/seller/orders');
    })
        .catch(err => {
        console.log(err);
    });
});
exports.postSellerOrderSend = postSellerOrderSend;
