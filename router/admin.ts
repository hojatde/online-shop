import { Router,Request,Response,NextFunction } from "express";

import User from '../models/user';

import {PostAddProduct,getTest,postUploadImage} from '../controller/admin';
import isAdmin from "../middleware/isAdmin";

const adminRouter:Router = Router();

adminRouter.post('/addProduct',isAdmin,postUploadImage,PostAddProduct)
adminRouter.get('/test',getTest);

module.exports = adminRouter;