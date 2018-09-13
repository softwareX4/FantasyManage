// 由于 该商品表格的结构与其他表格的结构不同，故单独为其生成一份
function initTable(object) {
    var myTable =  object.DataTable({
        'paging'      : true,
        'lengthChange': false,
        'searching'   : true,
        'ordering'    : false,
        'info'        : true,
        'autoWidth'   : false,
        "language"    : {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        }
    });
    // 再隐藏原生搜索组件
    $(".dataTables_filter").css("display","none");

    //为datatable增加序号列，注意此时为第一列不是第零列
    myTable.on('order.dt search.dt',function(){
        myTable.column(1,{
            search: 'applied',
            order: 'applied'
        }).nodes().each(function(cell,i){
            i = i + 1;
            var page = myTable.page.info();
            var pageno = page.page;
            var length = page.length;
            var columnIndex = (i+pageno*length);
            cell.innerHTML = columnIndex;
        });
    }).draw();
}
// 初始化表格
$(document).ready(function () {
    initTable($('.table-goods'));
    $('.datepicker').attr("readonly", "readonly");
    if($("#add1").length !== 0){
        $("#add0").css("display","none");
    }

});

$("#add").on("click", function () {
    showDialog();
});
$("#addGoods").on("click", function () {
    if (getTDtext()) back();
});

function showDialog() {

    // 初始化标签样式
    $("#firstCategory").find(".firstCategory").removeClass("category-active");

    $($("#firstCategory").find(".firstCategory")[0]).attr("class","category firstCategory category-active");
    $("#secondCategory").find(".category-second").remove();
    var all = "<div class=\"category category-second subcategory-active\" data=\"0\">所有</div>";
    $("#secondCategory").append(all);

    $.ajax({
        url: "/manager/wechat/storeGoods",
        type: "POST",
        data: {pageIndex: 0, pageSize: 10},
        dataType: "JSON",
        success: function (result) {
            if (result.code === 0) {
                alert("获取商品数据失败")
            } else {
                var data = result.data;
                if (data.length === 0) {
                    return
                }
                $('.table-goods').dataTable().fnClearTable(); //清空一下table
                $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                var page = data[0];
                var goodsList = page.data;
                var index = 0;
                pictures.splice(0,pictures.length);
                $.each(goodsList, function (count,goods) {

                    var flag = true;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].goodsId === goods.ysGoods.goodsId) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        pictures[index++] = goods.ysGoods.picture;
                        $("#addGoodsList").append("<tr>" +
                            "<td>" +
                            "<input type=\"checkbox\" name=\"select\">" +
                            "</td>" +
                            "<td>" + (index) + "</td>" +
                            "<td>" + goods.ysGoods.goodsId + "</td>" +
                            "<td>" + goods.ysGoods.goodsName + "</td>" +
                            "<td>" + goods.firstCategory + "</td>" +
                            "<td>" + goods.secondCategory + "</td>" +
                            "<td>" + goods.ysGoods.unit + "</td>" +
                            "<td>" + goods.ysGoods.salePrice + "</td>" +
                            "<td>" + goods.publish + "</td>" +
                            "<td>" +
                            "<a href=\"#\" class=\"add add-g addGoods\">添加商品</a>" +
                            "</td>" +
                            "</tr>");
                    }
                });
                initTable($('.table-goods'));
            }
        },
        error: function () {
            alert("获取商品数据失败")
        }
    });
    $("#modal-default").css("display", "block");
    $(".modal-backdrop").css("display", "block");
}

function back() {
    $("#modal-default").css("display", "none");
    $(".modal-backdrop").css("display", "none");
}

