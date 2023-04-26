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
exports.getAdminProductDiscountEdit = exports.postAdminProductDiscountCreate = exports.getAdminProductDiscountCreate = exports.getAdminProductDiscountsList = void 0;
const product_1 = __importDefault(require("../../models/product"));
const productDiscount_1 = __importDefault(require("../../models/productDiscount"));
const getAdminProductDiscountsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productDiscounts = yield productDiscount_1.default.findAll({ where: { status: true }, order: [['createdAt', 'desc']], include: { model: product_1.default } });
    res.render('admin/productDiscount/list', {
        'pageTitle': 'تخفیفات محصول',
        productDiscounts
    });
});
exports.getAdminProductDiscountsList = getAdminProductDiscountsList;
const getAdminProductDiscountCreate = (req, res) => {
    res.render('admin/productDiscount/create', {
        'pageTitle': 'اضافه کردن تخفیف جدید'
    });
};
exports.getAdminProductDiscountCreate = getAdminProductDiscountCreate;
const postAdminProductDiscountCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const inputProductId = parseInt(req.body.productId);
    const inputPercentage = parseInt(req.body.percentage.toString());
    const inputDays = parseInt(req.body.days);
    const product = yield product_1.default.findOne({ where: { id: inputProductId }, include: { model: productDiscount_1.default } });
    if (!product) {
        return res.redirect('/admin/productDiscounts');
    }
    //ramove all before  product discounts
    if (product.ProductDiscounts) {
        for (let i = 0; i < ((_a = product.ProductDiscounts) === null || _a === void 0 ? void 0 : _a.length); i++) {
            product.ProductDiscounts[i].status = false;
            yield product.ProductDiscounts[i].save();
        }
    }
    productDiscount_1.default.create({
        ProductId: inputProductId,
        percentage: inputPercentage,
        status: true,
        expirationDate: new Date(Date.now() + (inputDays * 24 * 60 * 60 * 1000))
    }).then(reuslt => {
        return res.redirect('/admin/productDiscounts');
    }).catch(err => {
        console.log(err);
    });
});
exports.postAdminProductDiscountCreate = postAdminProductDiscountCreate;
const getAdminProductDiscountEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inputProductDiscountId = parseInt(req.params.productDiscountId);
    productDiscount_1.default.findOne({ where: { id: inputProductDiscountId } })
        .then(product => {
        if (product) {
            product.status = false;
            product.save()
                .then(result => {
                res.redirect('/admin/productDiscounts');
            })
                .catch(err => {
                console.log(err);
            });
        }
    }).catch(err => {
        console.log(err);
    });
});
exports.getAdminProductDiscountEdit = getAdminProductDiscountEdit;
