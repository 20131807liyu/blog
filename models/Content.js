/**
 * Created by LiYu on 2017/12/13.
 */
var mongoose=require('mongoose');
var contentSchema=require('../schemas/content');
module.exports=mongoose.model('Content',contentSchema);