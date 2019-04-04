/**

 @Name：layuiAdmin 设置
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License: LPPL
    
 */
 
layui.define(['form', 'upload'], function(exports){
  
  var $ = layui.$
  ,layer = layui.layer
  ,laytpl = layui.laytpl
  ,setter = layui.setter
  ,view = layui.view
  ,admin = layui.admin
  ,form = layui.form
  ,upload = layui.upload;

  var $body = $('body');
  
  form.render();
  
  //自定义验证
  form.verify({
    nickname: function(value, item){ //value：表单的值、item：表单的DOM对象
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
      if(/(^\_)|(\__)|(\_+$)/.test(value)){
        return '用户名首尾不能出现下划线\'_\'';
      }
      if(/^\d+\d+\d$/.test(value)){
        return '用户名不能全为数字';
      }
    }
    
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    ,pass: [
      /^[\S]{8,16}$/
      ,'密码必须8到12位，且不能出现空格'
    ]
    
    //确认密码
    ,repass: function(value){
      if(value !== $('#LAY_password').val()){
        return '两次密码输入不一致';
      }
    }
  });
  
  
  
  
  //设置密码
  form.on('submit(setmypass)', function(obj){
    // layer.msg(JSON.stringify(obj.field));
    console.log(md5);

    var userData = JSON.parse(window.sessionStorage.getItem("userData"));

    websocket.send("ChangePassword",
      {User_data:{UserName:userData.userName,oldPassWord:md5(obj.field.oldPassword),newPassWord:md5(obj.field.repassword)}},
    function(res){
      debugger
      if(res.status= "success"){
        layer.msg("修改成功！",{time:1500,icon:1});
      } else {
        layer.msg("修改失败！",{time:1500,icon:2});
      }
    })
    //提交修改
    /*
    admin.req({
      url: ''
      ,data: obj.field
      ,success: function(){
        
      }
    });
    */
    return false;
  });
  
  //对外暴露的接口
  exports('set', {});
});