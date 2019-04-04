layui.define(function(exports){


    /**
     * Created by Madman on 2018/03/26.
     **/

    var mbj500Image = "http://jzhtmap.s3.natapp.cc/arcgis/rest/services/InSiHuanQDR/MapServer";//北京500影像
    var mbjImage = "http://jzhtmap.s3.natapp.cc/arcgis/rest/services/AllBJMapIma/MapServer?token=F-bM_fmBALzSAvEFvnK5dv12TZTMcDqR0gvl1zxppfsaUAIFreAg8VRyQB2V45Oo"; //北京影像
    var image10000 = "http://jzhtmap.s3.natapp.cc/arcgis/rest/services/2017_10000_QDR/MapServer?token=F-bM_fmBALzSAvEFvnK5dv12TZTMcDqR0gvl1zxppfsaUAIFreAg8VRyQB2V45Oo";//北京地形10000
    var image2000 = "http://jzhtmap.s3.natapp.cc/arcgis/rest/services/2017_2000_QDR/MapServer?token=F-bM_fmBALzSAvEFvnK5dv12TZTMcDqR0gvl1zxppfsaUAIFreAg8VRyQB2V45Oo";//北京地形2000
    var image500 = "http://jzhtmap.s3.natapp.cc/arcgis/rest/services/2017_500_QDR/MapServer?token=F-bM_fmBALzSAvEFvnK5dv12TZTMcDqR0gvl1zxppfsaUAIFreAg8VRyQB2V45Oo";//北京地形500
    var map;

    // mbj500Image = "http://dsfhy.s3.natapp.cc/fileservice/services/InSiHuanQDR/MapServer";//北京500影像
    // mbjImage = "http://dsfhy.s3.natapp.cc/fileservice/services/AllBJMapIma/MapServer"; //北京影像
    // image10000 = "http://dsfhy.s3.natapp.cc/fileservice/services/2017_10000_QDR/MapServer";//北京地形10000
    // image2000 = "http://dsfhy.s3.natapp.cc/fileservice/services/2017_2000_QDR/MapServer";//北京地形2000
    // image500 = "http://dsfhy.s3.natapp.cc/fileservice/services/2017_500_QDR/MapServer";//北京地形500


    var chengQuFW = "http://jzhtmap.s3.natapp.cc/arcgis/rest/services/ChengQuFW/FeatureServer/0?token=F-bM_fmBALzSAvEFvnK5dv12TZTMcDqR0gvl1zxppfsaUAIFreAg8VRyQB2V45Oo";
    var XCFW = "http://jzhtmap.s3.natapp.cc/arcgis/rest/services/XCFW/MapServer/0?token=6XJvFM5HkXK36ZzmWmyK-8x60cgaHA77n7G_6LV02TpCZxlNLYrEgPOjWu_QjQjF";

    var fwLayer;
    var overlayPolygonLayer;
    var overlayPolygonLayerXZ;
    var bjEnvLayer;
    var ghlkxLayer;
    var xcfwLayer;


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

    var locatelayer;

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
                map = new esri.Map("mapContent",{logo:false,slider:false,zoom:1, extent: startExtent});
                //装载图层
                mbj500ImageLayer = new ArcGISTiledMapServiceLayer(mbj500Image);
                map.addLayer(mbj500ImageLayer);
                mbjImageLayer = new ArcGISTiledMapServiceLayer(mbjImage);
                map.addLayer(mbjImageLayer);
                image10000Layer = new ArcGISTiledMapServiceLayer(image10000);
                map.addLayer(image10000Layer);
                image2000Layer = new ArcGISTiledMapServiceLayer(image2000);
                map.addLayer(image2000Layer);
                image500Layer = new ArcGISTiledMapServiceLayer(image500);
                map.addLayer(image500Layer);

                locatelayer = new GraphicsLayer();
                map.addLayer(locatelayer);
                var infoTemplatelocate = new InfoTemplate("<i class='fa fa-fw fa-file'></i>详细信息", function click(fea) {
                    return clickInfoContentlocate(fea);
                });


                locatelayer.setInfoTemplate(infoTemplatelocate);



                var symbolfwhigh = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255,0,255]), 3),new Color([0,0,0,0])
                );
                {
                    var data = locatedataqxj.concat(locatedataxzj);
                    for(var index = 0; index < data.length; index++) {
                        var item = data[index];
                        if(item.polygon == null){
                            continue;
                        }

                        var geometry = new Polygon(item.polygon);
                        var graphic = new Graphic(geometry,symbolfwhigh);

                        graphic.setAttributes(item.regiondata);
                        
                        var key = graphic.attributes.NAME;
                        if(maplocategrahic[key] == null){
                            maplocategrahic[key]=[];                        
                        }
                        maplocategrahic[key].push(graphic);
                        alllocategraphic.push(graphic);

                        locatelayer.add(graphic);
                        graphic.hide();
                    }
                }

                $('#locatebtn').click(function(){
                    layui.use(['layer'], function(){
                        var layer = layui.layer;

                    });
                    var txt = $('#inputlocate').val();
                    if(txt == ''){
                        layer.msg('定位地址不能为空！');
                        return;
                    }

                    if(maplocategrahic[txt] == null){
                        layer.msg('不包含此地址！');
                        return;
                    }

                    var locates = maplocategrahic[txt];
                    for(var i = 0; i < alllocategraphic.length; i++){
                        alllocategraphic[i].hide();
                    }
                    var allextent = null;
                    for(var i = 0; i < locates.length; i++){
                        locates[i].show();
                        var extent = locates[i].geometry.getExtent();
                        if(allextent == null){
                            allextent = extent;
                        }
                        else{
                            allextent = allextent.union(extent);
                        }
                    }
                    map.setExtent(allextent);
                });

                bjEnvLayer = new GraphicsLayer();
                map.addLayer(bjEnvLayer);

                ghlkxLayer = new GraphicsLayer();
                ghlkxLayer.minScale = 3000;
                map.addLayer(ghlkxLayer);

                xcfwLayer = new GraphicsLayer();
                xcfwLayer.minScale = 1000;
                map.addLayer(xcfwLayer);

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

                renderLayerShowSZ('上账数据');
                renderLayerShowXZ('销账数据');

                tempsplitlayer.setRenderer(renderer["划线分割临时图层"]);

                fwLayer.setRenderer(renderer["拆违房屋渲染"]);


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
                    else if(drawmethod == "创建对象"){
                        addToMap(evt,Polygon,Graphic);
                    }
                    else if(drawmethod == "创建房屋"){
                        addToMapFW(evt,Polygon,Graphic);
                    }
                    
                });

                //点击地图元素
                // clickLayer = new GraphicsLayer();

                // clickLayer.minScale = 6000;

                // var infoTemplate = new InfoTemplate("<i class='fa fa-fw fa-file'></i>详细信息", function click(fea) {
                //     return clickInfoContent(fea);

                // });

                //clickLayer.setInfoTemplate(infoTemplate);
                //map.addLayer(clickLayer);
                map.on("extent-change",function (event) {
                    mapClickBuild(event,Polygon,Graphic);
                });

                var iterval = setInterval(function(){

                    var actionList = $('.esriPopup div.actionList');
                    if(actionList.length != 0){
                        var addhtml = '<a title="编辑节点" class="action editvertex cwhyaddlink" href="javascript:void(0);"><span>编辑节点</span></a><a title="编辑属性" class="action editattr cwhyaddlink" href="javascript:void(0);"><span>编辑属性</span></a><a title="打断" class="action breakpolygon cwhyaddlink" href="javascript:void(0);"><span>打断</span></a><a title="挖洞" class="action addhole cwhyaddlink" href="javascript:void(0);"><span>挖洞</span></a><a title="计算面积" class="action GetArea cwhyaddlink" href="javascript:void(0);"><span>计算面积</span></a><a title="删除房屋" class="action deleteFW cwhyaddlink hide" href="javascript:void(0);"><span>删除房屋</span></a>';

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
                                    if(feat.attributes.tzId!=null || (feat.attributes.id != null && feat.attributes.最高楼层 != null)){
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
                            //toolBars('编辑节点',selectgraph);

                            if(feat.attributes.tzId != null)
                            {
                                oldgraph=DeepCopyGraph(selectgraph);
                                var data={};
                                data.SZData=selectgraph.attributes;
        
                                websocket.send("JsonWPLTest",{attID:data.SZData.attID},function (response) {
                                    if(response.status=="success"){
                                    data.list = response.data.list;
                                    attrDetail(data);                                 
                                    }
                                    else{
                                        data.list = [];
                                        attrDetail(data);                     
                                    }
                                });
                            }
                            else if((feat.attributes.id != null && feat.attributes.最高楼层 != null))
                            {
                                EditAttrNextFW(selectgraph, Polygon, Graphic);
                            }
                

                        
                            map.infoWindow.hide();
                        });

                        $('.esriPopup div.actionList .breakpolygon').click(function(){

                            var support = true;
                            if(map.infoWindow.features == null || map.infoWindow.selectedIndex < 0){
                                support = false;
                            }
                            var selectgraph;
                            if(support){
                                support = false;
                                var feat = map.infoWindow.features[map.infoWindow.selectedIndex];
                                if(feat.attributes != null){
                                    if(feat.attributes.tzId!=null || (feat.attributes.id != null && feat.attributes.最高楼层 != null)){
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
                            
                            toolBars('线打断面',selectgraph);
                            drawmethod = '线打断面';
                            targetobject = selectgraph;
                                                    
                            map.infoWindow.hide();
                        });

                        $('.esriPopup div.actionList .addhole').click(function(){

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
                            
                            toolBars('挖洞',selectgraph);
                            drawmethod = '挖洞';
                            targetobject = selectgraph;
                                                    
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

                        $('.esriPopup div.actionList .deleteFW').click(function(){

                            var support = true;
                            if(map.infoWindow.features == null || map.infoWindow.selectedIndex < 0){
                                support = false;
                            }
                            var selectgraph;
                            if(support){
                                support = false;
                                var feat = map.infoWindow.features[map.infoWindow.selectedIndex];
                                if(feat.attributes != null){
                                    if( feat.attributes.最高楼层 != null ){
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

                            oldgraph=DeepCopyGraph(selectgraph);
                            var attId = selectgraph.attributes;

                            websocket.send("JsonDeleteT_FWRequest",{attr:attId},function (response) {
                                if(response.status=="success"){
                                    layer.msg('删除成功',{time:1500,icon:1});
                                    fwLayer.remove(selectgraph);
                                } else{
                                    layer.msg(response.data,{time:1500,icon:5});
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

    function addtoMapNext(geometry,Polygon, Graphic){
        var content = '<form class="layui-form" action="">';


        var numcount = 3;

        var num = 0;
        $.each(mapOverlayContent,function(index,obj){

            if(num % numcount == 0){
                content+='<div class="layui-form-item">';
            }
            content += '<div class="layui-inline"><label class="layui-form-label">'+obj+'</label><div class="layui-input-inline"><input type="text" autocomplete="off" placeholder="请输入'+obj+'" class="layui-input" name="'+index+'" ></div></div>';
            if(num % numcount == numcount-1){
                content+='</div>';
            }
            num++;
        });
        if(num % numcount != numcount-1){
            content+='</div>';
        }

        content += '<div class="layui-form-item"><div class="layui-input-block"><button class="layui-btn" lay-submit="" lay-filter="demo1">立即提交</button><button type="reset" class="layui-btn layui-btn-primary">重置</button></div></div></form>';

        layui.use(['layer','form'], function(){
            var layer = layui.layer;
            
            var idx=layer.open({
                type: 1, 
                maxmin:true,
                area: '800px',
                title:'输入属性',
                content: content //这里content是一个普通的String
            });

            var form = layui.form;
            form.on('submit(demo1)', function(data){
                
                websocket.send("JsonCreateT_TZDataRequest",{geometry:geometry,attr:data.field},function (response) {
                    if(response.status=="success"){
                        if(response.tips.length != 0){
                            layer.msg(response.tips,{time:1500,icon:5});
                        }

                        var item = response.data;
                        var geometry = new Polygon(item.polygon);
                        var graphic = new Graphic(geometry);
                        graphic.setAttributes(item.T_TZData);
                        
                        AddToGraphLayer(overlayPolygonLayer, graphmapTZ, graphic, "tzId");
                    }
                    else{
                        layer.msg(response.tips,{time:1500,icon:5});
                    }
                    layer.close(idx);
                });

            
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        });    
    }

    function addtoMapNextFW(geometry,Polygon, Graphic){
        var content = '<form class="layui-form" action="">';


        var numcount = 1;

        var num = 0;
        $.each(fwContent,function(index,obj){

            if(num % numcount == 0){
                content+='<div class="layui-form-item" style="margin-top:30px;margin-right:30px;">';
            }
            content += '<label class="layui-form-label">'+obj+'</label><div class="layui-input-block"><input type="text" autocomplete="off" lay-verify="required|number" placeholder="请输入'+obj+'" class="layui-input" name="'+index+'" ></div>';
            if(num % numcount == numcount-1){
                content+='</div>';
            }
            num++;
        });
        if(num % numcount != numcount-1){
            content+='</div>';
        }

        content += '<div class="layui-form-item"><div class="layui-input-block"><button class="layui-btn" lay-submit="" lay-filter="demo1">立即提交</button><button type="reset" class="layui-btn layui-btn-primary">重置</button></div></div></form>';

        layui.use(['layer','form'], function(){
            var layer = layui.layer;
            
            var idx=layer.open({
                type: 1, 
                area: '300px',
                title:'输入属性',
                content: content //这里content是一个普通的String
            });

            var form = layui.form;
            form.on('submit(demo1)', function(data){
                
                websocket.send("JsonCreateT_FWRequest",{geometry:geometry,attr:data.field},function (response) {
                    if(response.status=="success"){
                    
                        var item = response.data;
                        var geometry = new Polygon(item.polygon);
                        var graphic = new Graphic(geometry);
                        graphic.setAttributes(item.T_FW);
                        
                        AddToGraphLayer(fwLayer, graphmapFW, graphic, "id");
                    }
                    layer.close(idx);
                });

            
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        });    
    }

    function EditAttrNextFW(graph,Polygon, Graphic){
        var content = '<form class="layui-form" action="" lay-filter="editfw">';


        var numcount = 1;

        var num = 0;
        $.each(fwContent,function(index,obj){

            if(num % numcount == 0){
                content+='<div class="layui-form-item" style="margin-top:30px;margin-right:30px;">';
            }
            content += '<label class="layui-form-label">'+obj+'</label><div class="layui-input-block"><input type="text" autocomplete="off" lay-verify="required|number" placeholder="请输入'+obj+'" class="layui-input" name="'+index+'" ></div>';
            if(num % numcount == numcount-1){
                content+='</div>';
            }
            num++;
        });
        if(num % numcount != numcount-1){
            content+='</div>';
        }

        content += '<div class="layui-form-item"><div class="layui-input-block"><button class="layui-btn" lay-submit="" lay-filter="demo2">立即提交</button><button type="reset" class="layui-btn layui-btn-primary">重置</button></div></div></form>';

        layui.use(['layer','form'], function(){
            var layer = layui.layer;
            
            var idx=layer.open({
                type: 1, 
                area: '300px',
                title:'输入属性',
                content: content //这里content是一个普通的String
            });

            var form = layui.form;

            form.val('editfw', {
                "最高楼层":  graph.attributes.最高楼层// "name": "value"
            });

            form.on('submit(demo2)', function(data){
                
                websocket.send("JsonEditT_FWAttrRequest",{attr:$.extend(graph.attributes,data.field)},function (response) {
                    if(response.status=="success"){
                    
                        var item = response.data;
                        var geometry = new Polygon(item.polygon);
                        var graphic = new Graphic(geometry);
                        graphic.setAttributes(item.T_FW);
                        
                        AddToGraphLayer(fwLayer, graphmapFW, graphic, "id");
                    }
                    layer.close(idx);
                });

            
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
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

    function addToMap(evt,Polygon,Graphic) { 

        websocket.send("JsonValidateT_TZDataPolygonRequest",{geometry:evt.geometry},function (response) {
            if(response.status=="success"){
                addtoMapNext(evt.geometry,Polygon, Graphic);
            }
            else{
                layui.use(['layer','form'], function(){
                    var layer = layui.layer;
                    layer.msg(response.message,{time:1500,icon:5});    
                });
                
            }
        });
    }

    function addToMapFW(evt,Polygon,Graphic) { 

        websocket.send("JsonValidateT_FWPolygonRequest",{geometry:evt.geometry},function (response) {
            if(response.status=="success"){
                addtoMapNextFW(evt.geometry,Polygon, Graphic);
            }
            else{
                layui.use(['layer','form'], function(){
                    var layer = layui.layer;
                    layer.msg(response.message,{time:1500,icon:5});    
                });
                
            }
        });
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

        if (event.lod.level > 4) {
            // bjfw = new esri.layers.ArcGISDynamicMapServiceLayer(XCFW);
            // map.addLayer(bjfw);
            //chengquFWLayer = new esri.layers.FeatureLayer(chengQuFW);
            //map.addLayer(chengquFWLayer);


            // chengquFWLayer.on("click",function (event) {
            //
            //    var attr = event.graphic.attributes.OBJECTID;

                // var queryTask = new esri.tasks.QueryTask(chengQuFW);

                // var query = new esri.tasks.Query();
                // query.geometry = map.extent;
                // // query.where = "OBJECTID ='"+attr+"'";
                // query.where = "1=1";
                // query.returnGeometry = true;
                // query.distance = 0;
                // query.outFields = ["*"];
                // queryTask.execute(query, function(res){

                //     var resultFeatures = res.features;

                //     for (var i = 0, il = resultFeatures.length; i < il; i++) {

                //         var featureList = resultFeatures[i];

                //         if(mapfeat[featureList.attributes.OBJECTID] != null){
                //             continue;
                //         }

                //         var infoTemplate = new esri.InfoTemplate();

                //         infoTemplate.setTitle("&nbsp;&nbsp;详情信息");

                //         infoTemplate.setContent(clickInfoContent(featureList));

                //         var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                //             new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]),2),
                //             new dojo.Color([125,125,125,0]));

                //         var graphic = new esri.Graphic();

                //         graphic.setAttributes(featureList.attributes);

                //         graphic.setGeometry(featureList.geometry);

                //         // graphic.setSymbol(symbol);

                //         mapfeat[graphic.attributes.OBJECTID] = graphic;

                //         clickLayer.add(graphic);
                //     }

                // });

            // });





        }

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

        if(xcfwLayer.visibleAtMapScale){
            websocket.send("JsonGetT_XCFWPolygonByExtentFilterRequest",{sessionid:userData.sessionid,extent:event.extent},function (response) {
                if(response.status=="success"){
                    var data = response.data;
                    for(var index = 0; index < data.length; index++) {

                        var geometry = new Polygon(data[index].polygon);

                        //查询结果样式
                        var line = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 100, 100]), 1);
                        var symbol=new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, line,new dojo.Color([125,125,125,0]));

                        var graphic = new Graphic();
                        graphic.setGeometry(geometry);
                        graphic.setSymbol(symbol);
                        xcfwLayer.add(graphic);
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

    function clickInfoContentlocate(res){
        var content = '';
        $.each(res.attributes,function(index,obj){
            if(maplocateContent[index] == null){
                return;
            }
            content += "<p>"+ maplocateContent[index] + ": "+ obj +"</p>"; 
        });
        return content;
    }

    function renderLayerShowSZ(content){

        var ly = ztt[content];
        //overlayPolygonLayer.minScale = ly.minScale;
        //overlayPolygonLayer.maxScale = ly.maxScale;
        overlayPolygonLayer.setRenderer(renderer[content]);
        overlayPolygonLayer.redraw();

        var setting = legendsetting.legendSZ;
        setting.length=0;
        var render = renderer[content];
        for(var index =0;index< render.infos.length;index++){
            var info = render.infos[index];
            var color = info.symbol.color;
            setting.push({color:[color.r,color.g,color.b,color.a],name:info.label});
        }

        var dataList=CallbackForLegend('legendSZ');
        legendInfoSZ.setData(dataList);
        legendInfoSZ.show();
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





    exports('interior_gis', {})
})