import express,{Application,Request,Response,NextFunction} from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path'

const mongodb_URL:string="mongodb://localhost:27017";

const app:Application=express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());


app.use((req:Request,res:Response,next:NextFunction)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/images',express.static(path.join(__dirname,'../images')))


const adminRouter = require('./router/admin');
import userRouter from './router/user';

const user_id = '6117dd0fa1863b360262fb53';


app.use('/admin',adminRouter);
app.use(userRouter);

mongoose
    .connect(mongodb_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log('server run on 8080')
        app.listen(8080);
    })
    .catch(err=>{
        console.log(err);
    })
