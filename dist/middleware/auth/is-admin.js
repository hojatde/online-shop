"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminMiddleware = void 0;
const isAdminMiddleware = (req, res, next) => {
    var _a;
    if (req.session.isLoggedIn) {
        if (req.currentUser && ((_a = req.currentUser.Role) === null || _a === void 0 ? void 0 : _a.title) === 'admin') {
            next();
        }
        else {
            req.flash('error', 'شما اجازه دسترسی به این مسیر را ندارید.');
            return res.redirect('/notAllowed');
        }
    }
    else {
        req.flash('alert', 'برای استفاده از امکانات سایت باید ابتدا وارد شوید.');
        return res.redirect('/login');
    }
};
exports.isAdminMiddleware = isAdminMiddleware;
