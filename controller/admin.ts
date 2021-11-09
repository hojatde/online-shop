import {Request,Response,NextFunction} from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';

import Product,{productInterface} from "../models/product";
import Admin,{amdinInterface} from '../models/admin';

declare global {
    namespace Express {
      interface Request {
        admin?:JwtPayload;
      }
    }
}

const fileStorage= multer.diskStorage({
    destination: (req:Request, file, cb) => {
        cb(null, 'images');
    }, filename: (req, file, cb) => {
        cb(null, new Date().getTime().toString() + file.originalname);
    }
})

const fileFilter = (req:Request, file:Express.Multer.File, cb:multer.FileFilterCallback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null,true)
    } else {
        cb(null,false);
    }
}
const uploadImage = multer({ storage: fileStorage, fileFilter: fileFilter}).single('image');

export const postUploadImage = async (req:Request, res:Response, next:NextFunction) => {
    uploadImage(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log(err)
        } else if (err) {
            console.log(err)
        }
        next();
    })
}

export const PostAddProduct = async(req:Request,res:Response)=>{
    console.log(req.admin)
    const {title,price,description} = req.body;
    const imageUrl = req.file ? req.file.path : null;
    if(req.admin && req.admin.userId){
        const product = new Product({
            title:title,
            price:price,
            description:description,
            imageUrl:imageUrl,
            adminId:req.admin.userId
        })
        
        const productValidate = product.validateSync();
        if(productValidate){
            res.json({status:"failed",message:productValidate.message}); 
        }else{
            const result = await product.save();
            res.json({status:"sucssesfull",message:'محصول با موفقیت اضافه شد.'}); 
        }
    }else{
        res.json({status:'failed',message:'ابتا به سیستم وارد شوید'})
    }
}

export const getOrder = async (req:Request,res:Response)=>{

}

export const getTest = async(req:Request,res:Response)=>{
    const hashPassword = await bcrypt.hash('12345678',8);
    const adminFind = await Admin.findOne({username:'hojat'});
    if(adminFind){return res.send('admin available')}
    const newAdmin:amdinInterface = new Admin({
        firstName:'hojat',lastName:'dehghanpoor',
        username:'hojat',password:hashPassword,
        lastLogin:new Date().toLocaleString('fa-IR')
    })

    const result = await newAdmin.save();
    res.send('ok')
}