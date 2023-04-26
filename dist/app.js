"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
require('dotenv').config();
const database_1 = __importDefault(require("./utils/database"));
const user_1 = __importDefault(require("./models/user"));
const role_1 = __importDefault(require("./models/role"));
const APP_PORT = process.env.APP_PORT || '3000';
const app = (0, express_1.default)();
//Routers
const users_1 = __importDefault(require("./router/users/users"));
const order_1 = __importDefault(require("./models/order"));
const orderItem_1 = __importDefault(require("./models/orderItem"));
const categoryDiscount_1 = __importDefault(require("./models/categoryDiscount"));
const productDiscount_1 = __importDefault(require("./models/productDiscount"));
const admin_1 = __importDefault(require("./router/admin/admin"));
const seller_1 = __importDefault(require("./router/seller/seller"));
categoryDiscount_1.default;
productDiscount_1.default;
order_1.default;
orderItem_1.default;
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../views'));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public/')));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../public/images')));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({
    cookie: { maxAge: 10 * 60 * 1000 },
    secret: '123',
    resave: false,
    saveUninitialized: false
}));
app.use((0, connect_flash_1.default)());
app.use((req, res, next) => {
    if (req.session.userId) {
        user_1.default.findOne({ where: { id: req.session.userId },
            include: [{ model: role_1.default }] })
            .then(user => {
            if (user) {
                req.currentUser = user;
                next();
            }
        }).catch(err => {
            console.log(err);
        });
    }
    else {
        next();
    }
});
app.use((req, res, next) => {
    var _a;
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.roleId = (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.RoleId;
    next();
});
// router
app.use(users_1.default);
app.use(seller_1.default);
app.use(admin_1.default);
//page not found
app.use((req, res, next) => {
    return res.redirect('/notFound');
});
database_1.default.sync()
    .then(result => {
    app.listen(APP_PORT);
    console.log(`app running on ${APP_PORT}`);
})
    .catch(err => console.log(err));
