var mongoose=require('mongoose')
//定义分类的表结构
module.exports=new mongoose.Schema({
    //关联字段 内容分类的id
    sort:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Sort'
    },
    //内容标题
    title:String,
    //简介
    description:{
        type:String,
        default:''
    },
    //内容
    content:{
        type:String,
        default:''
    },
    //作者
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    comments:{
        type:Array,
        default:[]
    }
});
