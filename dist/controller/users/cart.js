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
exports.getRemoveFromCart = exports.getAddToCart = exports.getCart = void 0;
const express_validator_1 = require("express-validator");
const cart_1 = __importDefault(require("../../models/cart"));
const cartItems_1 = __importDefault(require("../../models/cartItems"));
const category_1 = __importDefault(require("../../models/category"));
const categoryDiscount_1 = __importDefault(require("../../models/categoryDiscount"));
const product_1 = __importDefault(require("../../models/product"));
const productDiscount_1 = __importDefault(require("../../models/productDiscount"));
const user_1 = __importDefault(require("../../models/user"));
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_1.default.findOne({
        where: { id: (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id }, attributes: ['id'],
        include: {
            model: cart_1.default,
            attributes: ['id'],
            include: [{
                    model: cartItems_1.default, attributes: ['id', 'ProductId', 'quantity'],
                    include: [{
                            model: product_1.default,
                            attributes: ['id', 'sellPrice', 'title'],
                            include: [{ model: productDiscount_1.default, order: [['updatedAt', 'desc']], limit: 1, where: { status: true }, attributes: ['id', 'percentage'] },
                                {
                                    model: category_1.default, attributes: ['id'], include: [
                                        { model: categoryDiscount_1.default, order: [['updatedAt', 'desc']], limit: 1, where: { status: true }, attributes: ['id', 'percentage'] }
                                    ]
                                }
                            ]
                        }]
                }
            ]
        }
    });
    if (((_b = user === null || user === void 0 ? void 0 : user.Cart) === null || _b === void 0 ? void 0 : _b.CartItems) && user.Cart.CartItems.length > -1) {
        res.render('users/cart/index', {
            'pageTitle': 'سبد خرید',
            items: user.Cart.CartItems
        });
    }
    else {
        res.redirect('/');
    }
});
exports.getCart = getCart;
const getAddToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.status(402).redirect('/notAllowed');
    }
    const inputProductId = parseInt(req.params.productId.toString());
    if (!inputProductId) {
        return res.redirect("/");
    }
    const product = yield product_1.default.findOne({ where: { id: inputProductId } });
    if (!product || product.sellCount < 1) {
        return res.redirect('/notfound');
    }
    else {
        const user = yield user_1.default.findOne({ where: { id: (_c = req.currentUser) === null || _c === void 0 ? void 0 : _c.id }, include: { model: cart_1.default, include: [{ model: cartItems_1.default }] } });
        if (!user) {
            return res.redirect('/');
            console.log('user not found');
        }
        //user don't have Cart
        if (!user.Cart) {
            const cart = yield user.createCart();
            user.Cart = cart;
        }
        //find product index in cartItems
        let productIndex = -1;
        if (user.Cart && user.Cart.CartItems) {
            productIndex = (_d = user.Cart.CartItems) === null || _d === void 0 ? void 0 : _d.findIndex(cartItem => {
                return cartItem.ProductId === product.id;
            });
        }
        //if product exist in Cart
        if (productIndex > -1 && user.Cart.CartItems) {
            user.Cart.CartItems[productIndex].quantity++;
            yield user.Cart.CartItems[productIndex].save();
        }
        else {
            const storeCartItem = yield user.Cart.createCartItem({ quantity: 1, ProductId: product.id });
        }
        product.sellCount--;
        product.realCount--;
        product.save();
        res.redirect('/cart');
    }
});
exports.getAddToCart = getAddToCart;
const getRemoveFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.status(402).redirect('/notAllowed');
    }
    const inputProductId = parseInt(req.params.productId.toString());
    if (!inputProductId) {
        return res.redirect("/");
    }
    //check product exist on system
    const product = yield product_1.default.findOne({ where: { id: inputProductId } });
    if (!product) {
        return res.redirect('/');
    }
    else {
        const user = yield user_1.default.findOne({ where: { id: (_e = req.currentUser) === null || _e === void 0 ? void 0 : _e.id }, include: { model: cart_1.default, include: [{ model: cartItems_1.default, include: [{ model: product_1.default }] }] } });
        //if user cart is empty
        if (!((_f = user === null || user === void 0 ? void 0 : user.Cart) === null || _f === void 0 ? void 0 : _f.CartItems) || user.Cart.CartItems.length < 0) {
            return res.redirect('/cart');
        }
        else {
            const cartItemIndex = user.Cart.CartItems.findIndex(cartitem => {
                return cartitem.ProductId === inputProductId;
            });
            if (cartItemIndex > -1) {
                console.log(product.sellCount);
                console.log(user.Cart.CartItems[cartItemIndex].quantity);
                product.sellCount += user.Cart.CartItems[cartItemIndex].quantity;
                product.realCount += user.Cart.CartItems[cartItemIndex].quantity;
                product.save();
                yield user.Cart.CartItems[cartItemIndex].destroy();
            }
            res.redirect('/cart');
        }
    }
});
exports.getRemoveFromCart = getRemoveFromCart;
