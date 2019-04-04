
layui.define(function(exports){
    //页面初始化之前执行
    var zttsetting = null;
    var locatedataqxj=null;
    var locatedataxzj=null;
    var hasright = null;
    
    function initWebPageAfter() {

        websocket.send("JsonGetAllZTTSettingRequest",userData,function (response) {
            zttsetting = response.data;
        });

        websocket.send("JsonGetAllQXJRequest",userData,function (response) {
            locatedataqxj = response.data;
        });

        websocket.send("JsonGetAllXZJRequest",userData,function (response) {
            locatedataxzj = response.data;
        });

        //页面初始化之后执行
        //地图容器ID是  mapContent
        //$("#mapContent").append(DomElement);这个地方放地图Dom元素

        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && zttsetting != null
                    && locatedataqxj != null && locatedataxzj != null && userData != null) {
                    clearInterval(i);

                    $.ajax({
                        url:CDdata.server +"/userInfo.ashx?fun=checkSuperManager&userName=" + userData.username,
                        type:"get",
                        data:'',
                        dataType:"json",
                        success:function(_json){
                            hasright = _json.success;
                            initMap();
                        },error:function(e1,e2,e3){

                        }
                    });
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
    function image500LayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (image500Layer) == 'object') {
                    clearInterval(i);
                    layerCon(image500Layer,flag);
                }
            },
            300
        );

    }
    function image2000LayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (image2000Layer) == 'object') {
                    clearInterval(i);
                    layerCon(image2000Layer,flag);
                }
            },
            300
        );

    }
    function image10000LayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (image10000Layer) == 'object') {
                    clearInterval(i);
                    layerCon(image10000Layer,flag);
                }
            },
            300
        );

    }
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

    function locateLayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (locatelayer) == 'object') {
                    clearInterval(i);
                    layerCon(locatelayer,flag);
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

    function XCFWLayerCon(flag){
        var i = setInterval(
            function () {
                if (typeof (initMap) == 'function' && typeof (require) == 'function' && typeof (xcfwLayer) == 'object') {
                    clearInterval(i);
                    layerCon(xcfwLayer,flag);
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

    exports('interiorAction', {})
})











