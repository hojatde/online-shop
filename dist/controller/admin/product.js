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
exports.getAdminTest = exports.postAdminEditProduct = exports.postAdminCreateProduct = exports.getAdminCreateProduct = exports.getAdminProductIndex = exports.getAdminProductsList = void 0;
const sequelize_1 = require("sequelize");
const category_1 = __importDefault(require("../../models/category"));
const product_1 = __importDefault(require("../../models/product"));
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
const countOfProductInPage = 20;
const getAdminProductsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productTitle = (_a = req.query.title) === null || _a === void 0 ? void 0 : _a.toString();
    let pageNumber;
    if (!req.query.page) {
        pageNumber = 1;
    }
    else {
        pageNumber = parseInt(req.query.page.toString());
    }
    var parsedQuery = url_1.default.parse(req.url, true).query;
    var nextPageUrl;
    var previousPageUrl;
    if (parsedQuery.page) {
        const nextPageNumber = parseInt(parsedQuery.page.toString()) + 1;
        const previousPageNumber = parseInt(parsedQuery.page.toString()) - 1;
        parsedQuery.page = nextPageNumber.toString();
        nextPageUrl = '/admin' + req.path + '?' + querystring_1.default.stringify(parsedQuery);
        parsedQuery.page = previousPageNumber.toString();
        previousPageUrl = '/admin' + req.path + '?' + querystring_1.default.stringify(parsedQuery);
    }
    else {
        nextPageUrl = '/admin' + req.path + '?' + querystring_1.default.stringify(parsedQuery) + '&page=2';
        previousPageUrl = '';
    }
    var result;
    var products = [];
    if (productTitle) {
        result = yield product_1.default.findAndCountAll({ offset: (pageNumber - 1) * countOfProductInPage,
            limit: countOfProductInPage, where: { title: { [sequelize_1.Op.like]: '%' + productTitle + '%' } }, order: [['updatedAt', 'desc']], include: { model: category_1.default, attributes: ['title'] } });
    }
    else {
        result = yield product_1.default.findAndCountAll({ offset: (pageNumber - 1) * countOfProductInPage,
            limit: countOfProductInPage, order: [['updatedAt', 'desc']], include: { model: category_1.default, attributes: ['title'] } });
    }
    if (products) {
        res.render('admin/product/list', {
            'pageTitle': 'محصولات',
            products: result.rows,
            hasNextPage: result.count > pageNumber * countOfProductInPage ? true : false,
            hasPreviousPage: pageNumber === 1 ? false : true,
            nextPageUrl,
            previousPageUrl
        });
    }
});
exports.getAdminProductsList = getAdminProductsList;
const getAdminProductIndex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inputProductId = req.params.productId;
    const product = yield product_1.default.findOne({ where: { id: inputProductId }, include: [{ model: category_1.default }] });
    const categories = yield category_1.default.findAll({ limit: 20 });
    if (!product) {
        return res.redirect('/');
    }
    res.render('admin/product/edit', {
        'pageTitle': 'محصول',
        product, categories
    });
});
exports.getAdminProductIndex = getAdminProductIndex;
const getAdminCreateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_1.default.findAll({ limit: 20 });
    res.render('admin/product/create', {
        'pageTitle': 'ایجاد محصول جدید', 'categories': categories
    });
});
exports.getAdminCreateProduct = getAdminCreateProduct;
const postAdminCreateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inputTitle = req.body.title;
    const inputRealPrice = parseInt(req.body.realPrice);
    const inputSellPrice = parseInt(req.body.sellPrice);
    const inputRealCount = parseInt(req.body.realCount);
    const inputSellCount = parseInt(req.body.sellCount);
    const inputCategoryId = parseInt(req.body.categoryId);
    const inputIsPublished = req.body.isPublished;
    const inputImageUrl = req.body.imageUrl;
    if (!inputTitle || !inputRealPrice || !inputSellPrice || !inputRealCount || !inputSellCount || !inputCategoryId) {
        console.log(inputIsPublished);
        return res.redirect('/admin/products');
    }
    const product = yield product_1.default.findOne({ where: { title: inputTitle } });
    if (product) {
        return res.redirect('/admin/product/create');
    }
    const files = req.files;
    product_1.default.create({
        title: inputTitle,
        realPrice: inputRealPrice,
        sellPrice: inputSellPrice,
        realCount: inputRealCount,
        sellCount: inputSellCount,
        CategoryId: inputCategoryId,
        isPublished: inputIsPublished ? true : false,
        description: '',
        imageUrl1: files['image1'] ? '\\' + files['image1'][0].path : undefined,
        imageUrl2: files['image2'] ? '\\' + files['image2'][0].path : undefined,
        imageUrl3: files['image3'] ? '\\' + files['image3'][0].path : undefined,
        imageUrl4: files['image4'] ? '\\' + files['image4'][0].path : undefined,
        CreatorId: 1
    })
        .then(product => {
        res.redirect('/admin/products');
    })
        .catch(err => {
        console.log(err);
    });
});
exports.postAdminCreateProduct = postAdminCreateProduct;
const postAdminEditProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.productId);
    const inputTitle = req.body.title;
    const inputRealPrice = parseInt(req.body.realPrice);
    const inputSellPrice = parseInt(req.body.sellPrice);
    const inputRealCount = parseInt(req.body.realCount);
    const inputSellCount = parseInt(req.body.sellCount);
    const inputCategoryId = parseInt(req.body.categoryId);
    const inputIsPublished = req.body.isPublished;
    const inputImageUrl = req.body.imageUrl;
    if (!inputTitle || !inputRealPrice || !inputSellPrice || !inputRealCount || !inputSellCount || !inputCategoryId) {
        console.log(inputIsPublished);
        return res.redirect('/admin/products');
    }
    const product = yield product_1.default.findOne({ where: { id: productId } });
    if (!product) {
        return res.redirect('/admin/product/create');
    }
    const files = req.files;
    product.title = inputTitle;
    product.realPrice = inputRealPrice;
    product.sellPrice = inputSellPrice;
    product.realCount = inputRealCount;
    product.sellCount = inputSellCount;
    product.CategoryId = inputCategoryId;
    product.isPublished = inputIsPublished ? true : false;
    product.description = '';
    console.log(req.files);
    if (files['image1']) {
        product.imageUrl1 = '\\' + files['image1'][0].path;
    }
    if (files['image2']) {
        product.imageUrl2 = '\\' + files['image2'][0].path;
    }
    if (files['image3']) {
        product.imageUrl3 = '\\' + files['image3'][0].path;
    }
    if (files['image4']) {
        product.imageUrl4 = '\\' + files['image4'][0].path;
    }
    product.save()
        .then(updatedProduct => {
        return res.redirect('/admin/products');
    })
        .catch(err => {
        console.log(err);
    });
});
exports.postAdminEditProduct = postAdminEditProduct;
const getAdminTest = (req, res) => {
    res.render('admin/product/test');
};
exports.getAdminTest = getAdminTest;
