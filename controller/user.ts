import {Request,Response,NextFunction} from 'express'
import mongoose, { Model, Schema } from 'mongoose'
import bcrypt, { compareSync } from 'bcryptjs';
import jwt,{JwtPayload} from 'jsonwebtoken';
import multer from 'multer';

import User,{userInterface} from '../models/user';
import Product,{productInterface} from '../models/product';
import Order,{orderInterface} from '../models/order';
import Admin,{amdinInterface} from '../models/admin';
import userComment,{userCommentInterface} from '../models/userComment';
import UserComment from '../models/userComment';

declare global {
    namespace Express {
      interface Request {
        user?:JwtPayload;
      }
    }
}



export const PostAddProductToCart = async(req:Request,res:Response)=>{
    const productId = req.body.productId;
    const auth = req.user;
    if(auth && auth.userId){
        const user = await User.findById(auth.userId);
        const saveResult = await user.addProductToCart(productId);
        res.json({status:"sucsses",message:"محصول با موفقیت به سبد خرید اضافه شد.",productId:productId})
    }else{
        res.json({status:'tokenUnvalidate'});
    }
}

export const getCart = async(req:Request,res:Response)=>{
    const auth = req.user;
    if(auth && auth.userId){
        const user = await User.findById(auth.userId);
        const cart = await user.getCart();
        return res.json({status:'sucsses',cart:cart})
    }else{
        res.json({status:'tokenUnvalidate'});
    }
}

export const postDeleteItemFromCart = async (req:Request,res:Response)=>{
    const productId = req.body.productId;
    const auth = req.user;
    if(auth && auth.userId){
        const user = await User.findById(auth.userId);
        const result = await user.deleteItemFromCart(productId);
        res.json({
            status:"sucsses",
            message:'محصول با موفقیت از سبد خرید حذف شد.'
        })
    }else{
        res.json({status:'tokenUnvalidate'});
    }
}

export const postProductReduce = async(req:Request,res:Response)=>{
    const productId = req.body.productId;
    const auth = req.user;
    if(auth && auth.userId){
        const user = await User.findById(auth.userId);
        const result = user.reduceCountCartItem(productId);

        res.json({
            message:'تعداد محصول با موفقیت کاهش یافت.',
            status:'sucsses'
        })
    }else{
        res.json({status:'tokenUnvalidate'});
    }
           
}

export const postDeleteCart = async (req:Request,res:Response)=>{
    const auth = req.user;
    if(auth && auth.userId){
        const user = await User.findById(auth.userId);
        const result = await user.deleteCart();
        res.json({
            message:'سبد خرید حذف شد.',
            status:"sucsses"
        })
    }else{
        res.json({status:'tokenUnvalidate'});
    }
    
}

export const getProduct = async (req:Request,res:Response)=>{
    const productId = req.params.id;
    const product:productInterface = await Product.findById(productId);
    res.json(product);
}

export const postSignUp = async (req:Request,res:Response)=>{
    const inputUsername = req.body.username;
    const inputPpassword = req.body.password;
    const inputFirstName = req.body.firstName;
    const inputLastName = req.body.lastName;
    const inputPhoneNumber = req.body.phoneNumber;

    const userFind = await User.findOne({username:inputUsername});
    if(userFind || inputUsername==='hojat'){
        res.json({status:'failed',message:'کاربر با نام کاربری وارد شده در سیستم ثبت شده است.'});
    }else{
        const hashPassword = await bcrypt.hash(inputPpassword,10);
        const newUser = new User({
            username:inputUsername,
            password:hashPassword,
            firstName:inputFirstName,
            lastName:inputLastName,
            phoneNumber:inputPhoneNumber
        })
        const result = await newUser.save();
        res.json({status:'ok',message:'با موفقیت در سیستم ثبت شد'});
    }
}

