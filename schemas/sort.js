/**
 * Created by LiYu on 2017/12/13.
 */
var mongoose=require('mongoose')
//定义分类的表结构
module.exports=new mongoose.Schema({
    //分类名称
    name:String
});