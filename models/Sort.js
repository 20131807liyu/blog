/**
 * Created by LiYu on 2017/12/13.
 */
var mongoose=require('mongoose');
var sortSchema=require('../schemas/sort');
module.exports=mongoose.model('Sort',sortSchema);