function addNewItem(i) {
    var length = $('#info').children('.form-group').length;
    $("#add" + (i - 1)).css("display", "none");
    var diff = "";
    if (length < 3) {
        diff = "<div class=\"col-sm-1 addP\"><i class=\"fa fa-fw  fa-plus-circle operation-icon\" id=\"add" + i + "\"" + "onclick=\"addNewItem(" + (i + 1) + ")\"></i></div>";
    }
    else {
        diff = "<div class=\"col-sm-1 addP\"><i class=\"fa fa-fw  fa-plus-circle operation-icon\" style=\"display: none;\" id=\"add" + i + "\"" + "onclick=\"addNewItem(" + (i + 1) + ")\"></i></div>";
    }
    var html = "<div class=\"form-group\" id=\"form" + i + "\">" + diff +
        "<div class=\"col-sm-8\">" +
        "<input type=\"text\" class=\"form-control\" placeholder=\"公告通知\" name='notice:" + (i - 1) + "' onblur=\"inputCondition(this,this.value,/[^\\a-zA-Z\u4E00-\u9FA5\\d,，.。！!?？'“”、()（）—_]/g,'你输入了非法字符，请更改',45)\" required>" +
        "</div>" +
        "<div class=\"col-sm-1 addP\"><i class=\"fa fa-fw fa-times-circle operation-del-icon\" id=\"del" + i + "\"" + "onclick=\"delItem(" + (i) + ")\"></i></div>" +
        "</div>";
    $("#info").append(html);
}

function delItem(i) {
    var length = $('#info').children('.form-group').length;
    $("#form" + i).remove();
    var child = $("#info").children(".form-group:last-child");
    child.find(".operation-icon").css("display", "block");

    if($("#add1").length === 0){
        $("#add0").css("display","block");
    }
}

var type = false;
var resultHTML = [];
var picture = [];
var pictures = [];

var menuId = "";
$("#tab").on("click", ".tab-item", function () {
    menuId = $(this).attr("menuId");
    if (type) {
        console.log(menuId);
        $.ajax({
            type: "POST",
            url: "/manager/wechat/delMenu",
            data: {
                "menuId": menuId
            },
            dataType: "Json",
            success: function (result) {
                console.log(result);
                if (result.code === 0) {
                    alert("获取商品数据失败")
                }
            },
            error: function () {
                alert("获取商品数据失败")
            }
        });

        $(this).remove();
    }
    else {
        var titleFirst = $("#title").val();
        if (titleFirst !== "") {
            alert("请先保存条目")
        }
        else {
            var title = $(this).find('span').text();
            $("#result").html(resultHTML[$(this).index()]);
            resultHTML.splice($(this).index(), 1);
            $(this).remove();
            $("#title").val(title);
            console.log($(this));
            edit = true;
            $.ajax({
                type: "POST",
                url: "/manager/wechat/menuGoods",
                data: {goodsId: $(this).attr("goodsid")},
                dataType: "Json",
                success: function (result) {
                    if (result.code == 0) {
                        alert("获取商品数据失败")
                    } else {
                        var data = result.data;
                        $("#result").html("");
                        $.each(data, function (index, goods) {
                            var obj = new Object();
                            picture.push(goods.ysGoods.picture);
                            obj.goodsId = goods.ysGoods.goodsId;
                            obj.name = goods.ysGoods.goodsName;
                            obj.price = goods.ysGoods.salePrice;
                            obj.category = goods.firstCategory + " > " + goods.secondCategory;
                            arr.push(obj);
                            $("#result").append("<div class=\"result-item\">" +
                                "<img src=\"" + goods.ysGoods.picture + "\" class=\"result-img\">" +
                                "<div class=\"content-result\">" +
                                "<div class=\"name\">" + goods.ysGoods.goodsName + "</div>" +
                                "<div class=\"category-item\">" + goods.firstCategory + " &gt; " + goods.secondCategory + "</div>" +
                                "<div class=\"result-price\">¥" + goods.ysGoods.salePrice + "</div>" +
                                "</div>" +
                                "<i class=\"fa fa-fw  fa-remove removeR\" style=\"display: none;\"></i>" +
                                " </div>")
                        })
                    }
                },
                error: function () {
                    alert("获取商品数据失败")
                }
            })
        }
    }
});
$("#tab").on("mouseover", ".tab-item", function () {
    $(this).find('.removeI').css("display", "inline-block");
});
$("#tab").on("mouseleave", ".tab-item", function () {
    $(this).find('.removeI').css("display", "none");
});

function remove() {
    type = true;
}

function show() {
    type = false;
}

function validateKey(e) {
    var theEvent = e || window.event;

    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;

    if (code == "13") {
        addItem();
    }
}

var edit = false;

