import { timeStamp } from 'console';
import mongoose,{Document, Schema} from 'mongoose';

export interface productInterface extends Document{
    title:string,
    price:string,
    description:string,
    _id:string,
    imageUrl:string,
    salesNumber:number,
    score:number,
    adminId:Schema.Types.ObjectId,
    createdAt:Date,
    addSalesNumber:Function
}

const productSchema = new Schema<productInterface>({
    title:{
        required:true,
        type:String,
    },
    price:{
        required:true,
        type:Number
    },
    description:{
        required:false,
        type:String
    },
    imageUrl:{
        required:true,
        type:String,
        default:null
    },adminId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Admin'
    },
    salesNumber:{
        type:Number,
        required:true,
        default:0
    },
    score:{
        type:Number,
        required:true,
        default:5
    },
},{timestamps:true})

productSchema.methods.addSalesNumber = async function(x:number){
    this.salesNumber+=x;
    await this.save();
}

const Product = mongoose.model('Product', productSchema)

export default Product;