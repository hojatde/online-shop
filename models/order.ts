import {model,Schema,Document} from 'mongoose';

export interface orderInterface extends Document{
    user:{
        userId:Schema.Types.ObjectId,
        name:string,
    },products:Array<{
        productId:Schema.Types.ObjectId,
        quantity:Number
    }>
}

const orderSchema = new Schema<orderInterface>({
    user:{
        userId:{
            required:true,
            type:Schema.Types.ObjectId,
            ref:'User'
        },name:{
            type:String,
            required:true
        }
    },products:[
        {
            productId:{type:Schema.Types.ObjectId,required:true,ref:'Product'},
            quantity:{type:Number,required:true}

        }
    ]
},{timestamps:true})

const Order = model('Order',orderSchema);
export default Order;