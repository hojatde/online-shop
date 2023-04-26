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
exports.getProductIndex = exports.getAllProducts = void 0;
const express_validator_1 = require("express-validator");
const qs_1 = __importDefault(require("qs"));
const sequelize_1 = require("sequelize");
const url_1 = __importDefault(require("url"));
const category_1 = __importDefault(require("../../models/category"));
const categoryDiscount_1 = __importDefault(require("../../models/categoryDiscount"));
const product_1 = __importDefault(require("../../models/product"));
const productDiscount_1 = __importDefault(require("../../models/productDiscount"));
const countOfProductInPage = 20;
var sortByList;
(function (sortByList) {
    sortByList["date"] = "date";
    sortByList["price"] = "price";
})(sortByList || (sortByList = {}));
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/notAllowed');
    }
    const query = req.query;
    let pageNumber;
    const inputTitle = query.title;
    const inputSortBy = query.sortBy;
    if (!query.page) {
        pageNumber = 1;
    }
    else {
        pageNumber = parseInt(query.page.toString());
    }
    var parsedQuery = url_1.default.parse(req.url, true).query;
    var nextPageUrl;
    var previousPageUrl;
    if (parsedQuery.page) {
        const nextPageNumber = parseInt(parsedQuery.page.toString()) + 1;
        const previousPageNumber = parseInt(parsedQuery.page.toString()) - 1;
        parsedQuery.page = nextPageNumber.toString();
        nextPageUrl = req.path + '?' + qs_1.default.stringify(parsedQuery);
        parsedQuery.page = previousPageNumber.toString();
        previousPageUrl = req.path + '?' + qs_1.default.stringify(parsedQuery);
    }
    else {
        nextPageUrl = req.path + '?' + qs_1.default.stringify(parsedQuery) + '&page=2';
        previousPageUrl = '';
    }
    let result = { rows: [], count: 0 };
    let products = [];
    // search all products
    if (!inputTitle && !inputSortBy) {
        result = yield product_1.default.findAndCountAll({
            offset: (pageNumber - 1) * countOfProductInPage,
            limit: countOfProductInPage, order: [['updatedAt', 'desc']],
            include: [{ model: productDiscount_1.default, limit: 1, where: { status: true }, order: [['updatedAt', 'desc']] }, {
                    model: category_1.default,
                    include: [{ model: categoryDiscount_1.default, order: [['updatedAt', 'desc']], limit: 1, where: { status: true } }]
                }]
        });
        //search by title
    }
    else if (inputTitle) {
        result = yield product_1.default.findAndCountAll({
            where: { title: { [sequelize_1.Op.like]: '%' + inputTitle + '%' } },
            offset: (pageNumber - 1) * countOfProductInPage,
            limit: countOfProductInPage, order: [['updatedAt', 'desc']],
            include: [{ model: productDiscount_1.default, limit: 1, where: { status: true }, order: [['updatedAt', 'desc']] }, {
                    model: category_1.default,
                    include: [{ model: categoryDiscount_1.default, order: [['updatedAt', 'desc']], limit: 1, where: { status: true } }]
                }]
        });
        //sort products by ...
    }
    else if (inputSortBy) {
        //sort by date
        if (inputSortBy === sortByList.date) {
            result = yield product_1.default.findAndCountAll({
                offset: (pageNumber - 1) * countOfProductInPage,
                limit: countOfProductInPage, order: [['createdAt', 'desc']],
                include: [{ model: productDiscount_1.default, limit: 1, where: { status: true }, order: [['updatedAt', 'desc']] }, {
                        model: category_1.default,
                        include: [{ model: categoryDiscount_1.default, order: [['updatedAt', 'desc']], limit: 1, where: { status: true } }]
                    }]
            });
            //sort by price
        }
        else if (inputSortBy === sortByList.price) {
            result = yield product_1.default.findAndCountAll({
                offset: (pageNumber - 1) * countOfProductInPage,
                limit: countOfProductInPage, order: [['sellPrice', 'desc']],
                include: [{ model: productDiscount_1.default, limit: 1, where: { status: true }, order: [['updatedAt', 'desc']] }, {
                        model: category_1.default,
                        include: [{ model: categoryDiscount_1.default, order: [['updatedAt', 'desc']], limit: 1, where: { status: true } }]
                    }]
            });
        }
    }
    //fetch products
    products = result.rows;
    if (products) {
        res.render('users/product/list', {
            'pageTitle': 'محصولات',
            products: products,
            hasNextPage: result.count > pageNumber * countOfProductInPage ? true : false,
            hasPreviousPage: pageNumber === 1 ? false : true,
            nextPageUrl,
            previousPageUrl
        });
    }
});
exports.getAllProducts = getAllProducts;
const getProductIndex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/notAllowed');
    }
    const inputProductId = req.params.productId;
    if (!inputProductId) {
        return res.redirect('/');
    }
    const product = yield product_1.default.findOne({
        where: { id: inputProductId, },
        include: [{ model: productDiscount_1.default, limit: 1, where: { status: true }, order: [['updatedAt', 'desc']] },
            { model: category_1.default, include: [{ model: categoryDiscount_1.default, order: [['updatedAt', 'desc']], limit: 1, where: { status: true } }] }]
    });
    //if product not exist
    if (!product) {
        return res.redirect('/');
    }
    else {
        const category = yield category_1.default.findOne({
            where: { id: product.CategoryId },
            include: {
                limit: 5, model: product_1.default,
                where: { [sequelize_1.Op.not]: [{ id: [product.id] }] }
            }
        });
        res.render('users/product/index', {
            'pageTitle': product.title,
            product,
            'relatedProduct': category === null || category === void 0 ? void 0 : category.Products
        });
    }
});
exports.getProductIndex = getProductIndex;