export const postLogin = async (req:Request,res:Response)=>{
    const inputUsername = req.body.username;
    const inputPpassword = req.body.password;

    const userFind = await User.findOne({username:inputUsername});
    if(userFind){
        const isPasswordMath = await bcrypt.compare(inputPpassword,userFind.password);
        if(isPasswordMath){
            const token = jwt.sign({
                userId:userFind._id,isUser:true
            },'123456',{expiresIn:'1200000'});
            //res.setHeader('tokennnnnnnnn',token)
            res.setHeader('x-auth-token',token);
            res.setHeader('access-control-expose-headers','x-auth-token');
            return res.json({status:'sucsses',expiredIn:new Date().getTime()+1200000,accountName:userFind.username})
        }
    }else{
        const adminFind:amdinInterface = await Admin.findOne({username:inputUsername});
        if(adminFind){
            const matchPassword = await bcrypt.compare(inputPpassword,adminFind.password);
            if(matchPassword){
                const token = jwt.sign({userId:adminFind._id,isAdmin:true,accessLevel:'3'},
                    '123456',{expiresIn:'1200000'})

                adminFind.lastLogin = new Date().toLocaleString('fa-IR');
                const adminValidate = adminFind.validateSync();
                if(adminValidate){
                    return res.json({status:'failed',message:adminValidate.message})
                }
                adminFind.save();
                res.setHeader('x-auth-token',token);
                res.setHeader('access-control-expose-headers','x-auth-token');
                return res.json({status:'sucsses',expiredIn:new Date().getTime()+1200000,accountName:adminFind.firstName+' '+adminFind.lastName})
    
            }
        }
    }
    return res.json({status:'failed',message:'کاربری با مشخصات وارد شده در سیستم ثبت نشده است.'})
}

export const storeOrder = async(req:Request,res:Response)=>{
    const user = req.user;
    if(user && user.userId){
        const userFind:userInterface = await User.findById(user.userId);
        if(userFind){
            const cart = await userFind.getCart();
            const newOrder = new Order({
                user:{
                    userId:userFind._id,
                    name:userFind.username
                },products:cart.map((item: { _id: Schema.Types.ObjectId; quantity: Number; })=>{
                    return {
                        productId:item._id,
                        quantity:item.quantity
                    }
                })
            })
            cart.map(async(item:{_id:mongoose.Schema.Types.ObjectId,quantity:number,price:number})=>{
                const itemOfCart:productInterface = await Product.findById(item._id);
                if(itemOfCart){
                    await itemOfCart.addSalesNumber(item.quantity);
                }else{
                    console.log('else')
                    console.log(itemOfCart)
                }
            })
            const result = await newOrder.save();
            userFind.cart.items = [];
            const result2 = await userFind.save();
            return res.json({status:'sucsses',message:'سفارش شما با موفقیت ثبت شد.'})
        }
    }
    res.json({status:'unvalidToken',message:'لطفا مجددا به سیستم وارد شوید.'})
}


export const getAllProducts = async (req:Request,res:Response)=>{
    const products:Array<productInterface> = await Product.find().limit(40);
    res.json({status:'sucsses',products:products.map((pro:productInterface)=>{
        return {
            title:pro.title,
            price:pro.price,
            description:pro.description,
            _id:pro._id,
            imageUrl:pro.imageUrl,
            salesNumber:pro.salesNumber,
            createdAt:pro.createdAt,
            score:pro.score
        }
    })});
}

export const getProductSearch = async (req:Request,res:Response)=>{
    const searchTitle = req.params.searchTitle;
    if(searchTitle){
        const products = await Product.find({title:{$regex:new RegExp(searchTitle)}});
        
        return res.json({
            status:'sucsses',
            products: products ? products : []
        })
        
    }
    res.json({status:'failed',meesage:'مشکلی رخ داده است.100'})
}

export const postSendComment= async (req:Request,res:Response)=>{
    console
    if(req.user && req.user.userId){
        const userId = req.user.userId;
        const inputAlias = req.body.alias;
        const inputPoint = req.body.point;
        const inputComment = req.body.comment;
        const productId = req.params.productId;
        const newComment:userCommentInterface = new UserComment({
            userId:userId,
            productId:productId,
            alias:inputAlias,
            comment:inputComment,
            point:inputPoint
        })
        const newCommentValidate = newComment.validateSync();
        if(newCommentValidate){
            return res.json({status:'failed',message:'اطلاعات وارد شده صحیح نیست'})
        }
        const result= await newComment.save();
        console.log(result);
        res.json({status:'sucsses',message:'نظر شما با موفقیت ثبت شد.'})
    }else{
        res.json({status:'failed',message:'لطفا ابتدا به سیستم وارد شوید.'})
    }
}






export const getTest = async (req:Request,res:Response)=>{
    // const user:userInterface = await User.findOne({_id:'6117dd0fa1863b360262fb53'});
    // user.deleteItemFromCart('6117bb2f0844cf13b7024824')
    console.log(req.header)
}