function addItem() {
    var title = $("#title").val();
    if (title == "") {
        modalText = "请输入标题";
        $("#myModal").modal();
    }
    else {
        var goodsIdArr = [];
        $.each(arr, function (index, data) {
            goodsIdArr.push(data.goodsId);
        });
        var menuName = title;

        if (edit) {
            //修改
            $.ajax({
                type: "POST",
                url: "/manager/wechat/updateMenu",
                data: {
                    "menuId": menuId,
                    "menuName": menuName,
                    "goodsId": goodsIdArr.join(",")
                },
                dataType: "Json",
                success: function (result) {
                    // console.log(result);
                    if (result.code == 0) {
                        alert("获取商品数据失败")
                    } else {
                        // var data = result.data;
                        var html = "<div class=\"tab-item\" menuId=\"" + menuId + " \" goodsId=\"" + goodsIdArr.join(",") + "\">" +
                            "<span onclick=\"show()\">" + title + "</span>" +
                            "<i class=\"fa fa-fw  fa-remove removeI\" style=\"display: none;\" onclick=\"remove()\"></i>" +
                            "</div>";
                        $("#tab").append(html);
                        $("#title").val("");
                        var result = $("#result").html();
                        resultHTML.push(result);
                        arr.splice(0, arr.length);
                        picture.splice(0, picture.length);
                        $("#result").empty();
                    }
                },
                error: function () {
                    alert("获取商品数据失败")
                }
            })
        }
        else {
            //添加

            $.ajax({
                type: "POST",
                url: "/manager/wechat/addMenu",
                data: {
                    "menuName": menuName,
                    "goodsId": goodsIdArr.join(",")
                },
                dataType: "Json",
                success: function (result) {
                    // console.log(result);
                    if (result.code == 0) {
                        alert("获取商品数据失败")
                    } else {
                        var data = result.data;
                        var html = "<div class=\"tab-item\" menuId=\"" + result.data[0].menuId + " \" goodsId=\"" + goodsIdArr.join(",") + "\">" +
                            "<span onclick=\"show()\">" + title + "</span>" +
                            "<i class=\"fa fa-fw  fa-remove removeI\" style=\"display: none;\" onclick=\"remove()\"></i>" +
                            "</div>";
                        $("#tab").append(html);
                        $("#title").val("");
                        var result = $("#result").html();
                        resultHTML.push(result);
                        arr.splice(0, arr.length);
                        picture.splice(0, picture.length);
                        $("#result").empty();
                    }
                },
                error: function () {
                    alert("获取商品数据失败")
                }
            })
        }

    }
}
// 轮播图的图片上传和展示
function preview(file, i) {
    if (file.files && file.files[0]) {

        var idx = file.files[0].name.lastIndexOf(".");
        if (idx !== -1){
            var ext = file.files[0].name.substr(idx+1).toLowerCase();
            if (ext !== 'jpg' && ext !=='png' && ext !== 'jpeg' && ext !== 'gif'){
                modalText = "只能上传.jpg  .png  .jpeg  .gif类型的文件!";
                $('#myModal').modal();
                return;
            }
        } else {
            modalText = "只能上传.jpg  .png  .jpeg  .gif类型的文件!";
            $('#myModal').modal();
            return;
        }
        var filePath = file.value;
        if(filePath){
            //读取图片数据
            var filePic = file.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                //加载图片获取图片真实宽度和高度
                var image = new Image();
                image.onload=function(){
                    var width = image.width;
                    var height = image.height;
                    console.log(width + " " + height);
                    if (width <= 360 && height <= 150){
                        $("#img" + i).attr("src", e.target.result);
                        $("#icon" + i).css("display", "none");
                    }else {
                        modalText = "请上传360*150像素的图片";
                        $('#myModal').modal();
                        file.value = "";
                        return false;
                    }
                };
                image.src= data;
            };
            reader.readAsDataURL(filePic);
        }else{
            return false;
        }
    }
}
// 已被添加的商品将放到此处
var arr = [];

