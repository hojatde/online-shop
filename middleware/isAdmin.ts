import {Request,Response,NextFunction} from 'express'
import jwt,{JwtPayload} from 'jsonwebtoken';

declare global {
    namespace Express {
      interface Request {
        admin?:JwtPayload;
      }
    }
}

export const isAdmin = (req:Request,res:Response,next:NextFunction)=>{
    let isAutication = false;
    if(req.admin){
        console.log('دسترسی غیر مجاز')
        return res.json({status:'unValid token',message:'دسترسی غیر مجاز'}); 
    }
    let inputToken = req.header('Authorization');
    if(inputToken){
        inputToken = inputToken.split(' ')[1];
        try{
            const token = jwt.verify(inputToken,'123456');
            if(token && typeof(token)!=='string'){
                isAutication =true;
                req.admin = token;
            }
        }catch{
            return res.json({status:'unValidToken',message:'لطفا مجددا به سیستم وارد شوید'});
        }  
    }
    if(!isAutication){
        console.log('unvalid')
        return res.json({status:'unValidToken',message:'لطفا مجددا به سیستم وارد شوید'});
    }else{next();}
}

export default isAdmin;