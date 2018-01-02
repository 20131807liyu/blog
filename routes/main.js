/**
 * Created by LiYu on 2017/12/8.
 */
    //前台页面
var express=require('express');
var router=express.Router();
var Sort=require('../models/Sort');
var Content=require('../models/Content')
var data;
router.use(function(req,res,next){
    data={
        userInfo:req.userInfo,
        sorts:[]
    }
    data.userInfo=req.userInfo;
    data.sorts=[];
    //获取分类信息,填充导航区域
    Sort.find().then(function(sorts){
        data.sorts=sorts;
        next();
    });
});
//监听路由
//router.get('/',function(req,res,next){
//    res.send(123);
//})
router.get('/',function(req,res,next){
    data.sort=req.query.sort||'';
    data.page=Number(req.query.page||1);
    data.pages=0;
    data.limit=2;
    data.count=0;
    var where={};
    if(data.sort){
        where.sort=data.sort;
    }
    Content.where(where).count().then(function(count){
        //这里可以计算分页数
        data.count=count;
        data.pages=Math.ceil(data.count/data.limit);
        data.page=Math.min(data.page,data.pages);
        data.page=Math.max(data.page,1);
        var skip=(data.page-1)*data.limit;
        return Content.where(where).find().skip(skip).limit(data.limit).populate(['sort','user']).sort({addTime:-1});
    }).then(function(contents){
        data.contents=contents;
        res.render('index',data);
    });
});
//详情页查询
router.get('/views',function(req,res){
    var contentId=req.query.contentId||'';
    Content.findOne({
        _id:contentId
    }).populate(['user','sort']).then(function(content){
        data.content=content;
        content.views++;
        content.save();
        res.render('detail',data);
    });
});
module.exports=router;