function getTDtext() {
    var length = 0;
    var a = document.getElementsByName("select");

    for (var i = 0; i < a.length; i++) {
        if(a[i].checked){
            length++;
        }
    }

    var html = "";

    if (length + arr.length > 5) {
        modalText = "所添加的商品超过5条";
        $('#myModal').modal();
        return false;
    }
    else {
        for (var i = 0; i < a.length; i++) {
            if (a[i].checked) {
                var obj = new Object();
                picture.push(pictures[i]);
                obj.goodsId = a[i].parentNode.parentNode.children[2].innerHTML;
                obj.name = a[i].parentNode.parentNode.children[3].innerHTML;
                obj.price = a[i].parentNode.parentNode.children[7].innerHTML;
                obj.category = a[i].parentNode.parentNode.children[4].innerHTML + " > " + a[i].parentNode.parentNode.children[5].innerHTML;
                arr.push(obj);
            }
        }

        $("#result .result-item").remove();
        for (var i = 0; i < arr.length; i++) {
            html = "<div class=\"result-item\">" +
                "<img src=\"" + picture[i] + "\" class=\"result-img\">" +
                "<div class=\"content-result\">" +
                "<div class=\"name\">" + arr[i].name + "</div>" +
                "<div class=\"category-item\">" + arr[i].category + "</div>" +
                "<div class=\"result-price\">¥" + arr[i].price + "</div>" +
                "</div>" +
                "<i class=\"fa fa-fw  fa-remove removeR\" style=\"display: none;\"></i>" +
                "</div>";
            $("#result").append(html);
        }
        initial();

        return true;
    }
}

$("#addGoodsList").on("click", ".addGoods", function () {
    var length = $('#result').children('.result-item').length;
    var obj = new Object();
    if (length < 5) {
        var index = parseInt(this.parentNode.parentNode.children[1].innerHTML) - 1;
        picture.push(pictures[index]);
        obj.name = this.parentNode.parentNode.children[3].innerHTML;
        obj.price = this.parentNode.parentNode.children[7].innerHTML;
        obj.goodsId = this.parentNode.parentNode.children[2].innerHTML;
        obj.category = this.parentNode.parentNode.children[4].innerHTML + " > " + this.parentNode.parentNode.children[5].innerHTML;
        var html = "<div class=\"result-item\">" +
            "<img src=\"" + picture[picture.length - 1] + "\" class=\"result-img\">" +
            "<div class=\"content-result\">" +
            "<div class=\"name\">" + obj.name + "</div>" +
            "<div class=\"category-item\">" + obj.category + "</div>" +
            "<div class=\"result-price\">¥" + obj.price + "</div>" +
            "</div>" +
            "<i class=\"fa fa-fw  fa-remove removeR\" style=\"display: none;\"></i>" +
            "</div>";

        console.log("addGoods", html);
        arr.push(obj);
        $("#result").append(html);
        back();
    }
    else {
        modalText = "所添加的商品超过5条";
        $('#myModal').modal();
    }
});
$("#result").on("click", ".removeR", function () {
    console.log($(this.parentNode).index());
    arr.splice($(this.parentNode).index(), 1);
    picture.splice($(this.parentNode).index(), 1);
    $(this.parentNode).remove()
});
$("#result").on("mouseover", ".result-item", function () {
    $(this).find('.removeR').css("display", "block");
});
$("#result").on("mouseleave", ".result-item", function () {
    $(this).find('.removeR').css("display", "none");
});

function initial() {
    var a = document.getElementsByName("select");
    for (var i = 0; i < a.length; i++) {
        if (a[i].checked) {
            a[i].checked = false;
        }
    }
}

