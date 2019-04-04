layui.define(function(exports){
    var admin = layui.admin;

    var formData = {};
    var userData=  JSON.parse(window.sessionStorage.getItem("userData"));

    var streetCommunity;
    ;(function(){
        var _ele = $('.searchInfo');
        $.ajax({
            url: CDdata.Nserver + CDdata.Napi.getStreetCommunity
            ,type: 'post'
            ,data: {}
            ,dataType:"json",
            xhrFields: {withCredentials:true} 
            ,success: function(res){
                if(res.code == 0){
                    streetCommunity = res.data;
                    linkage(_ele,res.data);
                }
                debugger
            }
        });
    }());

    ;(function(){
        var node = $('.dataContent');

        getCondtion();

        function getCondtion() {
            var _data = {};
            _data.Community = node.find(".village").val().split('_')[0];
            _data.Street = node.find(".street").val().split('_')[0];
            _data.StreetPlanDeclareType=node.find(".declareType").val().split('_')[0];
            _data.ShapeNumber = node.find(".dataSearchText").val();
            _data.IsInput = '';
            _data.AddressType = '';
            _data.ProjectAddress = '';
            _data.ProjectName = '';
            _data.UserName = userData.userName;

            setTable(_data);

        };

        function setTable (_data){
            layui.use('table', function() {
                var dataTable = layui.table;
                dataTable.render({
                    elem: '#dataTable'
                    , url: CDdata.Nserver + CDdata.Napi.getOnePageData//"http://dsfhy.s3.natapp.cc/DataInfo.ashx?fun=FFdataThrough"
                    , id: "dataTable"
                    , method: 'post'
                    , contentType: "application/json"
                    , where: _data
                    // , data: _data
                    , height: 490
                    , even: true
                    , page: true //是否显示分页
                    , request: {
                        pageName: 'index' //页码的参数名称，默认：page
                        ,limitName: 'Count' //每页数据量的参数名，默认：limit
                    }
                    ,parseData: function(res){
                        return{
                            "code": res.code, //解析接口状态
                            "msg": res.msg, //解析提示文本
                            "count": res.data.allCount, //解析数据长度
                            "data": res.data.list //解析数据列表
                        }
                    }
                    , cols: [[
                        {field: 'ShapeNumber', title: '图斑号', width: 170, fixed: 'left'}
                        , {field: 'Street', title: '街乡镇', width: 120}
                        , {field: 'ProjectAddress', title: '项目地址', width: 120}
                        , {field: 'DecideType', title: '判定类'}
                        , {field: 'DataName',  title: '数据名'}
                        // , {field: '指导意见书年份', width: 120, title: '指导意见书年份'}
                        // , {field: '上报整改状态', width: 120, title: '上报整改状态'}
                        , {field: 'score', title: '', width: 55, toolbar: '#distributeBar', fixed: 'right'}
                    ]]
                });
                //监听表格复选框选择
                dataTable.on('checkbox(demo)', function (obj) {
                    // console.log(obj)

                });

                
                //操作按钮
                dataTable.on('tool(dataTable)', function (obj) {
                    var data = obj.data;
                    if (obj.event === 'distribute') {
                        // layer.msg('ID：'+ data.id + ' 的查看操作');
                        dataIdList = [];
                        dataIdList.push(data.attID);
                        AlertView({
                            message: document.getElementById("selectViewOperator"),
                            caption: "选择作业员",
                            buttonsAlign: "right",
                            showTitle: true,
                            showClose: true,
                            buttons: {
                                "确定": dataDistribute,
                                "取消": null
                            }
                        });
                    } else if(obj.event === 'position'){
                        debugger
                        locationPolygon(data.WKT);
                        attrDetail(data,obj);
                    }
                })

                active = {
                    reload: function(){
                        var _data = {};
                        _data.Community = node.find(".village").val().split('_')[0];
                        _data.Street = node.find(".street").val().split('_')[0];
                        _data.ShapeNumber = node.find(".dataSearchText").val();
                        _data.StreetPlanDeclareType=node.find(".declareType").val().split('_')[0];
                        _data.ProjectAddress = '';
                        _data.ProjectName = '';
                        _data.IsInput = node.find(".isInput").val();
                        
                        //执行重载
                        dataTable.reload('dataTable', {
                            page: {
                                curr: 1 //重新从第 1 页开始
                            }
                            ,where: _data
                        });
                    }
                    
                };
            })
        };

        $('.searchInfo .layui-btn').on('click', function(){
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    }());


    attrDetail(formData);
    function attrDetail(formData,_Obj) {
        layui.use(['laytpl','laydate', 'form'], function () {
            var $ = layui.$;
            var form = layui.form;
            var laytpl = layui.laytpl;
            var laydate = layui.laydate;
            
            var getTpl = demo.innerHTML
            ,view = document.getElementById('view');
            laytpl(getTpl).render(formData, function(html){
                view.innerHTML = html;
            });

            if(formData.IsInput == "1"){
                $($('.isDisable')[0]).addClass('layui-btn-disabled');
                $($('.isDisable')[1]).addClass('layui-btn-disabled');
                $($('.isDisable')[0]).attr('disabled','disabled');
                $($('.isDisable')[1]).attr('disabled','disabled');
            }else{
                $($('.isDisable')[0]).removeClass('layui-btn-disabled');
                $($('.isDisable')[1]).removeClass('layui-btn-disabled');
                $($('.isDisable')[0]).removeAttr('disabled');
                $($('.isDisable')[1]).removeAttr('disabled');
            }
            form.render();

            //表单初始赋值
            // if ( JSON.stringify(formData) == "{}" ) return;
            form.val('example', {
                "ShapeNumber": formData.ShapeNumber // "name": "value"
                ,"Street":formData.Street
                ,"Community":formData.Community
                ,"ProjectName":formData.ProjectName
                ,"ProjectAddress":formData.ProjectAddress
                ,"AddressType":formData.AddressType
                ,"BuildMainNature":formData.BuildMainNature
                ,"BuildMain":formData.BuildMain
                ,"UseNature":formData.UseNature
                ,"BuildDate":formData.BuildDate
                ,"BuildState":formData.BuildState
                ,"IllegalBuildType":formData.IllegalBuildType
                ,"LandOwnership":formData.LandOwnership
                ,"BuildArea":formData.BuildArea
                ,"CoverageArea":formData.CoverageArea
                ,"PlanhomeLandUseNature":formData.PlanhomeLandUseNature
                ,"HandleMan":formData.HandleMan
                ,"Memo":formData.Memo
                ,"ProjectOwningType":formData.ProjectOwningType
                ,"StreetPlanDeclareType":formData.StreetPlanDeclareType
                ,"Xiaolei":formData.Xiaolei
                ,"IsHavePlanProcedure":formData.IsHavePlanProcedure
                ,"IsHaveBuildFoundation":formData.IsHaveBuildFoundation
                ,"PRIsOwningGOC":formData.PRIsOwningGOC
                ,"PRIsOwningUnit":formData.PRIsOwningUnit
                ,"IsGOCContribution":formData.IsGOCContribution
                ,"MoneySource":formData.MoneySource
                ,"IsBringIntoLegalProcedure":formData.IsBringIntoLegalProcedure

            });

            laydate.render({
                elem: '#BuildDate' //指定元素
                // ,value: '2017-09-10'
            });
            var streetVal = $('.streetNode').val();
            if(streetVal !== ""){
                for(var i=0,length=streetCommunity.length;i<length;i++){
                    if(streetVal == streetCommunity[i].name){
                        var streetChilds = streetCommunity[i].childs;
                        for(var x= 0; x<streetChilds.length;x++){
                            $('.Community').append('<option data-new ="1" value="'+ streetChilds[x] + '">'+streetChilds[x]+'</option>')
                        }
                    }
                }
                form.render('select');
            }

            if($('.plan_use_type').val() == "有证类"){
                $('.hasOwn').attr("disabled",false);
                $('.otherOwn').attr("disabled",true);
                $('.noOwn').attr("disabled",true);
                $('.unOwn').attr("disabled",true);
                $('.XZAttID').removeAttr("lay-verify",'required').attr("disabled",true).val('')
                form.render('select');
            } else if($('.plan_use_type').val() == "待完善类"){
                $('.hasOwn').attr("disabled",true);
                $('.otherOwn').attr("disabled",true);
                $('.noOwn').attr("disabled",true);
                $('.unOwn').attr("disabled",false);
                $('.XZAttID').removeAttr("lay-verify",'required').attr("disabled",true).val('')
                form.render('select');
            }else if($('.plan_use_type').val() == "其他"){
                $('.hasOwn').attr("disabled",true);
                $('.otherOwn').attr("disabled",false);
                $('.noOwn').attr("disabled",true);
                $('.unOwn').attr("disabled",true);
                $('.XZAttID').removeAttr("lay-verify",'required').attr("disabled",true).val('')
                form.render('select');
            }else if($('.plan_use_type').val() == "无手续"){
                $('.hasOwn').attr("disabled",true);
                $('.otherOwn').attr("disabled",true);
                $('.noOwn').attr("disabled",false);
                $('.unOwn').attr("disabled",true);
                $('.XZAttID').attr("lay-verify",'required').attr("disabled",false);
                form.render('select');
            }else{
                $('.hasOwn').attr("disabled",false);
                $('.otherOwn').attr("disabled",false);
                $('.noOwn').attr("disabled",false);
                $('.unOwn').attr("disabled",false);
                $('.XZAttID').removeAttr("lay-verify",'required').attr("disabled",true).val('')
                form.render('select');
            }
            form.on('select(project_type)',function (data) {
                if(data.value == "不需要取得规划许可手续"){
                    $(".plan_use_type").val("无手续");
                    form.render();
                }
            });
            form.on('select(plan_use_type)',function (data) {
                if(data.value == "不需要取得规划许可手续"){
                    $(".project_type").val("不需要取得规划许可手续");
                    form.render('select','project_type');
                }
            });
            form.on('select(plan_use_type)',function (data) {
                if(data.value == "有证类"){

                    $('.hasOwn').attr("disabled",false);
                    $('.noOwn').attr("disabled",true);
                    $('.otherOwn').attr("disabled",true);
                    $('.unOwn').attr("disabled",true);
                    $('.Xiaolei').attr("lay-verify",'required').val('');
                    $('.XZAttID').removeAttr("lay-verify",'required').attr("disabled",true).val('');
                    form.render('select');
                } else if (data.value == "待完善类"){

                    $('.hasOwn').attr("disabled",true);
                    $('.noOwn').attr("disabled",true);
                    $('.otherOwn').attr("disabled",true);
                    $('.unOwn').attr("disabled",false);
                    $('.Xiaolei').attr("lay-verify",'required').val('');
                    $('.XZAttID').removeAttr("lay-verify",'required').attr("disabled",true).val('');
                    form.render('select');
                } else if (data.value == "其他"){

                    $('.hasOwn').attr("disabled",true);
                    $('.noOwn').attr("disabled",true);
                    $('.otherOwn').attr("disabled",false);
                    $('.unOwn').attr("disabled",true);
                    $('.Xiaolei').attr("lay-verify",'required').val('');
                    $('.XZAttID').removeAttr("lay-verify",'required').attr("disabled",true).val('');
                    form.render('select');
                } else if(data.value == "无手续"){
                    $('.hasOwn').attr("disabled",true);
                    $('.noOwn').attr("disabled",false);
                    $('.otherOwn').attr("disabled",true);
                    $('.unOwn').attr("disabled",true);
                    $('.Xiaolei').removeAttr("lay-verify",'required').val('');
                    $('.XZAttID').attr("lay-verify",'required').attr("disabled",false);
                    form.render('select');
                } else {
                    $('.noOwn').attr("disabled",false);
                    $('.hasOwn').attr("disabled",false);
                    $('.otherOwn').attr("disabled",false);
                    $('.unOwn').attr("disabled",false);
                    $('.Xiaolei').attr("lay-verify",'required').val('');
                    $('.XZAttID').removeAttr("lay-verify",'required').attr("disabled",true).val('');
                    form.render('select');
                }
            });
            form.on('select(IsHavePlanProcedure)',function (data) {
                if(data.value == "是"){
                    $('.IsHaveBuildFoundation').attr("disabled",true).val('');
                    $('.PRIsOwningGOC').attr("disabled",true).val('');
                    $('.PRIsOwningUnit').attr("disabled",true).val('');
                    $('.IsGOCContribution').attr("disabled",true).val('');
                    $('.MoneySource').attr("disabled",true).val('');
                    $('.IsBringIntoLegalProcedure').attr("disabled",true).val('');
                    form.render('select');
                } else {
                    $('.IsHaveBuildFoundation').attr("disabled",false)
                    $('.PRIsOwningGOC').attr("disabled",false)
                    $('.PRIsOwningUnit').attr("disabled",false)
                    $('.IsGOCContribution').attr("disabled",false)
                    $('.MoneySource').attr("disabled",false)
                    $('.IsBringIntoLegalProcedure').attr("disabled",false)
                    form.render('select');
                }
            })

            
            form.on('submit(*)', function(obj){
                debugger
                // console.log(obj.field);
                // $.ajax({
                //     url: CDdata.Nserver + CDdata.api.tzEntry,
                //     type: "post",
                //     dataType: "json",
                //     data:JSON.stringify($.extend(obj.field, {space_coordinate:"",housetop_occupy_area : x})),
                //     success: function (response) {
                //         debugger
                //     }
                // })
                console.log($(obj.elem).attr("data-type"))
                if($(obj.elem).attr("data-type") == 'save'){
                    var _url = CDdata.Nserver + CDdata.Napi.saveData;
                } else {
                    var _url = CDdata.Nserver + CDdata.Napi.saveAndCommitData;
                }

                var fileArray = [];
                $.each(obj.field, function (index, value) {
                    var fileObj = {};
                    if(/^departName/.test(index)){

                        fileObj.DepartmentName = value ;
                        fileObj.Files = [];

                        $('.'+index).find('.fileName').each(function(){

                            var fileURL = $(this).attr('lay-data');
                            fileObj.Files.push(fileURL);
                            
                        });

                        fileArray.push(fileObj);

                        delete obj.field[index]
                    }
                });

                obj.field.LiveOutsidePhotoArray = [];
                $('.LiveOutsidePhoto').find('.safeCheckApplyImgBoxImg').each(function(){

                    var fileURL = $(this).attr('src');
                    obj.field.LiveOutsidePhotoArray.push(fileURL);
                    
                });
                
                obj.field.LiveInsidePhotoArray = [];
                $('.LiveInsidePhoto').find('.safeCheckApplyImgBoxImg').each(function(){

                    var fileURL = $(this).attr('src');
                    obj.field.LiveInsidePhotoArray.push(fileURL);
                    
                });
                
                var formValue = $.extend(obj.field,{DocumentationArray:fileArray});
                var _jsonData = $.extend(formData,formValue,{UserName:userData.userName});

                $.ajax({
                    type: "post",
                    url: _url,
                    dataType:"json",
                    xhrFields: {withCredentials:true}, 
                    data: JSON.stringify(_jsonData) ,
                    success: function (response) {
                        debugger
                        if(response.code == '0'){
                            layer.msg("保存成功！",{time:1500,icon:1});
                            if(_Obj == "undefined") return;
                            _Obj.update(_jsonData);
                        } else {
                            layer.msg("保存失败！",{time:1500,icon:2});
                        }
                    }
                });

                

                return false;
            })

            imgList();
            addImgEvent();
            addNode();
            imgDelete();
            fileDel();
            downFile();
        })
    }

    //图片浏览
    function imgList() {
        var img = $(".safeCheckApplyImgDataBox img");
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

        $(".safeCheckApplyImgDataBox").viewer('destroy');
        var view = $(".safeCheckApplyImgDataBox").viewer({
            url: 'data-original',
            zIndex:9999,
            navbar:false,
            title:false,
            rotatable:false,//旋转
            scalable:false,//翻转
            transition:false,//css3
            fullscreen:false//播放时全屏
        });
    }

    //添加
    function addImgEvent() {
        $(".wbzp").click(function () {
            // console.log(this);
            uploadImg("0",this);
        });
        $(".nbzp").click(function () {
            uploadImg("0",this);
        });
        $(".cebg").click(function () {
            uploadImg("0");
        });

        function uploadImg(pictype,eventDom) {

            // var testFile = document.getElementById('fileToUpload');
            var testFile = $(eventDom).next()[0];
            testFile.click(function(event){
                console.log(this);
                // event.stopPropagation
            });
            testFile.addEventListener('change', function() {
                if (this.files.length === 0)return;
                var ShapeNumber = $('.ShapeNumber').val();
                var t_files = this.files[0];

                upLoadPicOrFile(pictype,testFile,ShapeNumber,t_files);

            }, false);
        }

    }

    function upLoadPicOrFile(pictype,fileInput,ShapeNumber,t_files){

        var formData = new FormData();
        formData.append('name', t_files.name);
        formData.append('file',t_files);
        if(pictype == 0){
            $.ajax({
                type: "post",
                url: CDdata.Nserver + CDdata.Napi.addFile +"?IsImage=true&ShapeNumber="+ShapeNumber + "&FileName=" + t_files.name + "&UserName=" + userData.userName,
                data: t_files,
                xhrFields: {withCredentials:true}, 
                processData:false,
                contentType: false,
                success: function (response) {
                    debugger
                    var res = JSON.parse(response);
                    if(res.code == 0){
                        var path = window.URL.createObjectURL(t_files);
                        var _html = "<div class=\"safeCheckApplyImgBoxFrame\">\n" +
                            "<div class=\"safeCheckApplyImgBox\">\n" +
                            "<img class=\"safeCheckApplyImgBoxImg\" src=\""+res.data+"\" data-original=\""+res.data+"\"/>\n" +
                            "</div>\n" +
                            "<div class=\"footer-buttons\">\n" +
                            // "<button type=\"button\" class=\"imageEdit\" title=\"替换\"><i class=\"layui-icon layui-icon-edit\"></i></button>\n" +
                            "<button type=\"button\" class=\"imageDel\" title=\"删除\"><i class=\"layui-icon layui-icon-delete\"></i></button>\n" +
                            "</div>\n" +
                            "<input type=\"file\" name=\"imgUpload\" accept=\"image/jpeg\" style=\"opacity: 0\">\n" +
                            "</div>";
    
                        $(fileInput).parent('.safeCheckApplyImgBoxFrame.addPic').before(_html);
                        fileInput.outerHTML = fileInput.outerHTML;
    
                        imgList();
                        imgDelete();
                    }else if(res.code== '1'){
                        layer.msg(res.msg,{time:1500,icon:5});
                    }
                }
            });
            
            
        }
    }

    function imgDelete(){
        var attId = $(".attrId").val();
        var imgNode = $(".safeCheckApplyImgBoxFrame");
        imgNode.find(".imageDel").unbind("click");
        imgNode.find(".imageDel").click(function () {
            var src = $(this).parents(".safeCheckApplyImgBoxFrame").find(".safeCheckApplyImgBoxImg")[0].src;
            // var index = src .lastIndexOf("\\");
            // imgName  = src .substring(index + 1, src .length);
            // $(this).parents(".safeCheckApplyImgBoxFrame").remove();

            var imgDel = $(this);
            imgDel.parents(".safeCheckApplyImgBoxFrame").remove();
        });
    }


    function addNode(){
        var node = $('.addFileNode');

        if($('.fileListNode').length > 0){
            var idx = $('.fileListNode').length += 1;
        } else {
            var idx = 0;
        }
        
        node.find('.addClick').bind('click',function(){
            var _template = `
                <div class="layui-form-item departName-`+idx+`">
                    <div class="layui-inline">
                        <label class="layui-form-label">文件出具部门</label>
                        <div class="layui-input-inline">
                            <input name="departName-`+idx+`" autocomplete="off" class="layui-input  dempartValue">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">证明文件</label>
                        <div class="layui-input-inline">
                            <div class="layui-btn layui-btn-sm layui-btn-primary addFile" >
                                <input class="btnfile" type="file"/>
                                <i class="layui-icon layui-icon-link"></i>添加附件
                            </div>
                        </div>
                    </div>
                </div>
            `;
            node.after(_template);
            idx ++ ;
            clickEvent();
        })
        
    }

    function clickEvent(){
        $(".addFile").unbind('click').click(function(){
            console.log(this);
            var clickNode = this;
            var btnfile =  $(this).find('.btnfile')[0];
            btnfile.addEventListener('change', function(e) {
                
                var t_files = this.files;
                
                upload(t_files[0], 0,t_files[0].name,btnfile,clickNode)

            }, false);
        });
    }

    function upload(file, start,filename,test,clickNode) {
        debugger
        var ShapeNumber = $('.ShapeNumber').val();
        $.ajax({
            type: "post",
            url: CDdata.Nserver + CDdata.Napi.addFile +"?IsImage=false&ShapeNumber="+ShapeNumber + "&FileName=" + filename + "&UserName=" + userData.userName,
            data: file,
            xhrFields: {withCredentials:true}, 
            processData:false,
            contentType: false,
            success: function (response) {
                var res = JSON.parse(response);
                if(res.code == 0){
                    var fileHtml = '<div class="layui-inline">'+
                        '<label class="layui-form-label">证明文件号</label>'+
                        '           <div class="fileName" lay-data="'+ res.data +'"><span lay-data="'+ res.data +'" class="downloadFile">'+ filename +'</span><span class="delBtn" lay-data="'+ res.data +'"> 删除 </span></div>'+
                        '       </div>';
            
                    $(clickNode).parent().parent().after(fileHtml);
                    $(clickNode).parent().parent().prev().find('.dempartValue').attr("lay-verify",'required');
                    // fileList.css('display', "");
            
                    test.outerHTML = test.outerHTML;
            
                    fileDel();
                    downFile();
                    return;
                } else {
                    layer.msg(res.msg,{time:1500,icon:5});
                }
            }
        });
                    
    }

    function downFile(){
        $('.downloadFile').bind('click',function(){
            var fileUrl = $(this).attr('lay-data');
            var filename = fileUrl.substr(fileUrl.lastIndexOf("/")+1);
            var eleLink = document.createElement('a');
            eleLink.download = filename;
            eleLink.style.display = 'none';
            var blob = new Blob([fileUrl]);
            eleLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
        })
    }

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
            //     success:function(_json){
                    var fileNameList = $(this).parent().parent().parent().find(".fileName");
                    if(fileNameList.length <= 1){
                        $(this).parent().parent().parent().find(".dempartValue").removeAttr("lay-verify","required");
                    } else {
                        $(this).parent().parent().parent().find(".dempartValue").attr("lay-verify","required");
                    }
                    $(this).parent().parent().remove();
            //     },error:function(e1,e2,e3){

            //     }
            // });
            
        })
    }






    // 地图
    
    var mbjImage = "http://192.168.1.123/fileservice/services/MTGImage/MapServer"; //北京影像
    var mtgLayer;
    
    var map;
    var websocket;
    function initWebPage(){
        Agreement.getWebsocket(function(){
    
        },function(_userdata){
            // userData=_userdata;
            //this指向websocket；_userdata指向用户信息{username,password,usertoken}
            var storage = window.sessionStorage;

            // userData=  {username:JSON.parse(storage.getItem("userData")).userName};
            websocket=this;//接下来的websocket就用它
    
            if(typeof(initWebPageAfter)==="function"){initWebPageAfter();}
    
            // topMenuBar = new TopMenuBar();
            // fullScreen = new FullScreen();
            // orderByNavSelect = new OrderByNavSelect();
            // toolbar = new ToolBar();
    
        });
    
    };
    $(initWebPage);


    var zttsetting = null;
    function initWebPageAfter() {

        websocket.send("JsonGetAllZTTSettingRequest",userData,function (response) {
            zttsetting = response.data;
        });

        //页面初始化之后执行
        //地图容器ID是  mapContent
        //$("#mapContent").append(DomElement);这个地方放地图Dom元素

        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && userData != null) {
                    clearInterval(i);

                    initMap();
                }
            },
            50
        );
    };

    function initMap(){
        require([
            "esri/map",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/layers/GraphicsLayer",
            "esri/InfoTemplate",
            "esri/graphic",
            "esri/geometry/Polygon",
            "esri/geometry/Point",
            "esri/geometry/Extent",
            "esri/SpatialReference",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/symbols/SimpleFillSymbol",
            "esri/tasks/QueryTask",
            "esri/toolbars/navigation",
            "dojo/_base/Color",
            "dojo/_base/connect",
            "esri/toolbars/draw",
            "esri/toolbars/edit"
        ],
        function(Map,ArcGISTiledMapServiceLayer,GraphicsLayer,InfoTemplate,Graphic,Polygon,Point,Extent,SpatialReference,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,QueryTask,Navigation,Color,connect,Draw,Edit){
            //定义一个map实体
            var startExtent = new esri.geometry.Extent(497097.30139490607,302257.42696142907, 510148.5952099937, 308200.25620958756,  new esri.SpatialReference({ "wkid":2436 }));
            map = new esri.Map("mapGraphic",{logo:false,slider:false});
            //装载图层
            mbjImageLayer = new ArcGISTiledMapServiceLayer(mbjImage);
            map.addLayer(mbjImageLayer);

            mtgLayer = new GraphicsLayer();
            mtgLayer.minScale = 3000;
            map.addLayer(mtgLayer);
            var infoTemplateoverlayfw = new InfoTemplate("<i class='fa fa-fw fa-file'></i>详细信息", function click(fea) {
                return clickInfoContent(fea);
            });
            mtgLayer.setInfoTemplate(infoTemplateoverlayfw);

            //地图定位元素
            outlineLayer = new GraphicsLayer();
            map.addLayer(outlineLayer);

            map.on("extent-change",function (event) {
                mapClickBuild(event,Polygon,Graphic);
            });


            var iterval = setInterval(function(){

                var actionList = $('.esriPopup div.actionList');
                if(actionList.length != 0){
                    var addhtml = '<a title="编辑属性" class="action editattr cwhyaddlink" href="javascript:void(0);"><span>编辑属性</span></a>';

                    actionList.append(addhtml);

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

                        var _userInfo = JSON.parse(window.sessionStorage.getItem("userData"));
                        if( _userInfo.department != feat.attributes.Street || _userInfo.role=="管理员"){
                            layui.use(['layer'], function(){
                                var layer = layui.layer;
                                layer.msg('不支持当前层编辑',{time:1500,icon:5});    
                            });
                            return;
                        }

                        if(feat.attributes.WYBM != null){
                            var data={};
                            data=selectgraph.attributes;
                            
                            $.ajax({
                                type: "post",
                                url: CDdata.Nserver + CDdata.Napi.getDataById,
                                xhrFields: {withCredentials:true}, 
                                data: JSON.stringify({ShapeNumber:feat.attributes.WYBM,UserName:userData.userName}),
                                success: function (response) {
                                    debugger
                                    var _data = JSON.parse(response);
                                    attrDetail(_data.data);

                                },
                                error: function(){

                                }
                                
                            });
                                                       
                        }
                    
                        map.infoWindow.hide();
                    });


                    clearInterval(iterval);
                }
            },500);

            function mapClickBuild(event,Polygon,Graphic){
                mtgLayer.clear();
                if(mtgLayer.visibleAtMapScale){
                    websocket.send("JsonGetT_SZJDPolygonByExtentFilterRequest",{sessionid:userData.sessionid,extent:event.extent},function (response) {
                        if(response.status=="success"){
                            var data = response.data;
                            for(var index = 0; index < data.length; index++) {
        
                                var geometry = new Polygon(data[index].polygon);
        
                                //查询结果样式
                                var line = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([107, 168, 246]), 2);
                                var symbol=new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, line,new dojo.Color([125,125,125,0.3]));
        
                                var graphic = new Graphic();
                                graphic.setGeometry(geometry);
                                graphic.setSymbol(symbol);
                                graphic.setAttributes(data[index].T_TZData);
                                mtgLayer.add(graphic);
                            }
                        }
                    });
                }
            }
        });
    }

    function clickInfoContent(res) {
        console.log(res.attributes)
        var content =
            "<p >唯一编码："+res.attributes.WYBM+"</p>"
            +"<p>镇/街道："+res.attributes.Street+"</p>"
            +"<p>项目地址："+res.attributes.ProjectAddress+"</p>";
        return content;
    }

    //点击查看
    function locationPolygon(EnvInfo) {
        if(EnvInfo == null) return;
        outlineLayer.clear();
        var polygon = $.parseJSON(EnvInfo);
        var geometry = new esri.geometry.Polygon(polygon);
        var point = geometry.getExtent().getCenter();

        var infoTemplateoverlay = new esri.InfoTemplate("<i class='fa fa-fw fa-file'></i>详细信息", function click(fea) {
            return clickInfoContent(fea);

        });


        //查询结果样式
        var line = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2);
        var symbol=new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, line,new dojo.Color([125,125,125,0]));

        var graphic = new esri.Graphic();
        // graphic.setInfoTemplate(infoTemplateoverlay);

        graphic.setGeometry(geometry);
        // graphic.setAttributes(_attr);
        graphic.setSymbol(symbol);

        outlineLayer.add(graphic);

        var showExtent = geometry.getExtent();
        map.setExtent(showExtent.expand(1));
    }

    //封装联动
    function linkage(_ele,_data) {
        var areaData = _data;
        var $, $form,form;
        var $selectStreet,$selectVillage;

        layui.use(['jquery', 'form'], function() {
            $ = layui.jquery;
            form = layui.form;
            $form = _ele;
            $selectStreet = $form.find('select[name=street]');
            $selectVillage = $form.find('select[name=village]');

            form.on('select(street)', function(data){
                var value = data.value;
                // var d = value.split('_');
                // var code = d[0];
                // var count = d[1];
                // var index = d[2];
                for(var i=0;i<areaData.length;i++){
                    if(areaData[i].name==value) {
                        if(areaData[i].name.length > 0){
                            loadCity(areaData[i].childs);
                            $selectVillage.parent().show();
                            form.render('select');
                        } else {
                            $selectVillage.html('<option value="">请选社区/村</option>')
                            form.render('select');
                        }
                    }
                }
                
            });
            loadProvince();

        });

        function loadProvince(){

            for(var i=0,length=areaData.length;i<length;i++){
                $selectStreet.append('<option value="'+ areaData[i].name + '">'+areaData[i].name+'</option>')
            }
            form.render('select');
        }

        function loadCity(citys,areaIndex){

            $selectVillage.find('[data-new=1]').remove();
            for(var i=0,length=citys.length;i<length;i++){
                $selectVillage.append('<option data-new ="1" value="'+ citys[i] +'">'+citys[i]+'</option>')
            }
            form.render('select');
        }
    }












    exports('tzlr', {})
})