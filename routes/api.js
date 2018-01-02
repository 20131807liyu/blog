/**
 * Created by LiYu on 2017/12/8.
 */
//api的路由
var express=require('express');
var router=express.Router();
var User=require('../models/user');
var Content=require('../models/Content');
//router.get('/user',function(req,res,next){
//    res.send('api-user');
//});
//监听路由
//统一返回给前端
var responseData;
router.use(function(req,res,next){
    //初始化处理
    responseData={
        code:0,
        message:''
    };
    next();
});
//用户注册
//1,用户名不能为空，
//2，密码不能为空
//3，确认密码是否和密码一致
//4，用户名是否重名
router.post('/user/register',function(req,res,next){
    console.log(req.body);
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;
    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空';
        res.json(responseData);
        return;
    }
    if(password==''){
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData);
        return;
    }
    if(password!=repassword){
        responseData.code=3;
        responseData.message='两次输入的密码不一致';
        res.json(responseData);
        return;
    }
    User.findOne({
        username:username
    }).then(function(userInfo){
        console.log(userInfo);
        if(userInfo){
            responseData.code=4;
            responseData.message="用户名已经被注册了";
            res.json(responseData);
            return;
        }else{
            var user=new User({
                username:username,
                password:password
            });
            return user.save();
        }
    }).then(function(newUserInfo){
        responseData.message='注册成功';
        res.json(responseData);
    });

    //var username=req.query.username;
    //var password=req.query.password;
    //var repassword=req.query.repassword;
});
//登录模块的功能实现
router.post('/user/login',function(req,res){
   var username=req.body.username;
    var password=req.body.password;
    if(username==''||password==''){
        responseData.code=1;
        responseData.message='用户名和密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库
    User.findOne({
        username:username,
        password:password
    }).then(function(userinfo){
        //登录失败
       if(!userinfo){
           responseData.code=2;
           responseData.message='用户名或密码错误';
           res.json(responseData);
           return;
       }
        //登录成功的情况
        responseData.message='用户登录成功';
        responseData.userInfo={
            _id:userinfo._id,
            username:userinfo.username
        };
        req.cookies.set('user',JSON.stringify({
            _id:userinfo._id,
            username:userinfo.username
        }));
        res.json(responseData);
        return;
    });
});
//退出功能的实现
router.get('/user/logout',function(req,res){
    req.cookies.set('user',null);
    responseData.message='成功退出';
    res.json(responseData);
});
//与评论有关的方法
router.post('/comment/post',function(req,res){
    //内容的id,前端提供id
    var contentId=req.body.contentid||'';
    var postData={
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    };
    Content.findOne({_id:contentId}).then(function(content){
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent){
        responseData.message="评论成功";
        responseData.data=newContent;
        res.json(responseData);
    });
});
router.get('/comment',function(req,res){
    var contentid=req.query.contentid||'';
    Content.findOne({
        _id:contentid
    }).then(function(newConent){
        responseData.data=newConent.comments;
        res.json(responseData);
    })
})
module.exports=router;