// ——微信界面 > 添加商品——
// 根据关键字搜索
function selectBykeyword() {
    var keyword = $("#keyword").val();
    if(keyword.length === 0){
        showDialog()
    }else {
        $.ajax({
            url: "/manager/item/select",
            type: "POST",
            dataType: "JSON",
            data: {
                "selectStr": keyword
            },
            success: function (data) {
                pictures.splice(0,pictures.length);
                var datas = data.itemList;
                console.log(datas);
                var tr = "";
                $('.table-goods').dataTable().fnClearTable(); //清空一下table
                $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                var flag = true;
                var index = 0;
                $.each(datas, function (count, goods) {

                    // alert(JSON.stringify(goods))
                    flag = true;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].goodsId === goods.ysGoods.goodsId) {
                            flag = false;
                        }
                    }
                    if (flag && goods.publish === "已上架") {
                        pictures[index++] = goods.ysGoods.picture;
                        tr = "<tr>" +
                            "<td>" +
                            "<input type=\"checkbox\" name=\"select\">" +
                            "</td>" +
                            "<td>" + (index) + "</td>" +
                            "<td>" + goods.ysGoods.goodsId + "</td>" +
                            "<td>" + goods.ysGoods.goodsName + "</td>" +
                            "<td>" + goods.firstCategory + "</td>" +
                            "<td>" + goods.secondCategory + "</td>" +
                            "<td>" + goods.ysGoods.unit + "</td>" +
                            "<td>" + goods.ysGoods.salePrice + "</td>" +
                            "<td>" + goods.publish + "</td>" +
                            "<td>" +
                            "<a href=\"#\" class=\"add add-g addGoods\">添加商品</a>" +
                            "</td>" +
                            "</tr>";
                        $('.table-goods').find("tbody").append(tr);
                    }
                });
                initTable($('.table-goods'));

            },
            error: function () {
                alert("获取数据失败")
            }
        })
    }

}
// 根据标签搜索
// 对标签进行样式和内容修改
$(".firstCategory").on("click", function () {

    if($(this).hasClass("category-active")){
        return;
    }else{
        $("#firstCategory").find(".firstCategory").removeClass("category-active");
        $(this).addClass("category-active");

        var firstCategory = $(this).attr("data");
        // var secondCategory = $("#secondCategory").find(".subcategory-active").attr("data");
        sendUrl(firstCategory, 0, 1);
    }

});
$("#secondCategory").on("click", ".category-second", function () {

    if($(this).hasClass("subcategory-active")){
        return;
    }else{
        $("#secondCategory").find(".subcategory-active").removeClass("subcategory-active");
        $(this).addClass("subcategory-active");

        var secondCategory = $(this).attr("data");
        var firstCategory = $("#firstCategory").find(".category-active").attr("data");
        sendUrl(firstCategory, secondCategory, 2);
    }
});

// 根据点击的标签进行条件查询
function sendUrl(category, subCategory, index) {
    $.ajax({
        url: "/manager/item/condition",
        type: "post",
        data: {
            "firstCategory": category,
            "secondCategory": subCategory
        },
        success: function (data) {

            if(index === 1) {
                var subs = data.categoryList;
                $("#secondCategory").find(".category-second").remove();
                var all = "<div class=\"category category-second subcategory-active\" data=\"0\">所有</div>";
                $("#secondCategory").append(all);
                var sub = "";
                for (var i = 0; i < subs.length; i++) {
                    sub = "<div class=\"category category-second\" data=\"" + subs[i].categoryId + "\">" + subs[i].categoryName + "</div>";
                    $("#secondCategory").append(sub);
                }
            }

            var datas = data.itemList;
            var tr = "";
            $('.table-goods').dataTable().fnClearTable(); //清空一下table
            $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
            var total = 0;

            pictures.splice(0,pictures.length);
            $.each(datas, function (count, goods) {
                pictures[total++] = goods.ysGoods.picture;
                var flag = true;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].goodsId === goods.ysGoods.goodsId) {
                        flag = false;
                    }
                }
                if (flag && goods.publish === "已上架") {
                    tr = "<tr>" +
                        "<td>" +
                        "<input type=\"checkbox\" name=\"select\">" +
                        "</td>" +
                        "<td>" + (total) + "</td>" +
                        "<td>" + goods.ysGoods.goodsId + "</td>" +
                        "<td>" + goods.ysGoods.goodsName + "</td>" +
                        "<td>" + goods.firstCategory + "</td>" +
                        "<td>" + goods.secondCategory + "</td>" +
                        "<td>" + goods.ysGoods.unit + "</td>" +
                        "<td>" + goods.ysGoods.salePrice + "</td>" +
                        "<td>" + goods.publish + "</td>" +
                        "<td>" +
                        "<a href=\"#\" class=\"add add-g addGoods\">添加商品</a>" +
                        "</td>" +
                        "</tr>";
                    $('.table-goods').find("tbody").append(tr);
                }
            });
            initTable($('.table-goods'));

        },
        error: function () {
            alert("error")
        }
    })
}