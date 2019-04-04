var CDdata = {};
CDdata.server = "http://192.168.1.88:8888";
CDdata.Nserver = "http://192.168.1.120:80";
CDdata.api = {
    login:"/userLogin.ashx"  //用户登录
    ,getUserList:"/getUserList.ashx?id="  //IM获取好友列表
    ,getRoomUser:"/getChatRoomUserList.ashx"  //群组成员
    ,tzEntry:"/mtg/taizhang/login.ashx" //台账录入
    ,uploadFiles:"/mtg/xin/uploadFiles.ashx?"  // 图片文件上传
};
CDdata.Napi = {
    login:"/userLogin.ashx"   //
    ,getOnePageData:'/yiqi/getOnePageData.ashx'  //获取台账录入列表
    ,getDataById:'/yiqi/getDataById.ashx'    //根据id 获取一条数据
    ,addFile:'/yiqi/addFile.ashx'   //添加文件/图片
    ,saveData:'/yiqi/saveData.ashx'  //保存数据
    ,saveAndCommitData:'/yiqi/saveAndCommitData.ashx'   //保存并提交
    ,getStreetCommunity:'/yiqi/getStreetCommunity.ashx'  //镇村数据
};