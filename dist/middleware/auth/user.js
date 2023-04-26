"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoginMiddleware = void 0;
const isLoginMiddleware = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    }
    else {
        req.flash('alert', 'برای استفاده از امکانات سایت باید ابتدا وارد شوید.');
        return res.redirect('/login');
    }
};
exports.isLoginMiddleware = isLoginMiddleware;
