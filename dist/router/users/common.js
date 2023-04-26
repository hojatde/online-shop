"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const common_1 = require("../../controller/users/common");
const user_1 = require("../../middleware/auth/user");
const persianCharRegex = /^[\u0600-\u06ff\s]+$/;
const phoneNumberRegex = /^[0-9]{11}/;
const commonRouter = (0, express_1.Router)();
commonRouter.get('/', common_1.getHome);
commonRouter.get('/register', common_1.getRegister);
commonRouter.post('/register', [
    (0, express_validator_1.body)('username').exists().notEmpty().withMessage('نام کاربری را وارد کنید.').isAlphanumeric().withMessage('نام کاربری نا معتبر است.'),
    (0, express_validator_1.body)('firstName').matches(persianCharRegex).withMessage('نام تنها شامل حروف فارسی است.')
        .isLength({ min: 3, max: 25 }).withMessage('نام باید حداقل شامل 3 حرف و حداکثر شامل 25 حرف باشد.').bail(),
    (0, express_validator_1.body)('lastName').matches(persianCharRegex).withMessage('نام خانوادگی تنها شامل حروف فارسی است.')
        .isLength({ min: 3, max: 25 }).withMessage('نام خانوادگی باید حداقل شامل 3 حرف و حداکثر شامل 25 حرف باشد.'),
    (0, express_validator_1.body)('phoneNumber').matches(phoneNumberRegex).withMessage('شماره تلفن باید شامل 11 رقم باشد.'),
    (0, express_validator_1.body)('email').optional({ checkFalsy: true }).isEmail().withMessage('ایمیل نا معتبر است.'),
    (0, express_validator_1.body)('birthDate').optional({ checkFalsy: true }).isDate().withMessage('زمان در قالب درستی وارد نشده است.'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('رمز عبور را وارد کنید')
        .isAlphanumeric().withMessage('رمز عبور شامل اعداد و حروف زبان لاتین است.')
        .isLength({ min: 8, max: 64 }).withMessage('رمز عبور حداقل شامل 8 کارکتر و حداکثر شامل 64 کارکتر است.'),
    (0, express_validator_1.body)('repeatPassword').notEmpty().withMessage('تکرار رمز عبور را وارد کنید.')
        .custom((value, { req }) => {
        if (value === req.body.password) {
            return true;
        }
        else {
            throw new Error('رمز عبور با تکرار آن یکسان نیست.');
        }
    })
], common_1.postRegister);
commonRouter.get('/login', common_1.getLogin);
commonRouter.post('/login', [
    (0, express_validator_1.body)('username').exists().notEmpty().withMessage('نام کاربری را وارد کنید')
        .isAlphanumeric().withMessage('نام کاربری تنها شامل حروف و اعداد است.'),
    (0, express_validator_1.body)('password').exists().notEmpty().withMessage('رمز عبور را وارد کنید')
        .isAlphanumeric().withMessage('رمز عبور تنها شامل اعداد و حروف است.')
], common_1.postLogin);
commonRouter.get('/logout', user_1.isLoginMiddleware, common_1.getLogout);
commonRouter.get('/changePassword', user_1.isLoginMiddleware, common_1.getChangePassword);
commonRouter.post('/changePassword', user_1.isLoginMiddleware, [
    (0, express_validator_1.body)('password').exists().notEmpty().withMessage('لطفا رمز عبور را وارد کنید')
        .isAlphanumeric().withMessage('رمز عبور تنها میتواند شامل کارکتر های لاتین و اعداد باشد.')
        .isLength({ min: 8, max: 64 }).withMessage("طول رمز عبور باید حداقل 8 و حداکثر 64 کارکتر باشد."),
    (0, express_validator_1.body)('repeatPassword').custom((value, { req }) => {
        if (value === req.body.password) {
            return true;
        }
        else {
            throw new Error('رمز عبور با تکرار آن تطابق ندارد');
        }
    })
], common_1.postChangePassword);
commonRouter.get('/forgetPassword', common_1.getForgetPassword);
commonRouter.post('/forgetPassword', [
    (0, express_validator_1.body)('email').exists().notEmpty().withMessage('لطفا ایمیل خود را وارد کنید.')
        .isEmail().withMessage('لطفا ایمیل معتبر وارد کنید.')
], common_1.postForgetPassword);
commonRouter.get('/forgetPassword/:randomHash', [
    (0, express_validator_1.param)('randomHash').exists().notEmpty().isAlphanumeric().withMessage('استفاده از کارکتر های غیر مجاز')
], common_1.getForgetPasswordChange);
commonRouter.post('/forgetPassword/:randomHash', [
    (0, express_validator_1.param)('randomHash').exists().notEmpty().isAlphanumeric().withMessage('استفاده از کارکتر های غیر مجاز'),
    (0, express_validator_1.body)('password').exists().notEmpty().withMessage('رمز عبور را  وارد کنید')
        .isAlphanumeric().withMessage('رمز عبور تنها شامل اعداد و حروف زبان لاتین است.')
        .isLength({ min: 8, max: 64 }).withMessage('رمز عبور باید حداقل 8 کارکتر و حداکثر 64 کارکتر باشد'),
    (0, express_validator_1.body)('repeatPassword').exists().notEmpty().custom((value, { req }) => {
        if (value === req.body.password) {
            return true;
        }
        else {
            throw new Error('رمز عبور با تکرار آن تطابق ندارد');
        }
    })
], common_1.postForgetPasswordChange);
commonRouter.get('/notFound', common_1.getNotFound);
commonRouter.get('/notAllowed', common_1.getNotAllowd);
commonRouter.get('/test', common_1.getTest);
exports.default = commonRouter;
