/**
 * Created by LiYu on 2017/12/8.
 */
$(function(){
    var $loginBox=$(".login-box");
    var $registBox=$(".regist-box");
    var $succss=$(".success-box");
    //切换到注册页面
    $(".login-box button").click(function(){
        $loginBox.hide();
        $registBox.show();
    });
    //切换到登录页面
    $(".regist-box button").click(function(){
        $loginBox.show();
        $registBox.hide();
    });
    //注册功能的实现
    $(".resiger").click(function(){
        $.ajax({
           type:'post',
            url:'/api/user/register',
            data:{
                username:$registBox.find('[name="username"]').val(),
                password:$registBox.find('[name="password"]').val(),
                repassword:$registBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(data){
                $(".messageInfo").html(data.message);
                if(!data.code){
                   //表示注册成功了
                    setTimeout(function(){
                        $loginBox.show();
                        $registBox.hide();
                    },1000);
                }
            }
        });
    });
    //登录功能的实现
    $(".loginbtn").click(function(){
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$(".login-box").find('[name="username"]').val(),
                password:$(".login-box").find('[name="password"]').val()
            },
            datatype:'json',
            success:function(data){
                console.log(data);
                $(".messageInfo").html(data.message);
                if(!data.code){
                    //setTimeout(function(){
                    //    $loginBox.hide();
                    //    $succss.show();
                    //    //显示用户的信息
                    //    $(".userinfo").html(data.userInfo.username);
                    //    $(".welcomeinfo").html('欢迎来到我的博客！！');
                    //},1000);
                    window.location.reload();
                }
            }
        });
    });
    $("#exits").click(function(){
        $.ajax({
            url:'/api/user/logout',
            success:function(result){
                console.log(result);
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    })
});