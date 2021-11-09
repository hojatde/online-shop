import { json } from 'body-parser';
import mongoose,{Schema,model} from 'mongoose';

import {productInterface} from './product';

export interface userInterface extends mongoose.Document {
    username: string,
    password: string,
    firstName:string,
    lastName:string,
    phoneNumber:string,
    cart:{
        items:
            Array<{
                productId:productInterface,
                quantity:number
            }>
        |[]
    },
    addProductToCart:Function,
    getCart:Function,
    deleteItemFromCart:Function,
    reduceCountCartItem:Function,
    deleteCart:Function
  }

const userSchema = new Schema<userInterface>({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    cart:{
        items:[
            {
                productId:{
                    type:Schema.Types.ObjectId,
                    required:true,
                    ref:'Product'
                },
                quantity:{
                    type:Number,
                    required:true
                }
            }
        ]
    }
},{timestamps:true})

//module.exports = model('User',userSchema);
userSchema.methods.addProductToCart = async function (productId){
    const productIndex:number = this.cart.items.findIndex(ob=>{
        return ob.productId.toString() === productId.toString(); 
    })
    if(productIndex<0){
        const newArray = [...this.cart.items];
        newArray.push({
            productId:productId,
            quantity:1
        })

        this.cart.items = newArray;
    }else{
        this.cart.items[productIndex].quantity += 1
    }
    const result = await this.save()
    return result;
}

userSchema.methods.getCart = async function(){
    const newList = await this.populate('cart.items.productId').execPopulate()
    const newProducts = this.cart.items.map(item=>{
        return ({
            title:item.productId.title,
            price:item.productId.price,
            quantity:item.quantity,
            _id:item.productId._id
        })
    })
    return newProducts;
}

userSchema.methods.deleteItemFromCart = async function(proId){
    const newItems = this.cart.items.filter(item=>{
        if(item.productId.toString() !== proId){
            return item;
        }
    })

    const newCart = {items:newItems}
    
    this.cart.items= newItems;
    this.save();
}

userSchema.methods.reduceCountCartItem = async function (proId) {
    const itemIndex = this.cart.items.findIndex(item=>{
        return item.productId.toString() === proId
    })
    if(itemIndex>-1){
        if(this.cart.items[itemIndex].quantity===1){
            const newList = this.cart.items.filter(item=>{
                return item.productId.toString()!==proId
            })
            this.cart.items = newList;
        }else{
            this.cart.items[itemIndex].quantity -= 1;
        }
        this.save();
    }else{
        return null;
    }
}

userSchema.methods.deleteCart = function(){
    this.cart.items = [];
    this.save();
}

const User = model('User',userSchema);

export default User;