//全站配置文件
window.WebConfig={
    // websocketUrl:"ws://websocket.s3.natapp.cc/",
    websocketUrl:"ws://192.168.1.123:7777",
    //ajax登录地址
    ajaxLoginUrl:"",
    LoginUrl2:"http://"+window.location.host+"/user/login.html",
    uploadFileUrl:window.location.hostname,
    loginUrl:(function(){
        var hostName,item=document.querySelectorAll("script");
        if(item.length){
            var selfUrl=item[item.length-1].src;//脚本路径
            selfUrl=selfUrl.replace("javascript/public/webpublic.js","");
            selfUrl+="pages/loginModule/login.html";
            return selfUrl;
        }
        return "/pages/loginModule/login.html";
    })()
};

//协议对象
window.Agreement={
    //检测数据合法性
    check:function(_json,_onErrorCallback){
        if(!_json || !(typeof(_json)==="object") || !("status" in _json)){
            if(typeof(_onErrorCallback)==="function"){
                _onErrorCallback("错误的数据格式");
            }
            return false;
        }
        if(_json.status==="success"){
            return true;
        }else if(_json.status==="login"){
            return !!Agreement.toLogin();
        }else if(_json.status==="error"){
            if(typeof(_onErrorCallback)==="function"){_onErrorCallback(_json.message); return false;}
        }else{
            if(typeof(_onErrorCallback)==="function"){_onErrorCallback("无错误的协议格式"); return false;}
        }
        return true;
    },
    //执行登录操作
    toLogin:function(){
        document.close();
        var wd = window;
        while(wd.top != wd.self){
            wd = wd.top;
        }
        wd.location.href = WebConfig.LoginUrl2;
        //document.location.replace(WebConfig.loginUrl+"?backModule=" +(typeof(currentModule)!=="undefined"?currentModule:"")+"&backUrl="+encodeURIComponent(document.location));//登录跳转
    },

    getWebsocket:function(_loginStartCallback,_loginCompleteCallback){
        if(typeof(MyWebSocket)==="undefined"){throw "未引入脚本MyWebSocket.js";}
        var websocket=new MyWebSocket(WebConfig.websocketUrl,'_DCFWPLATFORM_');
        var storage = window.sessionStorage;

        var userData=  {username:storage.getItem("userName")};

        websocket.onopen=function(){

            if(typeof(_loginCompleteCallback)==="function"){
                _loginCompleteCallback.call(websocket,userData);
            }
        }
        websocket.onclose=function(e){
            if(e.reason != "") alert(e.reason);

            return //!!Agreement.toLogin();
        }
        websocket.onerror=function(){
            return //!!Agreement.toLogin();
        }

        if(typeof(userData)==="object"){
            websocket.connect();
        }else{
            return //!!Agreement.toLogin();
        }
        return websocket;
    }
};
