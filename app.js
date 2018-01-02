/**
 * Created by LiYu on 2017/12/8.
 */
var express=require('express');
var swig=require('swig');
var Cookies=require('cookies');
var mongoose=require('mongoose');
//处理前端传过来的数据
var bodyParser=require("body-parser");
var User=require('./models/user');
var app=express();
//配置前端模板
//第一个参数表示的文件的后缀，第二个参数表示的是用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件的存放的目录，第一个参数必须是views,第二个参数是前端页面的存放文件目录
app.set('views','./views');
//注册所使用的模板引擎
app.set('view engine','html');//这个第二个参数必须要和app.engine里面的第一个参数保持一致
app.use('/public',express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extend:true}));
//设置cookies
//值得注意的地方是：如果是想都使用中间件里面的值，那么需要将他们定义在路由之前，其他的子路由才能使用它
app.use(function(req,res,next){
    req.cookies=new Cookies(req,res);
    //console.log(typeof req.cookies.get('user'));
    req.userInfo={};
    if(req.cookies.get('user')){
        try{
            req.userInfo=JSON.parse(req.cookies.get('user'));
            //获取当前用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                //userInfo指的是通过这个id查询出来的用户
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                next();
            });
        }catch(e){
            next();
        }
    }else{
        next();
    }

});
//取消模板的缓存
swig.setDefaults({cache:false});
//分模板开发与实现
app.use('/admin',require('./routes/admin'));
app.use('/api',require('./routes/api'));
app.use('/',require('./routes/main'));
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/blog',function(err){
    if(err){
        console.log("连接失败");
    }else{
        console.log('连接成功');
        app.listen(8084);
    }
});

