/**
 * Created by LiYu on 2017/12/8.
 */
var mongoose=require('mongoose')
//�����û��ı�ṹ
module.exports=new mongoose.Schema({
    //�û���
    username:String,
    //����
    password:String,
    //�Ƿ��ǹ���Ա
    isAdmin:{
        type:Boolean,
        default:false
    }
});