/**
 * Created by LiYu on 2017/12/8.
 */
var mongoose=require('mongoose');
var userSchema=require('../schemas/users');
module.exports=mongoose.model('User',userSchema);