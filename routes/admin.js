/**
 * Created by LiYu on 2017/12/8.
 */
var User=require('../models/user');
var Sort=require('../models/Sort');
var Content=require('../models/Content');
//管理员
var express=require('express');
var router=express.Router();
router.use(function(req,res,next){
   if(!req.userInfo.isAdmin){
      res.send('对不起，只有管理员才能查看后台管理!');
      return;
   }
   next();
});
//监听路由
//首页
router.get('/',function(req,res,next){
   res.render('admin/index',{
      userInfo:req.userInfo,
   });
});
//用户管理
router.get('/user',function(req,res,next){
   //从数据库里面读取数据
   //实现分页的基础skip() limit()
   var page=Number(req.query.page||1);
   //var page=1;
   var limit=2;
   //console.log(User.count().length);
   var pages=0;
   User.count().then(function(count){
      //console.log(count);
      pages=Math.ceil(count/limit);
      //取值不能超过总页数
      page=Math.min(page,pages);
      //取值不能小于1
      page=Math.max(page,1);
      var skip=(page-1)*limit;
      User.find().skip(skip).limit(limit).then(function(users){
         res.render('admin/user_index',{
            userInfo:req.userInfo,
            users:users,
            page:page,
            pages:pages,
            count:count,
            limit:limit,
            url:'/admin/user'
         });
      });
   });
});
//分类管理
router.get('/sort/add',function(req,res){
   res.render('admin/sort_add');
});
//分类的保存
router.post('/sort/add', function (req,res) {
   //console.log(req.body);
   var name=req.body.name||'';
   if(name==''){
      res.render('admin/error',{
         userInfo:req.userInfo,
         message:'分类名称不能为空'
      });
   }
   //查看数据库中是否存在同名的分类
   Sort.findOne({
      name:name
   }).then(function(rs){
      if(rs){
         res.render('admin/error',{
            userInfo:req.userInfo,
            message:'该分类已存在'
         });
         return Promise.reject();
      }else{
         //表述数据库中不存在该分类，保存
         return new Sort({
            name:name
         }).save();
      }
   }).then(function(sortInfo){
      res.render('admin/success',{
         userInfo:req.userInfo,
         message:'该分类保存成功!',
         url:'/admin/sort'
      });
   });
});
//分类操作 修改和删除
//修改
router.get('/sort/edit',function(req,res){
   var id=req.query.id;
   Sort.findOne({
      _id:id
   }).then(function(sortInfo){
      if(!sortInfo){
         res.render('admin/error',{
            userInfo:req.userInfo,
            message:'该用户不存在'
         });
      }else{
         res.render('admin/sort_edit',{
            userInfo:req.userInfo,
            sortInfo:sortInfo
         });
      }
   });
});
//修改保存
router.post('/sort/edit',function(req,res){
   var name=req.body.name;
   var id=req.query.id;
   Sort.findOne({
      _id:id
   }).then(function(sortInfo){
      if(!sortInfo){
         res.render('admin/error',{
            userInfo:req.userInfo,
            message:'该用户不存在'
         });
      }else{
        //保存用户信息
        // 当用户没有做任何修改的时候提交
         if(name==sortInfo.name){
            res.render('admin/success',{
               message:'分类修改成功！',
               url:'/admin/sort'
            });
            return Promise.reject();
         }else{
            //保存到数据库里面去
            //假设用户名已经存在了，则不允许进行修改了
           return Sort.findOne({
               _id:{$ne:id},
               name:name
            });
         }
      }
   }).then(function(sameInfo){
      //表示数据库已经存在同名分类，不允许此次修改生效
      if(sameInfo){
         //用户名存在的话,返回错误提示页面
         res.render('admin/error',{
            userInfo:req.userInfo,
            message:'数据库中存在同名分类'
         });
         return Promise.reject();
      }else{
         return Sort.update({_id:id},{name:name});
      }
   }).then(function(){
      res.render('admin/success',{
         message:'修改信息成功',
         userInfo:req.userInfo,
         url:'/admin/sort'
      });
   });

});
//删除
router.get('/sort/delete',function(req,res){
   //获取要分类的id
   var id=req.query.id;
   Sort.remove({_id:id}).then(function(){
      res.render('admin/success',{
         userInfo:req.userInfo,
         message:'删除成功',
         url:'/admin/sort'
      })
   })
});
//分类首页
router.get('/sort',function(req,res){
   var page=Number(req.query.page||1);
   var limit=2;
   var pages=0;
   Sort.count().then(function(count){
      pages=Math.ceil(count/limit);
      page=Math.min(page,pages);
      page=Math.max(page,1);
      var skip=(page-1)*limit;
      //1,表示升序
      //-1,表示降序
      Sort.find().sort({_id:-1}).skip(skip).limit(limit).then(function(sorts){
         res.render('admin/sort_index',{
            userInfo:req.userInfo,
            sorts:sorts,
            page:page,
            pages:pages,
            count:count,
            limit:limit,
            url:'/admin/sort'
         });
      });
   });
});

