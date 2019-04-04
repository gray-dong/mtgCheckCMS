layui.define(function(exports){

    // var websocket;

    var fullScreen,orderByNavSelect,topMenuBar,toolbar,searchAttID;
    var userData={};

    var legendInfoSZ=null;
    var legendInfoXZ=null;
    function initWebPage(){
        Agreement.getWebsocket(function(){
    
        },function(_userdata){
            userData=_userdata;
            //this指向websocket；_userdata指向用户信息{username,password,usertoken}
            var storage = window.sessionStorage;

            userData=  {username:JSON.parse(storage.getItem("userData")).userName};
            websocket=this;//接下来的websocket就用它
    
            if(typeof(initWebPageAfter)==="function"){initWebPageAfter();}
    
            topMenuBar = new TopMenuBar();
            fullScreen = new FullScreen();
            orderByNavSelect = new OrderByNavSelect();
            toolbar = new ToolBar();
            searchAttID = new SearchAttID();
    
        });
    
        var realName = window.sessionStorage.getItem("realName");
        $(".userMessage span").text(realName);
    
        legendInfoSZ=new LegendInfo('legendSZ');
        legendInfoXZ=new LegendInfo('legendXZ');
    
        $(".legendBox.legendSZ .legendBtn").bind("click",function(){
            if(typeof(CallbackForLegend)==="function"){
                var dataList=CallbackForLegend('legendSZ');
                legendInfoSZ.setData(dataList);
                legendInfoSZ.show();
            }
        });
        $(".legendBox.legendXZ .legendBtn").bind("click",function(){
            if(typeof(CallbackForLegend)==="function"){
                var dataList=CallbackForLegend('legendXZ');
                legendInfoXZ.setData(dataList);
                legendInfoXZ.show();
            }
        });
    
        $(".regionBox .legendBtn").bind("click",function(){
            $('.bodyContent div.regionControl,.bodyContent div.locateControl').toggle();
    
        });
    
    };

    //组件引用
    var form, laydate,$,admin,view;
    layui.use(['element','form','laydate'], function(){
        //var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
        $ = layui.$;
        form = layui.form;
        admin = layui.admin;
        view = layui.view;
        laydate = layui.laydate;

        $(initWebPage);
    });

    //台账定位
    function SearchAttID() {
        var node = $(".attIDSearch");
        var content = this;

        this.getEnv = function () {
            var attid = node.find(".searchText").val();
            var tZType = $("input[name='tZType']:checked").val();
            if (tZType == undefined){
                layer.msg("请选择类型！" ,{time:1500,icon:2});
                return false;
            }
            if (attid == "") return false;

            websocket.send("TZLoaction", {location:{AttID:attid,TZType:tZType}},function (response) {
                if(response.status=="success" && response.data !== "") {
                    if(typeof (CallbackLocation)  == 'function'){CallbackLocation(response.data)};
                }
            });
        }
        node.find(".searchBtn").bind("click",content.getEnv);
    }

    function TopMenuBar(){
        var node = this.node = $(".topNav");
        var layerControl = $(".layerControl");
        var editLayerControl = $(".editLayerControl");
        node.find(".tool_tools").click(function(){
            if(!$(this).hasClass("active")){
                layerControl.show();
                editLayerControl.hide();
                $(this).siblings().removeClass("active");
            }else{
                layerControl.hide();
            }

            $(this)[$(this).hasClass("active")?"removeClass":"addClass"]("active");
        });
        node.find(".edit_tools").click(function(){
            if(!$(this).hasClass("active")){
                console.log($(this).hasClass("active"));
                editLayerControl.show();
                layerControl.hide();
                $(this).siblings().removeClass("active");
            }else{
                editLayerControl.hide();
            }

            $(this)[$(this).hasClass("active")?"removeClass":"addClass"]("active");
        });
    }
    function FullScreen(){
        var content=this;
        var node=this.node=$(".toolbar");
        node.find(".tool_full").bind("click",function(event){
            if(typeof(CallbackFullscreen) === "function"){
                CallbackFullscreen();
            }
        });
    
    };
    //北京图层切换
    function OrderByNavSelect(){
        var content=this;
        var node=this.node=$(".layerControl,.regionControl,.editLayerControl");

        var node2 = this.node2 = $(".regionControl");

        function onOrderNodeClick(event){
            var iNode=$(this).find("i");
            if(iNode.hasClass("icon-oksquared")){
                iNode.removeClass("icon-oksquared").addClass("icon-square");
                $(this).removeClass("selectNode");
            }else{
                iNode.removeClass("icon-square").addClass("icon-oksquared");
                $(this).addClass("selectNode");
            }
            
            //影像
            if(node.find("#mbjImage i").hasClass("icon-oksquared")){
                mbjImageLayerCon(true);
            }else{
                mbjImageLayerCon(false);
            }
            //影像500
            if(node.find("#mbj500Image i").hasClass("icon-oksquared")){
                // console.log(1);
                mbj500ImageLayerCon(true);
            }else{
                // console.log(0);
                mbj500ImageLayerCon(false);
            }

            if(node.find("#overlayPolygonLayer i").hasClass("icon-oksquared")){
                overlayPolygonLayerCon(true);
            }else{
                overlayPolygonLayerCon(false);
            }

            if(node.find("#overlayPolygonLayerXZ i").hasClass("icon-oksquared")){
                // console.log(1);
                overlayPolygonLayerXZCon(true);
            }else{
                // console.log(0);
                overlayPolygonLayerXZCon(false);
            }

            if(node.find("#fwLayer i").hasClass("icon-oksquared")){
                // console.log(1);
                fwLayerCon(true);
            }else{
                // console.log(0);
                fwLayerCon(false);
            }

            if(node.find("#bjEnvLayer i").hasClass("icon-oksquared")){
                bjEnvLayerCon(true);
            }else{
                bjEnvLayerCon(false);
            }

            if(node.find("#GHLKXLayer i").hasClass("icon-oksquared")){
                GHLKXLayerCon(true);
            }else{
                GHLKXLayerCon(false);
            }

            if(node.find("#mtgLayer i").hasClass("icon-oksquared")){
                mtgLayerCon(true);
            }else{
                mtgLayerCon(false);
            }
            

            if($(this)[0].id == 'selectAllRegion' && $(this).hasClass('selectNode')){
                node2.find("div.orderByNavSelectNode").each(function(){
                    var tagname = $(this).data('tagname');
                    if(tagname != null){
                        $(this).find("i").removeClass("icon-square").addClass("icon-oksquared");
                        $(this).addClass("selectNode");
                    }

                });
            }

            if($(this)[0].id == 'DeselectAllRegion' && $(this).hasClass('selectNode')){
                node2.find("div.orderByNavSelectNode").each(function(){
                    var tagname = $(this).data('tagname');
                    if(tagname != null){
                        $(this).find("i").removeClass("icon-oksquared").addClass("icon-square");
                        $(this).removeClass("selectNode");
                    }

                });
            }

            // switchvisibleregion();
        }
        function initEvent(){
            node.find(".orderByNavSelectNode i").removeClass("icon-oksquared").addClass("icon-square");
            node.find(".orderByNavSelectNode").bind("click",onOrderNodeClick);
            // node.find(".orderByNavSelectNode").eq(0).trigger("click");
            node.find("#selectAllRegion").trigger("click");
            node.find("#mbj500Image").trigger("click");
            node.find("#bjEnvLayer").trigger("click");
            node.find("#mtgLayer").trigger("click");

        }
        initEvent();
    }

    //工具条
    function ToolBar() {
        var toolBtns = $(".toolBtn button");
        toolBtns.on("click",function (event) {
            var value = this.innerHTML;
            if(typeof(CallbackToolBtn)==="function"){
                CallbackToolBtn(value);
            }
        })
    }


    //图例
    function LegendInfo(className){
        var content=this;
        this.node=$(".legendInfo"+"."+className);
        //显示
        this.show=function(){
            this.node.removeClass("animated bounceOutDown bounceUp").addClass("animated bounceUp").removeClass("hide");
        };
        //隐藏
        this.hide=function(){
            this.node.removeClass("animated bounceOutDown bounceUp").addClass("animated bounceOutDown");
        };
        var LegendData=function(_config){
            var node=$("<div>").append('<span class="color"></span><span class="name"></span>').addClass("legendList");
            this.color=function(_value){
                var color=_value.toString();
                node.find(".color").css("background-color","rgba("+color+")");
            };
            this.name=function(_value){
                node.find(".name").text(_value);
            };
            this.setConfig=function(_data){
                this.color(_data.color);
                this.name(_data.name);
            };
            this.appendTo=function(_jq){
                $(_jq).append(node.get(0));
            };
            this.setConfig(_config);
        };
        //添加图例
        this.setData=function(_dataList){
            if(_dataList && _dataList instanceof Array){
                this.node.find(".legendListBox").empty();
                for(var i=0;i<_dataList.length;i++){
                    var legendData=new LegendData(_dataList[i]);
                    legendData.appendTo(this.node.find(".legendListBox"));
                }
            }
        };
        function initEvent(){
            content.node.find(".closeSpreadBox").bind("click",function(){
                content.hide();
            });
        }
        initEvent();
    }

    function attrDetail(_data) {
        //详情模板
        // var data = obj.data;
            

        admin.popup({
            title: '台账详情'
            ,area: ['900px', '650px']
            ,shade: 0.3
            ,anim: 0
            ,move: false
            ,id: 'LAY-attrDetail'
            ,yes: function(){
                
            }
            ,zIndex: layer.zIndex //重点1
            ,success: function(layero){
                // debugger
                view(this.id).render('entry/accEntry').done(function(){
                    layui.use('laytpl', function(){
                        var laytpl = layui.laytpl;
                        var getTpl = entry.innerHTML
                            ,entryFrame = document.getElementById('entryFrame');
                            laytpl(getTpl).render(_data, function(html){
                                entryFrame.innerHTML = html;
                        });
                    });
                    layui.use(['laydate','form'], function(){
                        var $ = layui.$;
                        var form = layui.form;
                        var laydate = layui.laydate;
                        form.render();
                
                        var check = document.getElementById("checkboxID").checked;
                        var x;
                        if(check == true) {
                            x = '1';
                        } else {
                            x = '0';
                        }
                
                        laydate.render({
                            elem: '#build_time' //指定元素
                        });
                
                        form.val('example', {
                            "attID": _data.SZData.attID // "name": "value"
                        });

                        form.on('submit(demo1)', function(obj){
                            debugger
                            console.log(obj.field);
                            $.ajax({
                                url: CDdata.Nserver + CDdata.api.tzEntry,
                                type: "post",
                                dataType: "json",
                                data:JSON.stringify($.extend(obj.field, {space_coordinate:"",housetop_occupy_area : x})),
                                success: function (response) {
                                    debugger
                                }
                            })
                
                            return false;
                        })

                        imgList();
                        addImgEvent();
                        imgEdit();
                        imgDelete();
                    })

                });

            }
        });
    }

    //图片浏览
    function imgList() {
        var img = $("#safeCheckApplyImgDataBox img");
        img.load(function(){
            var boxWidth=93-2;
            var boxHeight=130-2;
            var imgHeight=isNaN(parseInt(this.height))?0:parseInt(this.height);
            var imgWidth=isNaN(parseInt(this.width))?0:parseInt(this.width);
            var scale=boxHeight/imgHeight;
            var scaleWidth=imgWidth*scale;
            if(scaleWidth<boxWidth){
                imgHeight=boxHeight;
                imgWidth=scaleWidth;
            }else{
                imgHeight=imgHeight*(boxWidth/imgWidth);
                imgWidth=boxWidth;
                $(this).css("margin-top",boxHeight/2-imgHeight/2 +"px");
            }
            $(this).width(imgWidth).height(imgHeight).removeClass("hide");
        });
        
        $("#safeCheckApplyImgDataBox").viewer('destroy');
        var view = $("#safeCheckApplyImgDataBox").viewer({
            url: 'data-original',
            zIndex:99999999,
            navbar:false,
            title:false,
            rotatable:false,//旋转
            scalable:false,//翻转
            transition:false,//css3
            fullscreen:false//播放时全屏。
        });
    }

    //添加
    function addImgEvent() {
        $(".wyps").click(function () {
            uploadImg("0");
        });
        $(".cqzp").click(function () {
            uploadImg("0");
        });
        $(".cebg").click(function () {
            uploadImg("0");
        });
        // $("#btnfile").click(function () { 
        //     uploadImg("1");
        // })
        $(".addFile").click(function(){
            uploadImg("1");
        });

        function uploadImg(pictype) {

            if(pictype == 1){
                var btnfile = document.getElementById('btnfile');
                btnfile.addEventListener('change', function() {
                    
                    if (this.files.length === 0)return;
                    var attID = $(".attrId").val();
                    var t_files = this.files[0];
                    var path = window.URL.createObjectURL(t_files);

                    upLoadPicOrFile(pictype,btnfile,attID,t_files);

                }, false);
            } else if(pictype == 0){
                document.getElementById("fileToUpload").click();
                var testFile = document.getElementById('fileToUpload');
                testFile.addEventListener('change', function() {
                    if (this.files.length === 0)return;
                    var attID = $(".attrId").val();
                    var t_files = this.files[0];
                    // var path = window.URL.createObjectURL(t_files);

                    upLoadPicOrFile(pictype,testFile,attID,t_files);

                }, false);
            }
        }

    }

    function upLoadPicOrFile(pictype,fileInput,attID,t_files){
        // $.ajax({
        //     url:"http://192.168.1.120:2663/mtg/xin/uploadFiles.ashx?&attID=" + attID + "&type=" + pictype,
        //     type: "POST",
        //     dataType: "json",
        //     data:t_files,
        //     processData: false,
        //     contentType: false,
        //     async: false,
        //     success: function (_json) {

                if(pictype == 0){
                    var path = window.URL.createObjectURL(t_files);
                    var _html = "<div class=\"safeCheckApplyImgBoxFrame\">\n" +
                        "<div class=\"safeCheckApplyImgBox\">\n" +
                        "<img class=\"safeCheckApplyImgBoxImg\" src=\""+path+"\" data-original=\""+path+"\"/>\n" +
                        "</div>\n" +
                        "<div class=\"footer-buttons\">\n" +
                        "<button type=\"button\" class=\"imageEdit\" title=\"替换\"><i class=\"iconfont icon-pencil\"></i></button>\n" +
                        "<button type=\"button\" class=\"imageDel\" title=\"删除\"><i class=\"iconfont icon-trash\"></i></button>\n" +
                        "</div>\n" +
                        "<input type=\"file\" name=\"imgUpload\" accept=\"image/jpeg\" style=\"opacity: 0\">\n" +
                        "</div>";

                    $(".addClick").before(_html);
                    fileInput.outerHTML = fileInput.outerHTML;

                    imgList();
                    imgEdit();
                    imgDelete();
                    
                } else {
                    var fileList = $(".fileList");
                    var fileHtml = '<div class="fileName" lay-data="'+ t_files.name +'"><span>'+ t_files.name +'</span><span class="delBtn" lay-data="'+ t_files.name +'"> 删除 </span></div>';

                    fileList.append(fileHtml);

                    fileList.css('display', "");

                    fileInput.outerHTML = fileInput.outerHTML;

                    fileDel();
                } 
                
        //     },
        //     error: function (e1,e2,e3) {

        //     }
        // })
    }

    // 文件删除
    function fileDel(){
            
        $(".delBtn").bind("click",function(){
            console.log(this);
            var fileName = $(this).attr('lay-data');
            
            // $.ajax({
            //     url:"http://192.168.1.88:8888/deleteEmailFile.ashx",
            //     type:"post",
            //     dataType:"json",
            //     data:JSON.stringify({
            //         "fromUser":"donglr@jzht.com",
            //         "toUser":"renyx@jzht.com",
            //         "eTitle":"",
            //         "eText":"",
            //         "eFiles":"",
            //         "eAddress":"",
            //         "passWord":"",
            //         "eCount":"",
            //         "eFileName":fileName
            //     }),
                // success:function(_json){
                    $(this).parent().remove();                                    
            //     },error:function(e1,e2,e3){

            //     }
            // });
            
        })
    }

    //替换
    function imgEdit() {

        var imgNode = $(".safeCheckApplyImgBoxFrame");
        imgNode.find(".imageEdit").unbind("click");
        imgNode.find(".imageEdit").bind("click",function () {
            var attID = $(".attrId").val();
            var src = $(this).parents(".safeCheckApplyImgBoxFrame").find(".safeCheckApplyImgBoxImg")[0].src;
            var index = src .lastIndexOf("\\");
            var imgName  = src .substring(index + 1, src .length);

            var imgupload = $(this).parents(".safeCheckApplyImgBoxFrame").find("input");
            imgupload.click();

            var imgFile = imgupload[0];
            $(imgFile).one('change', function() {
                if (this.files.length === 0)return;
                var t_files = this.files[0];
                var path=window.URL.createObjectURL(t_files);
                var imgInput = this;

                $.ajax({
                    url:CDdata.dataCheck + CDdata.api.thtp+"&filepath=" + imgName + "&AttID=" + attID,
                    type: "POST",
                    dataType: "json",
                    data:t_files,
                    processData: false,
                    contentType: false,
                    async: false,
                    success: function (_json) {
                        if (_json.status=="success"){
                            $(imgInput).parents(".safeCheckApplyImgBoxFrame").find("img").attr("src",path);
                            $(imgInput).parents(".safeCheckApplyImgBoxFrame").find("img").attr("style","");
                            imgFile.outerHTML = imgFile.outerHTML;
                        }
                    },
                    error: function (e1,e2,e3) {

                    }
                })

            });
            imgList();
        });
    }

    //删除
    function imgDelete() {
        var attId = $(".attrId").val();
        var imgNode = $(".safeCheckApplyImgBoxFrame");
        imgNode.find(".imageDel").unbind("click");
        imgNode.find(".imageDel").click(function () {
            var src = $(this).parents(".safeCheckApplyImgBoxFrame").find(".safeCheckApplyImgBoxImg")[0].src;
            // var index = src .lastIndexOf("\\");
            // imgName  = src .substring(index + 1, src .length);
            // $(this).parents(".safeCheckApplyImgBoxFrame").remove();

            var imgDel = $(this);
            websocket.send("DellPic",{PicPath:src},function (response) {
                if(response.status=="success"){
                    imgDel.parents(".safeCheckApplyImgBoxFrame").remove();
                }
            });
        });
    }

    
    /** interiorAction*/
    //页面初始化之前执行
    var zttsetting = null;
    // var locatedataqxj=null;
    // var locatedataxzj=null;
    var hasright = null;
    
    function initWebPageAfter() {

        websocket.send("JsonGetAllZTTSettingRequest",userData,function (response) {
            zttsetting = response.data;
        });

        // websocket.send("JsonGetAllQXJRequest",userData,function (response) {
        //     locatedataqxj = response.data;
        // });

        // websocket.send("JsonGetAllXZJRequest",userData,function (response) {
        //     locatedataxzj = response.data;
        // });

        //页面初始化之后执行
        //地图容器ID是  mapContent
        //$("#mapContent").append(DomElement);这个地方放地图Dom元素

        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && zttsetting != null
                    && userData != null) {
                    clearInterval(i);

                    // $.ajax({
                    //     url:'http://dsfhy.s3.natapp.cc' +"/userInfo.ashx?fun=checkSuperManager&userName=" + userData.username,
                    //     type:"get",
                    //     data:'',
                    //     dataType:"json",
                    //     success:function(_json){
                    //         hasright = _json.success;
                            initMap();
                    //     },error:function(e1,e2,e3){

                    //     }
                    // });
                }
            },
            50
        );
    }

    var legendsetting={};
    legendsetting.legendSZ = [];
    legendsetting.legendXZ = [];
    function CallbackForLegend(className) {
        return legendsetting[className];
    }


    //全屏按钮
    function CallbackFullscreen() {
        mapFullScreen();
    }

    //背景图层
    
    function mbjImageLayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (mbjImageLayer) == 'object') {
                    clearInterval(i);
                    layerCon(mbjImageLayer,flag);
                }
            },
            300
        );

    }
    function mbj500ImageLayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (mbj500ImageLayer) == 'object') {
                    clearInterval(i);
                    layerCon(mbj500ImageLayer,flag);
                }
            },
            300
        );

    }

    function overlayPolygonLayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (overlayPolygonLayer) == 'object') {
                    clearInterval(i);
                    layerCon(overlayPolygonLayer,flag);
                }
            },
            300
        );

    }

    function overlayPolygonLayerXZCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (overlayPolygonLayerXZ) == 'object') {
                    clearInterval(i);
                    layerCon(overlayPolygonLayerXZ,flag);
                }
            },
            300
        );

    }

    function fwLayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (fwLayer) == 'object') {
                    clearInterval(i);
                    layerCon(fwLayer,flag);
                }
            },
            300
        );

    }


    function bjEnvLayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (bjEnvLayer) == 'object') {
                    clearInterval(i);
                    layerCon(bjEnvLayer,flag);
                }
            },
            300
        );

    }

    function GHLKXLayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (ghlkxLayer) == 'object') {
                    clearInterval(i);
                    layerCon(ghlkxLayer,flag);
                }
            },
            300
        );

    }

    function mtgLayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (mtgLayer) == 'object') {
                    clearInterval(i);
                    layerCon(mtgLayer,flag);
                }
            },
            300
        );

    }

    

    function CallbackToolBtn(_value) {
        toolBars(_value);
    }

    function CallbackLocation(_env) {
        locationPolygon(_env);
    }




    /**interior_gis */ 
    /**
     * Created by Madman on 2018/03/26.
     **/

    // var mbj500Image = "http://jzhtmap.s3.natapp.cc/arcgis/rest/services/InSiHuanQDR/MapServer";//北京500影像
    var mbjImage = "http://jzhtmap.s3.natapp.cc/arcgis/rest/services/AllBJMapIma/MapServer?token=9WRiK81q9QCFTo-9P0i06r4TEYXIsap86PuwlKadB3ipPGalV5FX_XC2F5c1CkNS"; //北京影像
    var mbj500Image = "http://jzhtmap.s3.natapp.cc/arcgis/rest/services/AllBJMapIma/MapServer?token=9WRiK81q9QCFTo-9P0i06r4TEYXIsap86PuwlKadB3ipPGalV5FX_XC2F5c1CkNS"; //北京影像
    var mbj500Image = 'http://192.168.1.123/fileservice/services/MTGImage/MapServer';
    
    var map;

    // mbj500Image = "http://dsfhy.s3.natapp.cc/fileservice/services/InSiHuanQDR/MapServer";//北京500影像
    // mbjImage = "http://dsfhy.s3.natapp.cc/fileservice/services/AllBJMapIma/MapServer"; //北京影像
    // image10000 = "http://dsfhy.s3.natapp.cc/fileservice/services/2017_10000_QDR/MapServer";//北京地形10000
    // image2000 = "http://dsfhy.s3.natapp.cc/fileservice/services/2017_2000_QDR/MapServer";//北京地形2000
    // image500 = "http://dsfhy.s3.natapp.cc/fileservice/services/2017_500_QDR/MapServer";//北京地形500
    
    var fwLayer;
    var overlayPolygonLayer;
    var overlayPolygonLayerXZ;
    var bjEnvLayer;
    var ghlkxLayer;
    var mtgLayer;


    var mapOverlayContent={};
    mapOverlayContent.attID='台账号';
    mapOverlayContent.county='行政区';
    mapOverlayContent.town='街道/乡/镇';
    mapOverlayContent.vilage='社区/行政村';
    mapOverlayContent.areBld='外业建设面积';
    mapOverlayContent.areUse='外业占地面积';
    mapOverlayContent.illTyp='违建空间位置类型';
    mapOverlayContent.usePro='使用性质';
    mapOverlayContent.usePrD='使用性质说明';
    mapOverlayContent.addTim='图斑建立时间';
    mapOverlayContent.isSame='与原台帐是否一致';
    mapOverlayContent.itname='项目地址';
    mapOverlayContent.itplace='项目名称';
    mapOverlayContent.sbareabuil='上报建设面积';
    mapOverlayContent.sbareause='上报占地面积';
    mapOverlayContent.zuoyeyuan='作业员';
    mapOverlayContent.zhirenren='指认人';
    mapOverlayContent.zrrdianhua='指认人电话';
    mapOverlayContent.beizhu='备注';
    mapOverlayContent.zytime='作业时间';
    mapOverlayContent.szbg='四至变更';
    mapOverlayContent["内业备注"]='内业备注';
    mapOverlayContent.fpoput='疏散人口';
    mapOverlayContent.sffjrd='是否分局认定';
    mapOverlayContent.lbzl='是否涉及留白增绿';
    mapOverlayContent.lhbm='负责绿化部门';
    mapOverlayContent.statevalue='调整后台账状态';
    mapOverlayContent.hyfl='核验类型';
    mapOverlayContent.yuanyin='原因';
    mapOverlayContent.qtjsj='区提交时间';
    mapOverlayContent.state='状态';

    var maplocateContent={};
    maplocateContent.CC="CC码";
    maplocateContent.GB="国标码";
    maplocateContent.NAME="名称";
    maplocateContent.PAC="PAC码";
    maplocateContent.PRCTAG="PRC标志";

    var fwContent={};
    fwContent.最高楼层 = "最高楼层";


    var ztt={};
    var renderer={};

    var drawtool;
    var edittool;

    var oldgraph;

    var graphmapTZ={};
    var graphmapXZ={};
    var graphmapFW={};

    var CWHYPolygon;

    var CWHYGraphic;


    var maplocategrahic={};
    var alllocategraphic=[];

    var drawmethod = '';
    var targetobject=null;

    var tempsplitlayer;

    function DeepCopyGraph(graph){
        var gh = {};
        gh.attributes = deepcopy(graph.attributes);
        gh.geometry = deepcopy(graph.geometry);
        return gh;
    }

    //图层加载
    function initMap(){
        require([
                "esri/map",
                "esri/layers/ArcGISTiledMapServiceLayer",
                "esri/layers/ArcGISDynamicMapServiceLayer",
                "esri/layers/GraphicsLayer",
                "esri/layers/FeatureLayer",
                "esri/InfoTemplate",
                "esri/renderers/jsonUtils",
                "esri/graphic",
                "esri/geometry/Polygon",
                "esri/geometry/Point",
                "esri/geometry/Extent",
                "esri/SpatialReference",
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/symbols/SimpleFillSymbol",
                "esri/symbols/PictureMarkerSymbol",
                "esri/tasks/QueryTask",
                "esri/toolbars/navigation",
                "dojo/_base/Color",
                "dojo/_base/connect",
                "esri/toolbars/draw",
                "esri/toolbars/edit"
            ],
            function(Map,ArcGISTiledMapServiceLayer,ArcGISDynamicMapServiceLayer,GraphicsLayer,FeatureLayer,InfoTemplate,jsonUtil,Graphic,Polygon,Point,Extent,SpatialReference,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,PictureMarkerSymbol,QueryTask,Navigation,Color,connect,Draw,Edit){
                //定义一个map实体
                var startExtent = new esri.geometry.Extent(497097.30139490607,302257.42696142907, 510148.5952099937, 308200.25620958756,  new esri.SpatialReference({ "wkid":2436 }));
                map = new esri.Map("mapContent",{logo:false,slider:false});//,zoom:2, extent: startExtent
                //装载图层
                mbj500ImageLayer = new ArcGISTiledMapServiceLayer(mbj500Image);
                map.addLayer(mbj500ImageLayer);
                // mbjImageLayer = new ArcGISTiledMapServiceLayer(mbjImage);
                // map.addLayer(mbjImageLayer);
                // image10000Layer = new ArcGISTiledMapServiceLayer(image10000);
                // map.addLayer(image10000Layer);
                // image2000Layer = new ArcGISTiledMapServiceLayer(image2000);
                // map.addLayer(image2000Layer);
                // image500Layer = new ArcGISTiledMapServiceLayer(image500);
                // map.addLayer(image500Layer);

                
                
                bjEnvLayer = new GraphicsLayer();
                map.addLayer(bjEnvLayer);

                ghlkxLayer = new GraphicsLayer();
                ghlkxLayer.minScale = 3000;
                map.addLayer(ghlkxLayer);

                mtgLayer = new GraphicsLayer();
                mtgLayer.minScale = 3000;
                map.addLayer(mtgLayer);

                fwLayer = new GraphicsLayer();
                fwLayer.minScale = 3000;
                map.addLayer(fwLayer);
                var infoTemplateoverlayfw = new InfoTemplate("<i class='fa fa-fw fa-file'></i>详细信息", function click(fea) {
                    return clickInfoContent(fea);
                });

                

                overlayPolygonLayer = new GraphicsLayer();
                overlayPolygonLayer.minScale = 60000;
                map.addLayer(overlayPolygonLayer);
                var infoTemplateoverlay = new InfoTemplate("<i class='fa fa-fw fa-file'></i>详细信息", function click(fea) {
                    return clickInfoContentoverlay(fea);

                });

                overlayPolygonLayerXZ = new GraphicsLayer();
                overlayPolygonLayerXZ.minScale = 60000;
                map.addLayer(overlayPolygonLayerXZ);
                var infoTemplateoverlayXZ = new InfoTemplate("<i class='fa fa-fw fa-file'></i>详细信息", function click(fea) {
                    return clickInfoContentoverlay(fea);

                });

                CWHYPolygon = Polygon;
                CWHYGraphic = Graphic;


                fwLayer.setInfoTemplate(infoTemplateoverlayfw);

                overlayPolygonLayer.setInfoTemplate(infoTemplateoverlay);

                overlayPolygonLayerXZ.setInfoTemplate(infoTemplateoverlayXZ);


                tempsplitlayer = new GraphicsLayer();
                map.addLayer(tempsplitlayer);

                for(var index =0; index < zttsetting.length; index++){
                    var item = zttsetting[index];
                    ztt[item.NAME] = JSON.parse(item.DETAIL);
        
                    var ly = ztt[item.NAME];
                    renderer[item.NAME] = jsonUtil.fromJson(ly.drawingInfo.renderer);
                }

                // renderLayerShowXZ('销账数据');

                //创建地图操作对象
                navToolbar = new esri.toolbars.Navigation(map);

                drawtool = new Draw(map, {
                    tooltipOffset: 20,
                    drawTime: 90
                });
                
                edittool = new Edit(map,{
                    allowAddVertices:true,
                    allowDeleteVertices:true
                });
                //Combine tools 
                edittool.on("deactivate", function(evt) {
                    if(evt.info.isModified){
                        changetoMap(evt,Polygon,Graphic);
                    }
                });

                
                
                esri.bundle.toolbars.draw.addPoint = "单击以添加点";

                drawtool.on("draw-complete", function (evt){
                    $('.esriPopup').css('display','block');
                    if(drawmethod == '线打断面'){
                        toolBars('漫游', null);
                        if(targetobject.attributes.tzId != null)
                        {
                            websocket.send("JsonPolyLineSplitPolygonRequest",{polyline:evt.geometry,polygon:targetobject.geometry},function (response) {
                                if(response.status == 'error'){
                                layui.use(['layer'], function(){
                                    var layer = layui.layer;
                                    layer.msg(response.message,{time:1500,icon:5});    
                                });
                                return;
                                }
                                else if(response.status == 'success'){
                                    targetobject.hide();
                                    tempsplitlayer.clear();
                                    
                                    var tableobj = [];
                                    for(var i = 0; i < response.data.length; i++){
                                        var item = response.data[i];
                                        var geometry = new Polygon(item);
                                        var graphic = new Graphic(geometry);
                                        graphic.setAttributes({
                                            selected:false
                                        });
                                        tableobj.push({graphic:graphic,selected:false,id:i});
                                        tempsplitlayer.add(graphic);                                
                                    }
        
                                    var tablecontent = '<table id="rendersplit" lay-filter="test"></table>';
        
        
        
                                    layui.use(['layer','table'], function(){
                                        var layer = layui.layer;
                                        var table = layui.table;
                                        layer.open({
                                            shade:false,
                                            title:'选择台账号保留的面',
                                            content:tablecontent,
                                            yes:function(index, layero){
                                                //do something
                                                var checkednum = 0;
                                                for(var i = 0; i < tableobj.length; i++){
                                                    tableobj[i].graphic.attributes.selected = false;
                                                    if(tableobj[i].LAY_CHECKED == null){
                                                        continue;
                                                    }
                                                    if(tableobj[i].LAY_CHECKED){
                                                        tableobj[i].graphic.attributes.selected = true;
                                                        checkednum++;
                                                    }
                                                }  
                                                if(checkednum != 1){
                                                    layer.open({type:1,shade:false,content:'<center>选中的图形必须为一个！</center>',time:1500,icon:5,title:'提示',area: ['200px', '200px']
                                                , btn: ['确定'] });    
                                                    return false;
                                                }
        
                                                websocket.send("JsonSplitT_TZDataRequest",{TZID:targetobject.attributes.tzId,graphics:tableobj.map(function(dt){return {geometry:dt.graphic.geometry,attributes:dt.graphic.attributes};})},function (response1) {
                                                    if(response1.status=="success"){ 
                                                        targetobject.show();
                                                        tempsplitlayer.clear();
                                                        
                                                        for(var i = 0; i < response1.data.length; i++){
                                                            var item = response1.data[i];
                                                            var geometry = new Polygon(item.polygon);
                                                            var graphic = new Graphic(geometry);
                                                            graphic.setAttributes(item.T_TZData);
                                                            AddToGraphLayer(overlayPolygonLayer, graphmapTZ, graphic, "tzId");
                                                        }
        
        
                                                    }
                                
                                                });
        
                                                layer.close(index); //如果设定了yes回调，需进行手工关闭
                                            },
                                            cancel:function(index, layero){
                                                //do something
                                                targetobject.show();
                                                tempsplitlayer.clear();
                                                layer.close(index); //如果设定了yes回调，需进行手工关闭                                        
                                            },
                                            success: function(layero, index){
                                            var tableIns = table.render({
                                                elem: '#rendersplit'
                                                ,data: tableobj
                                                ,cols: [[ //表头
                                                {field: 'selected', title: '是否保留', fixed: 'left', type: 'checkbox'}
                                                ,{field: 'id', title: '图形序号', width:180}
                                                ]]
                                            });
                                            table.on('checkbox(test)', function(obj){
                                                for(var i = 0; i < tableobj.length; i++){
                                                    tableobj[i].graphic.attributes.selected = false;
                                                    if(tableobj[i].LAY_CHECKED == null){
                                                        continue;
                                                    }
                                                    if(tableobj[i].LAY_CHECKED){
                                                        tableobj[i].graphic.attributes.selected = true;
                                                    }
                                                }  
                                                tempsplitlayer.redraw();                          
                                            });  
                                            }
                                        });
        
                                        
                                    });
                                }
                            });
                        }
                        else if(targetobject.attributes.id != null && targetobject.attributes.最高楼层 != null){
                            websocket.send("JsonPolyLineSplitFWRequest",{polyline:evt.geometry,polygon:targetobject.geometry,attr:targetobject.attributes},function (response) {
                                if (response.status == 'error') {
                                    layui.use(['layer'], function () {
                                        var layer = layui.layer;
                                        layer.msg(response.message, {
                                            time: 1500,
                                            icon: 5
                                        });
                                    });
                                    return;
                                } else if (response.status == 'success') {
                                    for (var i = 0; i < response.data.length; i++) {
                                        var item = response.data[i];
                                        var geometry = new Polygon(item.polygon);
                                        var graphic = new Graphic(geometry);
                                        graphic.setAttributes(item.T_FW);
                                        AddToGraphLayer(fwLayer, graphmapFW, graphic, "id");
                                    }
                                }
                            });
                        }
                        
                        
                        return;
                    }
                    else if(drawmethod == '挖洞'){
                        toolBars('漫游', null);

                        var method = 'JsonPolyLineAddHolerequest';
                        var addme = {};
                        if(targetobject.attributes.tzId != null){
                            method = 'JsonPolyLineAddHolerequest';
                            addme = {TZID:targetobject.attributes.tzId};
                        }
                        else if(targetobject.attributes.id != null && targetobject.attributes.最高楼层 != null){
                            method = 'JsonPolyLineAddHoleFWrequest';
                            addme = {id:targetobject.attributes.id};
                        }
                        else if(targetobject.attributes.xzid != null){
                            method = 'JsonPolyLineAddHoleXZrequest';
                            addme = {XZID:targetobject.attributes.xzid};
                        }



                        websocket.send(method,$.extend({polyline:evt.geometry,polygon:targetobject.geometry},addme),function (response) {
                            if(response.status == 'error'){
                                layui.use(['layer'], function(){
                                    var layer = layui.layer;
                                    layer.msg(response.message,{time:1500,icon:5});
                                });
                                return;
                            }
                            else if(response.status == 'success'){
                                targetobject.show();
                                tempsplitlayer.clear();


                                var item = response.data;
                                var geometry = new Polygon(item.polygon);
                                var graphic = new Graphic(geometry);

                                if(targetobject.attributes.tzId != null){
                                    graphic.setAttributes(item.T_TZData);
                                    AddToGraphLayer(overlayPolygonLayer, graphmapTZ, graphic, "tzId");
                                }
                                else if(targetobject.attributes.id != null && targetobject.attributes.最高楼层 != null){
                                    graphic.setAttributes(item.T_FW);
                                    AddToGraphLayer(fwLayer, graphmapFW, graphic, "id");
                                }
                                else if(targetobject.attributes.xzid != null){
                                    graphic.setAttributes(item.T_XZData);
                                    AddToGraphLayer(overlayPolygonLayerXZ, graphmapXZ, graphic, "xzid");
                                }
                                            
                        }
                        });
                        
                        return;
                    }
                    
                    else if(drawmethod == "创建房屋"){
                        // addToMapFW(evt,Polygon,Graphic);
                    }
                    
                });

                map.on("extent-change",function (event) {
                    mapClickBuild(event,Polygon,Graphic);
                });

                var iterval = setInterval(function(){

                    var actionList = $('.esriPopup div.actionList');
                    if(actionList.length != 0){
                        var addhtml = '<a title="编辑节点" class="action editvertex cwhyaddlink" href="javascript:void(0);"><span>编辑节点</span></a><a title="编辑属性" class="action editattr cwhyaddlink" href="javascript:void(0);"><span>编辑属性</span></a>';

                        actionList.append(addhtml);

                        $('.esriPopup div.actionList .editvertex').click(function(){

                            var support = true;
                            if(map.infoWindow.features == null || map.infoWindow.selectedIndex < 0){
                                support = false;
                            }
                            var selectgraph;
                            if(support){
                                support = false;
                                var feat = map.infoWindow.features[map.infoWindow.selectedIndex];
                                if(feat.attributes != null){
                                    if(feat.attributes.tzId!=null || feat.attributes.xzid!=null || (feat.attributes.id != null && feat.attributes.最高楼层 != null)){
                                        support = true;
                                        selectgraph = feat;
                                    }
                                }
                            }
                        

                            if(!support){
                                layui.use(['layer'], function(){
                                    var layer = layui.layer;
                                    layer.msg('不支持当前层编辑！',{time:1500,icon:5});    
                                });
                                return;
                            }

                            if(feat.attributes.tzId != null){
                                if(feat.attributes.ProcessState == 2){
                                    if(!hasright){
                                        layui.use(['layer'], function(){
                                            var layer = layui.layer;
                                            layer.msg('对不起，您没有编辑这个图斑的权限！',{time:1500,icon:5});    
                                        });
                                        return;
                                    }
                                }
                                if(feat.attributes.ProcessState != 0 && feat.attributes.ProcessState != 2){
                                    {
                                        layui.use(['layer'], function(){
                                            var layer = layui.layer;
                                            layer.msg('对不起，您没有编辑这个图斑的权限！',{time:1500,icon:5});
                                        });
                                        return;
                                    }
                                }
                            }


                            oldgraph=DeepCopyGraph(selectgraph);
                            toolBars('编辑节点',selectgraph);
                            map.infoWindow.hide();
                        });

                        $('.esriPopup div.actionList .editattr').click(function(){

                            var support = true;
                            if(map.infoWindow.features == null || map.infoWindow.selectedIndex < 0){
                                support = false;
                            }
                            var selectgraph;
                            if(support){
                                support = false;
                                var feat = map.infoWindow.features[map.infoWindow.selectedIndex];
                                if(feat.attributes != null){
                                    // if(feat.attributes.tzId!=null || (feat.attributes.id != null && feat.attributes.最高楼层 != null)){
                                        support = true;
                                        selectgraph = feat;
                                    // }
                                }
                            }
                        

                            if(!support){
                                layui.use(['layer'], function(){
                                    var layer = layui.layer;
                                    layer.msg('不支持当前层编辑',{time:1500,icon:5});    
                                });
                                return;
                            }

                            // if(feat.attributes.tzId != null){
                            //     if(feat.attributes.ProcessState == 2){
                            //         if(!hasright){
                            //             layui.use(['layer'], function(){
                            //                 var layer = layui.layer;
                            //                 layer.msg('对不起，您没有编辑这个图斑的权限！',{time:1500,icon:5});    
                            //             });
                            //             return;
                            //         }
                            //     }
                            //     if(feat.attributes.ProcessState != 0 && feat.attributes.ProcessState != 2){
                            //         {
                            //             layui.use(['layer'], function(){
                            //                 var layer = layui.layer;
                            //                 layer.msg('对不起，您没有编辑这个图斑的权限！',{time:1500,icon:5});
                            //             });
                            //             return;
                            //         }
                            //     }
                            // }                        
                            //toolBars('编辑节点',selectgraph);

                            if(feat.attributes.attID != null){
                                oldgraph=DeepCopyGraph(selectgraph);
                                var data={};
                                data.SZData=selectgraph.attributes;
        
                                websocket.send("JsonWPLTest",{attID:data.SZData.attID},function (response) {
                                    if(response.status=="success"){
                                        for(var i = 0; i<response.data.list.length;i++){
                                            response.data.list[i] = "/src/style/res/template/character.jpg";
                                        }
                                        data.list = response.data.list;
                                        attrDetail(data);
                                    }
                                    else{
                                        data.list = [];
                                        attrDetail(data);
                                    }
                                });
                            }
                        
                            map.infoWindow.hide();
                        });

                        $('.esriPopup div.actionList .GetArea').click(function(){

                            var support = true;
                            if(map.infoWindow.features == null || map.infoWindow.selectedIndex < 0){
                                support = false;
                            }
                            var selectgraph;
                            if(support){
                                support = false;
                                var feat = map.infoWindow.features[map.infoWindow.selectedIndex];
                                if(feat.attributes != null){
                                    if(feat.attributes.tzId!=null || feat.attributes.xzid!=null){
                                        support = true;
                                        selectgraph = feat;
                                    }
                                }
                            }
                        

                            if(!support){
                                layui.use(['layer'], function(){
                                    var layer = layui.layer;
                                    layer.msg('不支持当前层编辑',{time:1500,icon:5});    
                                });
                                return;
                            }

                            if(feat.attributes.tzId != null){
                                if(feat.attributes.ProcessState == 2){
                                    if(!hasright){
                                        layui.use(['layer'], function(){
                                            var layer = layui.layer;
                                            layer.msg('对不起，您没有编辑这个图斑的权限！',{time:1500,icon:5});    
                                        });
                                        return;
                                    }
                                }
                                if(feat.attributes.ProcessState != 0 && feat.attributes.ProcessState != 2){
                                    {
                                        layui.use(['layer'], function(){
                                            var layer = layui.layer;
                                            layer.msg('对不起，您没有编辑这个图斑的权限！',{time:1500,icon:5});
                                        });
                                        return;
                                    }
                                }
                            }   
                            
                            websocket.send("JsonGetBuildingArearequest",{polygon:selectgraph.geometry},function (response) {
                                if(response.status=="success"){
                                    layer.msg(response.data + '',{time:1500,icon:1});
                                }
                                else{
                                    layer.msg(response.message,{time:1500,icon:5});
                                }
                            });
                                                    
                            map.infoWindow.hide();
                        });
                        
                        clearInterval(iterval);
                    }
                },500);

                overlayPolygonLayer.on("dbl-click", function (evt){
                    edittool.deactivate();
                });

                overlayPolygonLayerXZ.on("dbl-click", function (evt){
                    edittool.deactivate();
                });

                fwLayer.on("dbl-click", function (evt){
                    edittool.deactivate();
                });

                connect.connect(map.infoWindow,"onSelectionChange",function(){
                    if(map.infoWindow.features == null || map.infoWindow.selectedIndex < 0){
                        return;
                    }
                    var feat = map.infoWindow.features[map.infoWindow.selectedIndex];
                    $('.cwhyaddlink').hide();
                    if(feat.attributes != null){
                        if(feat.attributes.tzId!=null){
                            $('.cwhyaddlink').show();
                            $('.deleteFW.action').hide();
                        }

                        if(feat.attributes.id != null && feat.attributes.最高楼层 != null){
                            $('.editvertex.action').show();
                            $('.editattr.action').show();
                            $('.breakpolygon.action').show();
                            $('.addhole.action').show();
                            $('.deleteFW.action').show();
                        }

                        if(feat.attributes.xzid!=null){
                            $('.editvertex.action').show();
                            $('.editattr.action').show();
                            $('.addhole.action').show();
                            $('.GetArea.action').show();
                        }
                    }

                });

                
            });
    }


    function AddToGraphLayer(layer,graphmap,graph,mapfield){
        var key = graph.attributes[mapfield];
        if(graphmap[key] == null){
            graphmap[key] = graph;
            layer.add(graph);
        }
        else{
            graphmap[key].geometry = graph.geometry;
            graphmap[key].attributes = graph.attributes;
            graphmap[key].draw();
        }
    }


    function changetoMapNext(graphic,Polygon, Graphic){

        var funcname = 'JsonEditT_TZDataGeoRequest';

        if(graphic.attributes.ProcessState == 2 && hasright){
            funcname = 'JsonEditT_TZDataGeoLBZLRequest';
        }

        websocket.send(funcname,{geometry:graphic.geometry,attr:graphic.attributes},function (response) {
            if(response.status=="success"){
                
                var item = response.data;
                var geometry = new Polygon(item.polygon);
                var graphic = new Graphic(geometry);
                graphic.setAttributes(item.T_TZData);
            
                AddToGraphLayer(overlayPolygonLayer, graphmapTZ, graphic, "tzId");
            }
        });
    }

    function changetoMapNextXZ(graphic,Polygon, Graphic){

        var funcname = 'JsonEditT_XZDataGeoRequest';

        websocket.send(funcname,{geometry:graphic.geometry,attr:graphic.attributes},function (response) {
            if(response.status=="success"){

                var item = response.data;
                var geometry = new Polygon(item.polygon);
                var graphic = new Graphic(geometry);
                graphic.setAttributes(item.T_XZData);

                AddToGraphLayer(overlayPolygonLayerXZ, graphmapXZ, graphic, "xzid");
            }
        });
    }

    function changetoMapNextFW(graphic,Polygon, Graphic){

        var funcname = 'JsonEditT_FWGeoRequest';

        websocket.send(funcname,{geometry:graphic.geometry,attr:graphic.attributes},function (response) {
            if(response.status=="success"){
                
                var item = response.data;
                var geometry = new Polygon(item.polygon);
                var graphic = new Graphic(geometry);
                graphic.setAttributes(item.T_FW);
            
                AddToGraphLayer(fwLayer, graphmapFW, graphic, "id");
            }
        });
    }

    function changetoMap(evt,Polygon, Graphic){

        if(oldgraph.attributes.tzId != null){
            websocket.send("JsonValidateT_TZDataPolygonRequest",{geometry:evt.graphic.geometry,attr:evt.graphic.attributes},function (response) {
                if(response.status=="success"){
                    changetoMapNext(evt.graphic,Polygon, Graphic);
                }
                else{
                    layui.use(['layer','form'], function(){
                        var layer = layui.layer;
                        layer.msg(response.message,{time:1500,icon:5});    
                    });
                    graphmapTZ[oldgraph.attributes.tzId].geometry = new Polygon(oldgraph.geometry);
                    graphmapTZ[oldgraph.attributes.tzId].attributes = oldgraph.attributes;
                    graphmapTZ[oldgraph.attributes.tzId].draw();
                }
            });
        }
        else if(oldgraph.attributes.id != null && oldgraph.attributes.最高楼层 != null){
            websocket.send("JsonValidateT_FWPolygonRequest",{geometry:evt.graphic.geometry,attr:evt.graphic.attributes},function (response) {
                if(response.status=="success"){
                    changetoMapNextFW(evt.graphic,Polygon, Graphic);
                }
                else{
                    layui.use(['layer','form'], function(){
                        var layer = layui.layer;
                        layer.msg(response.message,{time:1500,icon:5});    
                    });
                    graphmapFW[oldgraph.attributes.id].geometry = new Polygon(oldgraph.geometry);
                    graphmapFW[oldgraph.attributes.id].attributes = oldgraph.attributes;
                    graphmapFW[oldgraph.attributes.id].draw();
                }
            });
        }
        else if(oldgraph.attributes.xzid != null){
            websocket.send("JsonValidateT_XZDataPolygonRequest",{geometry:evt.graphic.geometry,attr:evt.graphic.attributes},function (response) {
                if(response.status=="success"){
                    changetoMapNextXZ(evt.graphic,Polygon, Graphic);
                }
                else{
                    layui.use(['layer','form'], function(){
                        var layer = layui.layer;
                        layer.msg(response.message,{time:1500,icon:5});
                    });
                    graphmapXZ[oldgraph.attributes.xzid].geometry = new Polygon(oldgraph.geometry);
                    graphmapXZ[oldgraph.attributes.xzid].attributes = oldgraph.attributes;
                    graphmapXZ[oldgraph.attributes.xzid].draw();
                }
            });
        }

        
    }

    //全图
    function mapFullScreen(){
        map.setZoom(1);
    }

    //背景图层
    function layerCon(layer,flag){
        layer.setVisibility(flag);
    }
    //工具条
    function toolBars(_value, graphic) {
        require(["esri/toolbars/navigation","esri/toolbars/draw","esri/toolbars/edit"],function (Navigation,Draw,Edit) {
            navToolbar.deactivate();
            drawtool.deactivate();
            edittool.deactivate();
            switch(_value){
                case "平移":
                    navToolbar.activate(Navigation.PAN);
                    break;
                case "缩小":
                    navToolbar.activate(Navigation.ZOOM_OUT);
                    break;
                case "放大":
                    navToolbar.activate(Navigation.ZOOM_IN);
                    break;
                case "全图":
                    navToolbar.zoomToFullExtent();
                    break;
                case "漫游":
                    //默认是漫游操作
                    navToolbar.deactivate();
                    break;
                case "创建对象":
                    drawmethod = "创建对象";
                    drawtool.activate(Draw.POLYGON);
                    break;
                case "创建房屋":
                    drawmethod = "创建房屋";
                    drawtool.activate(Draw.POLYGON);
                    break;
                case "编辑节点":
                    edittool.activate(Edit.MOVE | Edit.SCALE | Edit.EDIT_VERTICES | Edit.ROTATE, graphic);
                    break;
                case "线打断面":
                    drawtool.activate(Draw.POLYLINE);
                    break;
                case "挖洞":
                    drawtool.activate(Draw.POLYGON);
                    $('.esriPopup').css('display','none');
                    break;
            }
        });

    }


    //点击房屋
    var mapfeat = {};

    function mapClickBuild(event,Polygon,Graphic) {


        if(overlayPolygonLayer.visibleAtMapScale){
            websocket.send("JsonGetT_TZDataPolygonByExtentFilterRequest",{sessionid:userData.sessionid,extent:event.extent},function (response) {
                if(response.status=="success"){
                    var data = response.data;
                    for(var index = 0; index < data.length; index++) {
                        var item = data[index];
                        if(item.polygon == null){
                            continue;
                        }

    
                        var geometry = new Polygon(item.polygon);
                        var graphic = new Graphic(geometry);

                        graphic.setAttributes(item.T_TZData);
                        
                        AddToGraphLayer(overlayPolygonLayer, graphmapTZ, graphic, "tzId");
                    }
                }
            });
        }
        
        if(overlayPolygonLayerXZ.visibleAtMapScale){
            console.log(websocket._webSocket.readyState);
            websocket.send("JsonGetT_XZDataPolygonByExtentFilterRequest",{sessionid:userData.sessionid,extent:event.extent},function (response) {
                if(response.status=="success"){
                    var data = response.data;
                    for(var index = 0; index < data.length; index++) {
                        var item = data[index];
                        if(item.polygon == null){
                            continue;
                        }

    
                        var geometry = new Polygon(item.polygon);
                        var graphic = new Graphic(geometry);

                        graphic.setAttributes(item.T_XZData);
                        
                        AddToGraphLayer(overlayPolygonLayerXZ, graphmapXZ, graphic, "xzid");
                    }
                }
            });
        }
        
        if(fwLayer.visibleAtMapScale){
            websocket.send("JsonGetT_FWPolygonByExtentFilterRequest",{sessionid:userData.sessionid,extent:event.extent},function (response) {
                if(response.status=="success"){
                    var data = response.data;
                    for(var index = 0; index < data.length; index++) {
                        var item = data[index];
                        if(item.polygon == null){
                            continue;
                        }

    
                        var geometry = new Polygon(item.polygon);
                        var graphic = new Graphic(geometry);

                        graphic.setAttributes(item.T_FW);
                        
                        AddToGraphLayer(fwLayer, graphmapFW, graphic, "id");
                    }
                }
            });
        }

        if(bjEnvLayer.visible){
            websocket.send("JsonGetT_BJEnvPolygonByExtentFilterRequest",{sessionid:userData.sessionid,extent:event.extent},function (response) {
                if(response.status=="success"){
                    var data = response.data;
                    for(var index = 0; index < data.length; index++) {

                        var geometry = new Polygon(data[index].polygon);

                        //查询结果样式
                        var line = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2);
                        var symbol=new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, line,new dojo.Color([125,125,125,0]));

                        var graphic = new Graphic();
                        graphic.setGeometry(geometry);
                        graphic.setSymbol(symbol);
                        bjEnvLayer.add(graphic);
                    }
                }
            });
        }

        if(ghlkxLayer.visibleAtMapScale){
            websocket.send("JsonGetT_GHLKXPolygonByExtentFilterRequest",{sessionid:userData.sessionid,extent:event.extent},function (response) {
                if(response.status=="success"){
                    var data = response.data;
                    for(var index = 0; index < data.length; index++) {

                        var geometry = new Polygon(data[index].polygon);

                        //查询结果样式
                        var line = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([107, 168, 246]), 2);
                        var symbol=new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, line,new dojo.Color([125,125,125,0]));

                        var graphic = new Graphic();
                        graphic.setGeometry(geometry);
                        graphic.setSymbol(symbol);
                        ghlkxLayer.add(graphic);
                    }
                }
            });
        }

        if(mtgLayer.visibleAtMapScale){
            websocket.send("JsonGetT_SZJDPolygonByExtentFilterRequest",{sessionid:userData.sessionid,extent:event.extent},function (response) {
                if(response.status=="success"){
                    var data = response.data;
                    for(var index = 0; index < data.length; index++) {

                        var geometry = new Polygon(data[index].polygon);

                        //查询结果样式
                        var line = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([107, 168, 246]), 2);
                        var symbol=new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, line,new dojo.Color([125,125,125,0.5]));

                        var graphic = new Graphic();
                        graphic.setGeometry(geometry);
                        graphic.setSymbol(symbol);
                        mtgLayer.add(graphic);
                    }
                }
            });
        }

    }

    function clickInfoContent(res) {
        // console.log(123)
        var content =
            "<p >房屋面积："+res.attributes.房屋面积+"</p>"
            +"<p>最高楼层："+res.attributes.最高楼层+"</p>"
            +"<p>房屋类型："+res.attributes.STRU_TYPE+"</p>";
        return content;
    }

    function clickInfoContentoverlay(res){
        var content = '';
        $.each(res.attributes,function(index,obj){
            if(mapOverlayContent[index] == null){
                return;
            }
            content += "<p>"+ mapOverlayContent[index] + ": "+ obj +"</p>"; 
        });
        return content;
    }


    function renderLayerShowXZ(content){

        var ly = ztt[content];
        //overlayPolygonLayer.minScale = ly.minScale;
        //overlayPolygonLayer.maxScale = ly.maxScale;
        overlayPolygonLayerXZ.setRenderer(renderer[content]);
        overlayPolygonLayerXZ.redraw();
    
        var setting = legendsetting.legendXZ;
        setting.length=0;
        var render = renderer[content];
        for(var index =0;index< render.infos.length;index++){
            var info = render.infos[index];
            var color = info.symbol.color;
            setting.push({color:[color.r,color.g,color.b,color.a],name:info.label});
        }
    
        var dataList=CallbackForLegend('legendXZ');
        legendInfoXZ.setData(dataList);
        legendInfoXZ.show();
    }

    exports('interior', {})
})