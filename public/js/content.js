/**
 * Created by LiYu on 2017/12/15.
 */
$(function(){
    //页面加载的时候就去加载内容
    $.ajax({
        url:'/api/comment',
        data:{
            contentid:$("#subid").val()
        },
        success:function(data){
            comments=data.data.reverse();
            renderComment();
        }
    })
    $("#btnSubmit").click(function(){
        $.ajax({
            url:'/api/comment/post',
            type:'post',
            data:{
                content:$("#subtxt").val(),
                contentid:$("#subid").val(),
            },
            success:function(data){
                //console.log(data);
                comments=data.data.comments.reverse();
                renderComment();
            }
        });
    });
    var pages=0;
    var page=1;
    var limit=2;
    var comments=[];
    $(".pager").delegate('a','click',function(){
        if($(this).parent().hasClass('previous')){
            page--;
        }else{
            page++;
        }
        renderComment();
    });
    function renderComment(){
        pages=Math.max(Math.ceil(comments.length/limit),1);
        var start=Math.max(0,(page-1)*limit);
        var end=Math.min(start+limit,comments.length);
        $(".sum").html(comments.length);
        var $lis=$(".pager li");
        $lis.eq(1).html(page+'/'+pages);
        if(page<=1){
            page=1;
            $lis.eq(0).html('<span>没有上一页</span>');
        }else{
            $lis.eq(0).html('<a href="javascript:;">上一页</a>');
        }
        if(page>=pages){
            page=pages;
            $lis.eq(2).html('<span>没有下一页</span>');
        }else{
            $lis.eq(2).html('<a href="javascript:;">下一页</a>');
        }
        if(comments.length==0){
            $(".newslist ul").html('<li>当前没有评论</li>');
        }else{
            var html='';
            for(var i=start;i<end;i++){
                html+="<li><div class='header'> <p>评论人: <span>"+comments[i].username+"</span></p> <p>评论时间: <span>"+d(comments[i].postTime)+"</span></p> </div><div class='bodys'><p>"+comments[i].content+"</p></div></li>";
            }
            //console.log(html);
            $(".newslist ul").html(html);
        }
    }
//转换时间
    function d(date){
        var date=new Date(date);
        var minute;
        if(date.getMinutes()<10){
            minute="0"+date.getMinutes();
        }else{
            minute=""+date.getMinutes();
        }
        return date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDay()+"日 "+date.getHours()+":"+minute+":"+date.getSeconds();
    }
});
