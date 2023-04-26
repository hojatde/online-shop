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
exports.getAdminCategoryDiscountEdit = exports.postAdminCategoryDiscountCreate = exports.getAdminCategoryDiscountCreate = exports.getAdminCategoryDiscounts = void 0;
const category_1 = __importDefault(require("../../models/category"));
const categoryDiscount_1 = __importDefault(require("../../models/categoryDiscount"));
const getAdminCategoryDiscounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryDiscounts = yield categoryDiscount_1.default.findAll({ where: { status: true }, include: { model: category_1.default } });
    res.render('admin/categoryDiscount/list', {
        'pageTitle': 'لیست تخفیفات دسته ای',
        categoryDiscounts
    });
});
exports.getAdminCategoryDiscounts = getAdminCategoryDiscounts;
const getAdminCategoryDiscountCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('admin/categoryDiscount/create', {
        'pageTitle': 'تخفیف جدید'
    });
});
exports.getAdminCategoryDiscountCreate = getAdminCategoryDiscountCreate;
const postAdminCategoryDiscountCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inputCategoryId = parseInt(req.body.categoryId);
    const inputPercentage = parseInt(req.body.percentage);
    const inputDays = parseInt(req.body.days);
    const category = yield category_1.default.findOne({ where: { id: inputCategoryId }, include: { model: categoryDiscount_1.default } });
    if (!category) {
        return res.redirect('/admin/categoryDiscounts');
    }
    if (category === null || category === void 0 ? void 0 : category.CategoryDiscounts) {
        for (let i = 0; i < category.CategoryDiscounts.length; i++) {
            category.CategoryDiscounts[i].status = false;
            yield category.CategoryDiscounts[i].save();
        }
    }
    categoryDiscount_1.default.create({
        CategoryId: category.id,
        percentage: inputPercentage,
        status: true,
        expirationDate: new Date(Date.now() + (inputDays * 24 * 60 * 60 * 1000))
    })
        .then(result => {
        return res.redirect('/admin/categoryDiscounts');
    })
        .catch(err => {
        console.log(err);
    });
});
exports.postAdminCategoryDiscountCreate = postAdminCategoryDiscountCreate;
const getAdminCategoryDiscountEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inputCategoryDiscountId = parseInt(req.params.categoryDiscountId);
    const categoryDiscount = yield categoryDiscount_1.default.findOne({ where: { id: inputCategoryDiscountId } });
    if (!categoryDiscount) {
        console.log('category discount not found');
        return res.redirect('/admin/categoryDiscounts');
    }
    categoryDiscount.status = false;
    categoryDiscount.save()
        .then(updatedCategoryDiscount => {
        return res.redirect('/admin/categoryDiscounts');
    })
        .catch(err => {
        console.log(err);
    });
});
exports.getAdminCategoryDiscountEdit = getAdminCategoryDiscountEdit;
