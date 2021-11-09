import {Schema,model,Document} from 'mongoose';

export interface userCommentInterface extends Document{
    userId:Schema.Types.ObjectId,
    productId:Schema.Types.ObjectId,
    accepted:boolean,
    alias:string,
    comment:string
}

const userCommentSchema = new Schema<userCommentInterface>({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    productId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Product'
    },
    accepted:{
        type:Boolean,
        required:true,
        default:false
    },
    alias:{
        type:String,
        required:true,
        default:'کاربر سایت'
    },
    comment:{
        type:String,
        required:true
    },
    point:{
        type:Number,
        required:true,
        default:5
    }
},{timestamps:{createdAt:true,updatedAt:false}})

const UserComment = model('UserComment',userCommentSchema);

export default UserComment;