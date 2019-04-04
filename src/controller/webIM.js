layui.define(function (exports) {

    friends = [];
    var groupList =[];

    var userData = JSON.parse(window.sessionStorage.getItem("userData"));
    // console.log(userData);
    layui.use('layim', function (layim) {
        var $ = layui.$;

        $.ajax({
            url: CDdata.server+CDdata.api.getUserList+userData.userName,
            type: "get",
            dataType: "json",
            success: function (response) {
                var _list = response.data.list;
                for (var index = 0; index < _list.length; index++) {
                    var friendNode = {};
                    friendNode.id = _list[index].id;
                    friendNode.username = _list[index].username;
                    friendNode.avatar = "/src/style/res/微信图片_20181210105316.png";
                    // if( _list[index].state == false ){
                    //     friendNode.status = "offline";
                    // }else {
                    //     friendNode.status = "online";
                    // }
                    friends.push(friendNode);
                }
                createWebSocket(wsUrl);
            }
        });
        
        var _data = {
            fromUser: userData.userName,
            message: "",
            messageDateTime: getNowDate(),
            toUser: userData.userName
        };
        
        // var url = "ws:192.168.1.130:9001";
        // 初始化一个 WebSocket 对象
        var lockReconnect = false;//避免重复连接
        var wsUrl = 'ws:192.168.1.103:9001';
        
        function createWebSocket(url) {
            try {
                socket = new WebSocket(url);
                initEventHandle();
            } catch (e) {
                reconnect(url);
            }     
        }

        function initEventHandle() {
            socket.onclose = function () {
                reconnect(wsUrl);
            };
            socket.onerror = function () {
                reconnect(wsUrl);
            };
            socket.onopen = function () {
                var i = setInterval(function(){
                    socket.send(JSON.stringify({
                        data: _data,
                        state: 0
                    }));
                    clearInterval(i);
                },100)
                
                //心跳检测重置
                heartCheck.reset().start();
            };
            socket.onmessage = function (event) {

                var received_msg = JSON.parse(event.data);
                // console.log("数据已接收...");
                // debugger
                var _type = null;
                if (received_msg.state == 1) {
                    layim.getMessage({
                        username: received_msg.data.fromName //消息来源用户名
                        ,avatar: "/src/style/res/微信图片_20181210105316.png" //消息来源用户头像
                        ,id: received_msg.data.fromUser //消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
                        ,type: "friend" //聊天窗口来源类型，从发送消息传递的to里面获取
                        ,content: received_msg.data.message //消息内容
                        ,cid: "" //消息id，可不传。除非你要对消息进行一些操作（如撤回）
                        ,mine: false //是否我发送的消息，如果为true，则会显示在右方
                        ,fromid: received_msg.data.fromUser //消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
                        ,timestamp: received_msg.data.messageDateTime //服务端时间戳毫秒数。注意：如果你返回的是标准的 unix 时间戳，记得要 *1000
                    });
                } else if (received_msg.state == 2) {
                    layim.addList({
                        type: 'group'
                        ,avatar: "/src/style/res/group1.png"
                        ,groupname: received_msg.data.roomName
                        ,id: received_msg.data.roomID
                    })
                } else if (received_msg.state == 3) {
                    layim.getMessage({
                        username: received_msg.data.fromName,
                        avatar: "/src/style/res/微信图片_20181210105316.png",
                        id: received_msg.data.toUser,
                        type: 'group',
                        content: received_msg.data.message,
                        cid: "",
                        mine: false,
                        fromid: received_msg.data.fromUser,
                        timestamp: received_msg.data.messageDateTime
                    });
                } else if (received_msg.state == 6){
                    var _roomData = received_msg.data.roomList;
                    var _onList = received_msg.data.onLoadUserList;

                    for(var i = 0; i<_roomData.length; i++){
                        var groupNode = {};
                        $.each(_roomData[i],function(key,item){
                            if(key == "roomName"){
                                groupNode.groupname = item;
                            } else if (key == "roomID"){
                                groupNode.id = item;
                                groupNode.avatar = "/src/style/res/group1.png";
                            }
                        })
                        if(JSON.stringify(groupNode) !== "{}"){
                            groupList.push(groupNode);
                        }
                    }
                    for(var i = 0; i<friends.length; i++){
                        for(var n = 0; n < _onList.length; n++){
                            if(friends[i].id == _onList[n]){
                                friends[i].status = "online";
                            } else{
                                friends[i].status = "offline";
                            }
                        }
                    }
                    // debugger
                    layimAction(friends,groupList);
                } else if (received_msg.state == 7){
                    layim.setFriendStatus(received_msg.data, 'online');
                } else if (received_msg.state == 8){
                    // debugger
                    layim.setFriendStatus(received_msg.data, 'offline');
                }

                
                //如果获取到消息，心跳检测重置
                //拿到任何消息都说明当前连接是正常的
                heartCheck.reset().start();
            }
        }

        function reconnect(url) {
            if(lockReconnect) return;
            lockReconnect = true;
            //没连接上会一直重连，设置延迟避免请求过多
            setTimeout(function () {
                createWebSocket(url);
                lockReconnect = false;
            }, 2000);
        }

        
        //心跳检测
        var heartCheck = {
            timeout: 60000,//60秒
            timeoutObj: null,
            serverTimeoutObj: null,
            reset: function(){
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                return this;
            },
            start: function(){
                var self = this;
                this.timeoutObj = setTimeout(function(){
                    //这里发送一个心跳，后端收到后，返回一个心跳消息，
                    //onmessage拿到返回的心跳就说明连接正常
                    socket.send('{"data": null,"state": -1}');
                    self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                        socket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                    }, self.timeout)
                }, this.timeout)
            }
        }

        // createWebSocket(wsUrl);

        function layimAction(_friends,_groups){
            console.log(_friends);
            groupList=[];
        //基础配置
        layim.config({
            
            members: {
                url: CDdata.server+CDdata.api.getRoomUser
            }

            ,init: {
                mine: {
                    username: userData.realName //我的昵称
                    ,id: userData.userName //我的ID
                    ,avatar: "/src/style/res/微信图片_20181210105316.png"
                },
                friend: [{
                    list: _friends
                }],
                group: _groups
            },
            min: false,
            title: "聊天室"
            // ,chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html'

        });
        }

        //取消拖拽
        $(".layui-layer-title").unbind("mousedown");
        $(".layui-layer-title").css("cursor", "default");
        //将通讯主面板的阴影去掉
        // $(".layer-anim-02").css("box-shadow","none");
        //将多出的new去掉
        // $(".layim-msg-status").html("");

        layim.on('sendMessage', function (res) {
            var mine = res.mine; //包含我发送的消息及我的信息
            var to = res.to; //对方的信息
            // debugger
            if (to.type == "friend") {
                socket.send(JSON.stringify({
                    data: {
                        fromUser: mine.id,
                        message: mine.content,
                        messageDateTime: getNowDate(),
                        toUser: to.id,
                        fromName: mine.username
                    },
                    state: 1
                }));
            } else if (to.type == "group") {
                socket.send(JSON.stringify({
                    data: {
                        fromName: mine.username,
                        fromUser: mine.id,
                        message: mine.content,
                        messageDateTime: getNowDate(),
                        toUser: to.id
                    },
                    state: 3
                }));
            }

        })

    });

    function getNowDate() {
        var date = new Date();
        var sign1 = "-";
        var sign2 = ":";
        var year = date.getFullYear() // 年
        var month = date.getMonth() + 1; // 月
        var day = date.getDate(); // 日
        var hour = date.getHours(); // 时
        var minutes = date.getMinutes(); // 分
        var seconds = date.getSeconds() //秒
        // 给一位数数据前面加 “0”
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds;
        return currentdate;
    }

    exports('webIM', {});
})