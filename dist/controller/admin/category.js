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
exports.postAdminCategoryEdit = exports.getAdminCategoryEdit = exports.postAdminCategoryCreate = exports.getAdminCategoryCreate = exports.getAdminCategoreisList = void 0;
const category_1 = __importDefault(require("../../models/category"));
const getAdminCategoreisList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_1.default.findAll();
    if (!categories) {
        return res.redirect('/admin/');
    }
    res.render('admin/category/list', {
        'pageTitle': 'دسته بندی ها',
        categories
    });
});
exports.getAdminCategoreisList = getAdminCategoreisList;
const getAdminCategoryCreate = (req, res) => {
    res.render('admin/category/create', {
        'pageTitle': 'دسته بندی جدید'
    });
};
exports.getAdminCategoryCreate = getAdminCategoryCreate;
const postAdminCategoryCreate = (req, res) => {
    const inputCategoryTitle = req.body.title;
    if (!inputCategoryTitle) {
        return res.redirect('/admin/categories');
    }
    category_1.default.findOne({ where: { title: inputCategoryTitle } })
        .then(categoryFound => {
        if (categoryFound) {
            return res.redirect('/admin/categories');
        }
        else {
            category_1.default.create({
                title: inputCategoryTitle,
                CreatorId: 1
            }).then(category => {
                res.redirect('/admin/categories');
            }).catch(err => {
                console.log(err);
            });
        }
    });
};
exports.postAdminCategoryCreate = postAdminCategoryCreate;
const getAdminCategoryEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = parseInt(req.params.categoryId.toString());
    const category = yield category_1.default.findOne({ where: { id: categoryId } });
    if (!category) {
        return res.redirect('/admin/categories');
    }
    res.render('admin/category/edit', {
        'pageTitle': category.title,
        category
    });
});
exports.getAdminCategoryEdit = getAdminCategoryEdit;
const postAdminCategoryEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = parseInt(req.params.categoryId.toString());
    const inputCategoryTitle = req.body.title.toString();
    const category = yield category_1.default.findOne({ where: { id: categoryId } });
    if (!category || !inputCategoryTitle) {
        return res.redirect('/admin/categories');
    }
    category.title = inputCategoryTitle;
    category.save()
        .then(updatedCategory => {
        res.redirect('/admin/categories');
    })
        .catch(err => {
        console.log(err);
    });
});
exports.postAdminCategoryEdit = postAdminCategoryEdit;
