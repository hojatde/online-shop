"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../../controller/admin/user");
const adminUserRouter = (0, express_1.Router)();
adminUserRouter.get('/users', user_1.getAdminUserList);
exports.default = adminUserRouter;
