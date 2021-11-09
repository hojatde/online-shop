import express,{ Router,Request,Response,NextFunction } from "express";
import path from 'path';

import {PostAddProductToCart,getProductSearch,postSendComment,
    getAllProducts,storeOrder,postLogin,postSignUp,getProduct,postDeleteCart,
    getCart,getTest,postProductReduce,postDeleteItemFromCart} from '../controller/user'

import authication from "../middleware/authication";

const userRouter = express.Router();

userRouter.get('/',(req:Request,res:Response)=>{
    res.sendFile(path.join(__dirname,'../views/home.html'))
})

userRouter.get('/getAll',getAllProducts);
userRouter.get('/cart',authication,getCart);
userRouter.post('/addProductToCart',authication,PostAddProductToCart);
userRouter.post('/deleteItemFromCart',authication,postDeleteItemFromCart);
userRouter.post('/postProductReduce',authication,postProductReduce);
userRouter.post('/deleteCart',authication,postDeleteCart);
userRouter.get('/product/:id',getProduct);
userRouter.post('/signUp',postSignUp)
userRouter.post('/login',postLogin);
userRouter.post('/storeOrder',authication,storeOrder);
userRouter.get('/search/:searchTitle',getProductSearch);
userRouter.post('/product/:productId/sendComment',authication,postSendComment);

userRouter.get('/test',getTest)

export default userRouter;