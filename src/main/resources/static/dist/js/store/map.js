var newPath = [];
var mouseTool;
var map;
var modalText;
var pathId;
var pointCount = 0;
const POINTCOUNT = 8;
$(function () {

    $("div.content-item").slimscroll({
        height: 'auto',
        // width: '1200px',
        alwaysVisible: true //是否 始终显示组件
    });

});

// 展示地图
function showMap() {
    $("section.main").css("display", 'none');
    $("section.map").css("display", "block");

    map = new AMap.Map("container", {
        resizeEnable: true
    });

    // 地图工具包
    AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.Geolocation'
    ], function () {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar());

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        map.addControl(new AMap.Scale());

        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'RT',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });

    //在地图中添加MouseTool插件
    mouseTool = new AMap.MouseTool(map);

    drawOldPaths();

    AMap.event.addDomListener(document.getElementById('polygon'), 'click', function () {
        $("#polygon").val("重新绘制");
        map.clearMap();
        drawOldPaths();
        mouseTool.polygon();

        pointCount = 0;
        newPath.splice(0, newPath.length);//清空数组
        AMap.event.addListener(map, "click", mapOnClick);
    }, false);

}

//地图上面绑定的点击事件，在用户画出三角形时关闭鼠标工具
function mapOnClick(e) {

    console.log(newPath.length);

    if (pointCount < POINTCOUNT - 1) {

        // 判断是否有线段相交
        if (newPath.length > 2) {
            for (var i = 0; i < newPath.length - 2; i++) {
                if (segmentsIntr(e.lnglat, newPath[0], newPath[i + 1], newPath[i + 2]) || segmentsIntr(e.lnglat, newPath[newPath.length - 1], newPath[i], newPath[i + 1])) {
                    modalText = "线与线之间不得相交";
                    $("#myModal").modal();
                    pointCount = 0;
                    newPath.splice(0, newPath.length);//清空数组
                    mouseTool.close();
                    return;
                }
            }
        }

        pointCount++;
        newPath.push(e.lnglat);
    } else if (pointCount === POINTCOUNT - 1){

        // 判断是否有线段相交
        if (newPath.length > 2) {
            for (var i = 0; i < newPath.length - 2; i++) {
                if (segmentsIntr(e.lnglat, newPath[0], newPath[i + 1], newPath[i + 2]) || segmentsIntr(e.lnglat, newPath[newPath.length - 1], newPath[i], newPath[i + 1])) {
                    modalText = "线与线之间不得相交";
                    $("#myModal").modal();
                    pointCount = 0;
                    newPath.splice(0, newPath.length);//清空数组
                    mouseTool.close();
                    return;
                }
            }
        }

        pointCount++;
        newPath.push(e.lnglat);
        mouseTool.close();
    }else{
        mouseTool.close();
    }
}

// 判断两条线段是否有交点
function segmentsIntr(a, b, c, d) {

    //快速排斥实验
    if ((a.lng > b.lng ? a.lng : b.lng) < (c.lng < d.lng ? c.lng : d.lng) ||
        (a.lat > b.lat ? a.lat : b.lat) < (c.lat < d.lat ? c.lat : d.lat) ||
        (c.lng > d.lng ? c.lng : d.lng) < (a.lng < b.lng ? a.lng : b.lng) ||
        (c.lat > d.lat ? c.lat : d.lat) < (a.lat < b.lat ? a.lat : b.lat)) {
        return false;
    }
    //跨立实验
    if ((((a.lng - c.lng) * (d.lat - c.lat) - (a.lat - c.lat) * (d.lng - c.lng)) *
            ((b.lng - c.lng) * (d.lat - c.lat) - (b.lat - c.lat) * (d.lng - c.lng))) > 0 ||
        (((c.lng - a.lng) * (b.lat - a.lat) - (c.lat - a.lat) * (b.lng - a.lng)) *
            ((d.lng - a.lng) * (b.lat - a.lat) - (d.lat - a.lat) * (b.lng - a.lng))) > 0) {
        return false;
    }
    return true;

}

// 点击按钮保存
$(".saveButton").on("click", function () {
    console.log(newPath.length);
    if (newPath.length === POINTCOUNT) {
        $.ajax({
            url: "/manager/store/info/addPath",
            type: "POST",
            data: {
                "triangle": JSON.stringify(newPath)
            },
            success: function (data) {
                $("#polygon").val("鼠标绘制面");
                paths.push(data);
                map.clearMap();
                drawOldPaths();
                mouseTool.polygon();

                modalText = "保存成功";
                $("#myModal").modal();
                pointCount = 0;
                newPath.splice(0, newPath.length);//清空数组

            },
            error: function (textStatus) {
                modalText = "保存失败";
                $("#myModal").modal();
                alert(textStatus);
                pointCount = 0;
                newPath.splice(0, triangle.length);//清空数组
            }
        });

    } else if (newPath.length > POINTCOUNT) {
        modalText = "您画的边过多，点击频率过快！";
        $("#myModal").modal();
    } else if (newPath.length < POINTCOUNT) {
        modalText = "请画出完整配送范围！";
        $("#myModal").modal();
    }

});

// 模态框中的删除事件
function deletePath() {
    $.ajax({
        url: "/manager/store/info/delPath",
        data: {
            pathId: pathId.toString()
        },
        success: function (data) {
            var responseInfo = data.getElementsByTagName("msg")[0].firstChild.data;
            console.log(paths);
            if (responseInfo === "Success") {
                $('div#' + pathId).remove();
                // 删除页面元素的同时删除paths中的JSON对象
                $.each(paths, function (i, path) {
                    for (var prop in path) {
                        if (path[prop] === pathId.toString()) {
                            paths.splice(i, 1);
                        }
                    }

                });
                console.log(paths);
                modalText = "删除成功";
                $("#myModal").modal();
            } else {
                modalText = "删除失败！请重试";
                $("#myModal").modal();
            }
        }
    })
}

// 删除某个配送范围
function delItem(Id) {
    pathId = Id;
    $("#confirmModal").modal();

}

// 画出以往保存过的三角形
function drawOldPaths() {
    // 对每个三角形的坐标经纬度的处理和绘图
    var point = new Array(8);
    var polygon;

    var pointArr = [];
    var drawPointArr = new Array();

    $.each(paths, function (index, path) {
        point[0] = path.point1.split(',');
        point[1] = path.point2.split(',');
        point[2] = path.point3.split(',');
        point[3] = path.point4.split(',');
        point[4] = path.point5.split(',');
        point[5] = path.point6.split(',');
        point[6] = path.point7.split(',');
        point[7] = path.point8.split(',');
        // 数据类型 String 到 double 的转换
        for (var i = 0; i < POINTCOUNT; i++) {
            for (var j = 0; j < 2; j++) {
                point[i][j] = parseFloat(point[i][j]);
            }
            pointArr.push(point[i]);
        }

        // 复制一份副本数组，而不是指向
        drawPointArr[index] = pointArr.concat();
        polygon = new AMap.Polygon({
            path: drawPointArr[index],//设置多边形边界路径
            strokeColor: "#FF33FF", //线颜色
            strokeOpacity: 0.2, //线透明度
            strokeWeight: 3,    //线宽
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.35//填充透明度
        });
        polygon.setMap(map);
        pointArr.splice(0, pointArr.length);//清空数组
    });

}

