import {Schema,model,Document} from 'mongoose';

export interface amdinInterface extends Document{
    firstName:string,
    lastName:string,
    username:string,
    password:string,
    lastLogin:string
}

const adminSchema = new Schema<amdinInterface>({
    firstName:{
        type:String,
        required:true,
    },lastName:{
        type:String,
        required:true
    },username:{
        type:String,
        required:true
    },password:{
        type:String,
        required:true
    },lastLogin:{
        type:String,
        required:true
    }
},{timestamps:true})

const admin = model('Admin',adminSchema);

export default admin;