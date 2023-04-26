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
exports.getOrderIndex = exports.getOrdersList = exports.getCreateOrder = void 0;
const express_validator_1 = require("express-validator");
const cart_1 = __importDefault(require("../../models/cart"));
const cartItems_1 = __importDefault(require("../../models/cartItems"));
const category_1 = __importDefault(require("../../models/category"));
const categoryDiscount_1 = __importDefault(require("../../models/categoryDiscount"));
const order_1 = __importDefault(require("../../models/order"));
const orderItem_1 = __importDefault(require("../../models/orderItem"));
const product_1 = __importDefault(require("../../models/product"));
const productDiscount_1 = __importDefault(require("../../models/productDiscount"));
const user_1 = __importDefault(require("../../models/user"));
const getCreateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const user = yield user_1.default.findOne({
        where: { id: (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id },
        attributes: ['id', 'username'],
        include: {
            model: cart_1.default,
            attributes: ['id'],
            include: [{
                    model: cartItems_1.default,
                    attributes: ['id', 'ProductId', 'quantity'],
                    include: [{
                            model: product_1.default,
                            attributes: ['id', 'sellPrice', 'realPrice'],
                            include: [{
                                    model: productDiscount_1.default,
                                    attributes: ['percentage'], order: [['updatedAt', 'desc']], limit: 1,
                                }, {
                                    model: category_1.default,
                                    attributes: ['id'],
                                    include: [{
                                            model: categoryDiscount_1.default, order: [['updatedAt', 'desc']], limit: 1,
                                            attributes: ['percentage']
                                        }]
                                }]
                        }]
                }]
        }
    });
    if (((_b = user === null || user === void 0 ? void 0 : user.Cart) === null || _b === void 0 ? void 0 : _b.CartItems) && user.Cart.CartItems.length > -1) {
        const order = yield user.createOrder({ address: user.username, totalPrice: 0, status: false, UserId: user.id });
        let orderTotalPrice = 0;
        for (let i = 0; i < user.Cart.CartItems.length; i++) {
            const cartItem = user.Cart.CartItems[i];
            //calcute sell price by prodiscount and categoryDiscount
            let sellPrice = 0;
            if (cartItem.Product.ProductDiscounts && cartItem.Product.ProductDiscounts.length > 0) {
                sellPrice = (100 - cartItem.Product.ProductDiscounts[0].percentage) * cartItem.Product.sellPrice / 100;
            }
            else if (cartItem.Product.Category.CategoryDiscounts && cartItem.Product.Category.CategoryDiscounts.length > 0) {
                sellPrice = (100 - cartItem.Product.Category.CategoryDiscounts[0].percentage) * cartItem.Product.sellPrice / 100;
            }
            else {
                sellPrice = cartItem.Product.sellPrice;
            }
            yield order.createOrderItem({
                quantity: cartItem.quantity,
                realPrice: cartItem.Product.realPrice,
                sellPrice: sellPrice,
                ProductId: cartItem.ProductId
            });
            orderTotalPrice += cartItem.quantity * sellPrice;
        }
        order.totalPrice = orderTotalPrice;
        yield order.save();
        yield ((_c = user.Cart) === null || _c === void 0 ? void 0 : _c.destroy());
        res.redirect('/orders');
    }
});
exports.getCreateOrder = getCreateOrder;
const getOrdersList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const user = yield user_1.default.findOne({
        where: { id: (_d = req.currentUser) === null || _d === void 0 ? void 0 : _d.id }, attributes: ['id'], include: { model: order_1.default }
    });
    res.render('users/order/list', {
        'pageTitle': 'سفارشات',
        orders: user === null || user === void 0 ? void 0 : user.Orders
    });
});
exports.getOrdersList = getOrdersList;
const getOrderIndex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.status(401).redirect('/notAllowed');
    }
    const inputOrderId = req.params.orderId;
    const user = yield user_1.default.findOne({ where: { id: (_e = req.currentUser) === null || _e === void 0 ? void 0 : _e.id },
        include: { model: order_1.default, where: { id: inputOrderId },
            include: [{ model: orderItem_1.default,
                    include: [{ model: product_1.default, attributes: ['title'] }] }] } });
    if ((user === null || user === void 0 ? void 0 : user.Orders) && user.Orders[0]) {
        res.render('users/order/index', {
            'pageTitle': 'سفارش',
            'order': user.Orders[0]
        });
    }
    else {
        return res.status(401).redirect('/notAllowed');
    }
});
exports.getOrderIndex = getOrderIndex;