//内容管理
//内容首页
router.get('/content',function(req,res){
   var page=Number(req.query.page||1);
   var limit=2;
   var pages=0;
   Content.count().then(function(count){
      pages=Math.ceil(count/limit);
      page=Math.min(page,pages);
      page=Math.max(page,1);
      var skip=(page-1)*limit;
      //1,表示升序
      //-1,表示降序
      Content.find().sort({_id:-1}).skip(skip).limit(limit).populate(['sort','user']).then(function(content){
         res.render('admin/content_index',{
            userInfo:req.userInfo,
            contents:content,
            page:page,
            pages:pages,
            count:count,
            limit:limit,
            url:'/admin/content'
         });
      });
   });
});
//添加内容
router.get('/content/add',function(req,res){
   //读取分类信息
   Sort.find().sort({_id:-1}).then(function(sorts){
      res.render('admin/content_add',{
         userInfo:req.userInfo,
         sorts:sorts
      });
   });
});
//内容保存
router.post('/content/add',function(req,res){
   //做一个简单的验证
   if(req.body.sort==''){
      res.render('admin/error',{
         userInfo:req.userInfo,
         message:'分类内容不能为空'
      });
   }
   if(req.body.title==''){
      res.render('admin/error',{
         userInfo:req.userInfo,
         message:'标题不能为空'
      });
   }
   //保存数据到数据库
   new Content({
      sort:req.body.sort,
      title:req.body.title,
      description:req.body.description,
      content:req.body.content,
      user:req.userInfo._id.toString()
   }).save().then(function(rs){
       res.render('admin/success',{
          userInfo:req.userInfo,
          message:'成功添加内容',
          url:'/admin/content'
       });
    });
});
//内容的修改
router.get('/content/edit',function(req,res){
   var id=req.query.id||'';
   //读取分类信息
   var sorts=[];
   Sort.find().sort({_id:-1}).then(function(rs){
      sorts=rs;
      return Content.findOne({_id:id}).populate('sort');
   }).then(function(content){
      if(!content){
         //根据id号没有查询出用户，渲染错误页面
         res.render('admin/error',{
            userInfo:req.userInfo,
            message:'指定内容不存在'
         });
         return Promise.reject();
      }else{
         res.render('admin/content_edit',{
            userInfo:req.userInfo,
            content:content,
            sorts:sorts
         });
      }
   });
});
//保存修改内容
router.post('/content/edit',function(req,res){
   var id=req.query.id;
   if(req.body.sort==''){
      res.render('admin/error',{
         userInfo:req.userInfo,
         message:'用户分类不能为空'
      });
      return Promise.reject();
   }
   if(req.body.title==''){
      res.render('admin/error',{
         userInfo:req.userInfo,
         message:'内容标题不能为空'
      });
      return Promise.reject();
   }
   if(req.body.content==''){
      res.render('admin/error',{
         userInfo:req.userInfo,
         message:'内容不能为空'
      })
      return Promise.reject();
   }
   Content.update({
      _id:id
   },{
      sort:req.body.sort,
      title:req.body.title,
      description:req.body.description,
      content:req.body.content
   }).then(function(){
      res.render('admin/success',{
         userInfo:req.userInfo,
         message:'内容保存成功',
         url:'/admin/content'
      });
   });
});
//内容的删除
router.get('/content/delete',function(req,res){
   var id=req.query.id;
   Content.remove({_id:id}).then(function(){
      res.render('admin/success',{
         userInfo:req.userInfo,
         message:'删除成功',
         url:'/admin/content'
      })
   })
});
module.exports=router;