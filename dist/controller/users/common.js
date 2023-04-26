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
exports.getTest = exports.getNotAllowd = exports.getNotFound = exports.postForgetPasswordChange = exports.getForgetPasswordChange = exports.postForgetPassword = exports.getForgetPassword = exports.postChangePassword = exports.getChangePassword = exports.getLogout = exports.postLogin = exports.getLogin = exports.postRegister = exports.getRegister = exports.getHome = void 0;
const express_validator_1 = require("express-validator");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const secretKey = process.env.HashSecretKey || '';
const user_1 = __importDefault(require("../../models/user"));
const forgetPassword_1 = __importDefault(require("../../models/forgetPassword"));
//transporte for Email
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'shop.khosravi01@gmail.com',
        pass: 'svnyuhjnhgkclhia'
    }
});
const getHome = (req, res) => {
    res.render('users/common/home', {
        'pageTitle': 'خانه'
    });
};
exports.getHome = getHome;
const getRegister = (req, res) => {
    const error = req.flash('error');
    res.render('users/common/register', {
        'pageTitle': 'ثبت نام',
        'error': error[0],
        'path': error[1]
    });
};
exports.getRegister = getRegister;
const postRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        req.flash('error', [error.msg, error.param]);
        return res.redirect('/register');
    }
    const body = req.body;
    const inputUsername = body.username;
    const inputFirstName = body.firstName;
    const inputLastName = body.lastName;
    const inputBirthDate = body.birthDate;
    const inputPhoneNumber = body.phoneNumber;
    const inputEmail = body.email;
    const inputPassword = body.password;
    const user = yield user_1.default.findOne({ where: { username: inputUsername } });
    if (user) {
        req.flash('error', 'نام کاربری در سیستم موجود است.لطفا دوباره تلاش کنید.');
        return res.redirect('/register');
    }
    const hashedPassword = crypto_1.default.createHash('sha256').update(inputPassword).digest('hex');
    user_1.default.create({
        username: inputUsername,
        firstName: inputFirstName,
        lastName: inputLastName,
        phoneNumber: inputPhoneNumber,
        email: inputEmail.length > 0 ? inputEmail : undefined,
        password: hashedPassword,
        birthDate: inputBirthDate.length > 0 ? new Date(inputBirthDate) : undefined,
        isActive: false,
        RoleId: 3,
    })
        .then(user => {
        const randomHash = crypto_1.default.randomBytes(20).toString("hex");
        user.createVerifyEmail({
            randomString: randomHash
        })
            .then(() => {
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: 'shop.khosravi01@gmail.com',
                    pass: 'svnyuhjnhgkclhia'
                }
            });
            const mailOption = {
                from: 'shop.khosravi01@gmail.com',
                to: 'hojat.dehghanpoor01@gmail.com',
                subject: 'test',
                html: `<a href="">برای فعالسازی اکانت کلیک کنید</a>`
            };
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log(error);
                }
            });
        })
            .catch(err => {
            console.log(err);
        });
        //user not wait for create verify email
        res.redirect('/login');
    })
        .catch(err => {
        console.log(err);
    });
});
exports.postRegister = postRegister;
const getLogin = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/notAllowed');
    }
    res.render('users/common/login', {
        'pageTitle': 'ورود',
        error: req.flash('error')[0],
        alert: req.flash('alert')[0]
    });
};
exports.getLogin = getLogin;
const postLogin = (req, res) => {
    if (req.session.isLoggedIn) {
        req.session.destroy(err => {
            if (err) {
                console.log(err);
            }
            return res.redirect('/notAllowed');
        });
    }
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/login');
    }
    const body = req.body;
    const inputUsername = body.username;
    const inputPassword = body.password;
    user_1.default.findOne({ where: { username: inputUsername } })
        .then(user => {
        if (!user) {
            req.flash('error', 'کاربری با مشخصات وارد شده در سیستم ثبت نشده است.');
            return res.redirect('/login');
        }
        const hashedPassword = crypto_1.default.createHash('sha256').update(inputPassword).digest('hex');
        if (user.password === hashedPassword) {
            req.session.userId = user.id;
            req.session.isLoggedIn = true;
            req.session.save((err) => {
                if (err) {
                    console.log(err);
                }
                // redirect according to Role
                if (user.RoleId === 1) {
                    return res.redirect('/admin/products');
                }
                else if (user.RoleId === 2) {
                    return res.redirect('/seller/orders');
                }
                else {
                    res.redirect('/products');
                }
            });
        }
        else {
            req.flash('error', 'رمز عبور با نام کاربری تطبیق ندارد.');
            return res.redirect('/login');
        }
    });
};
exports.postLogin = postLogin;
const getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        return res.redirect('/');
    });
};
exports.getLogout = getLogout;
const getChangePassword = (req, res) => {
    res.render('users/common/changePassword', {
        pageTitle: 'تغیر رمز عبور',
        error: req.flash('error')[0],
        info: req.flash('info')[0]
    });
};
exports.getChangePassword = getChangePassword;
const postChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        req.flash('error', [error.msg, error.param]);
        return res.redirect('back');
    }
    const body = req.body;
    const inputPassword = body.password;
    const hashedPassword = crypto_1.default.createHash('sha256').update(inputPassword).digest('hex');
    if (req.currentUser) {
        req.currentUser.password = hashedPassword;
        req.currentUser.save()
            .then(user => {
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                }
                res.redirect('/login');
            });
        })
            .catch(err => {
            console.log(err);
        });
    }
    else {
        res.redirect('/');
    }
});
exports.postChangePassword = postChangePassword;
const getForgetPassword = (req, res) => {
    res.render('users/common/forgetPassword', {
        'pageTitle': 'فراموشی رمز عبور',
        'error': req.flash('error')[0],
        info: req.flash('info')[0]
    });
};
exports.getForgetPassword = getForgetPassword;
const postForgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        req.flash('error', [error.msg, error.param]);
        return res.redirect('/forgetPassword');
    }
    const body = req.body;
    const inputEmail = body.email;
    if (!inputEmail) {
        return res.redirect('/login');
    }
    user_1.default.findOne({ where: { email: inputEmail } })
        .then(user => {
        if (!user) {
            req.flash('error', 'کاربری با مشخصات وارد شده در سیستم ثبت نشده است.');
            return res.redirect('/forgetPassword');
        }
        const randomHash = crypto_1.default.randomBytes(20).toString('hex');
        user.createForgetPassword({
            randomString: randomHash
        }).then(forgetPasswordCreated => {
            const mailOption = {
                from: 'shop.khosravi01@gmail.com',
                to: user.email,
                subject: 'تغیر رمز عبور',
                html: `
                        <html>
                        <head/><head>
                        <body>
                        <a>${forgetPasswordCreated.randomString}</>
                        </body>
                        <html>
                    `
            };
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log(error.message);
                }
            });
            req.flash('info', 'لینکی حاوی آدرس تغیر رمز عبور برای شما ارسال شد،لطفا ایمیل خود را برسی کنید.');
            return res.redirect('/forgetPassword');
        });
    });
});
exports.postForgetPassword = postForgetPassword;
const getForgetPasswordChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        req.flash('error', [error.msg, error.param]);
        return res.redirect('/forgetPassword');
    }
    const inputForgetPasswordRandomHash = req.params.randomHash;
    const forgetPassword = yield forgetPassword_1.default.findOne({ where: { randomString: inputForgetPasswordRandomHash } });
    if (!forgetPassword) {
        req.flash('شما اجازه دسترسی به این مسیر را ندارید.');
        return res.redirect('/notAllowed');
    }
    res.render('users/common/forgetPasswordChange', {
        pageTitle: 'تغیر رمز عبور',
        forgetPasswordRandomHash: forgetPassword.randomString,
        error: req.flash('error')[0],
        info: req.flash('info')[0],
    });
});
exports.getForgetPasswordChange = getForgetPasswordChange;
const postForgetPasswordChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0];
        req.flash('error', [error.msg, error.param]);
        return res.redirect('back');
    }
    const param = req.params;
    const body = req.body;
    const inputForgetPasswordRandomHash = param.randomHash;
    const inputPassword = body.password;
    const inputRepeatPassword = body.repeatPassword;
    const forgetPassword = yield forgetPassword_1.default.findOne({ where: { randomString: inputForgetPasswordRandomHash }, include: { model: user_1.default } });
    if (!forgetPassword) {
        req.flash('error', 'شما اجازه دسترسی به این مسیر را ندارید');
        return res.redirect('/notAllowed');
    }
    forgetPassword.destroy();
    const hashedPassword = crypto_1.default.createHash('sha256').update(inputPassword).digest('hex');
    forgetPassword.User.password = hashedPassword;
    forgetPassword.User.save()
        .then(user => {
        req.flash('alert', 'رمز عبور شما با موفقیت تغیر کرد');
        res.redirect('/login');
    })
        .catch(err => {
        console.log(err);
    });
});
exports.postForgetPasswordChange = postForgetPasswordChange;
const getNotFound = (req, res) => {
    res.render('users/common/notFound', {
        'pageTitle': 'پیدا نشد'
    });
};
exports.getNotFound = getNotFound;
const getNotAllowd = (req, res) => {
    res.render('users/common/notAllowed', {
        'pageTitle': 'پیدا نشد',
        error: req.flash('error')[0]
    });
};
exports.getNotAllowd = getNotAllowd;
const getTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOption = {
        from: 'shop.khosravi01@gmail.com',
        to: 'hojat.dehghanpoor01@gmail.com',
        subject: 'test',
        html: `
            <html>
            <head/><head>
            <body>
            <pثبت نام موفق</p>
            </body>
            <html>
        `
    };
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(info.response);
        }
    });
    res.redirect('/');
});
exports.getTest = getTest;
