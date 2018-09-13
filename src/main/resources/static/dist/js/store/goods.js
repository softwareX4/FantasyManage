$(".firstCategory").on("click", function () {
    // var index = $(this).index();
    var publish = $("#myTab").find(".active").index() / 2;
    var firstCategory = $(this).attr("data");
    var secondCategory = $("#secondCategory").find(".subcategory-active").attr("data");
    sendUrl(publish, firstCategory, secondCategory, 1);

});
$("#secondCategory").on("click", ".category-second", function () {
    // var index = $(this).index();
    var publish = $("#myTab").find(".active").index() / 2;
    var secondCategory = $(this).attr("data");
    var firstCategory = $("#firstCategory").find(".category-active").attr("data");
    sendUrl(publish, firstCategory, secondCategory, 2);

});
$(".publish").on("click", function () {
    var publish = ($(this).index()) / 2;
    if (parseInt(publish) == 0) {
        $("#up").css("display", "inline-block");
        $("#down").css("display", "inline-block");
    }
    else if (parseInt(publish) == 1) {
        $("#up").css("display", "none");
        $("#down").css("display", "inline-block");
    }
    else {
        $("#up").css("display", "inline-block");
        $("#down").css("display", "none");
    }

    var firstCategory = $("#firstCategory").find(".category-active").attr("data");
    var secondCategory = $("#secondCategory").find(".subcategory-active").attr("data");

    sendUrl(publish, firstCategory, secondCategory, 0);
});
$(".firstCategory").on("click", function () {
    $("#firstCategory").find(".firstCategory").removeClass("category-active");
    $(this).addClass("category-active");
});
$("#secondCategory").on("click", ".category-second", function () {
    $("#secondCategory").find(".subcategory-active").removeClass("subcategory-active");
    $(this).addClass("subcategory-active");
});

function sendUrl(publish, category, subCategory, index) {
    $.ajax({
        url: "/manager/item/condition",
        type: "post",
        data: {
            "publish": publish,
            "firstCategory": category,
            "secondCategory": subCategory
        },
        success: function (data) {

            if (index == 1) {
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
            var html = "";
            $('.table-goods').dataTable().fnClearTable(); //清空一下table
            $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
            for (var i = 0; i < datas.length; i++) {
                var type = "";
                if (datas[i].ysStoreGoods.publish == 1) {
                    type = "下架";
                }
                else if (datas[i].ysStoreGoods.publish == 2) {
                    type = "上架";
                }
                tr = "<tr>" +
                    "      <td>" +
                    "         <input type=\"checkbox\" name=\"select\">" +
                    "       </td>\n" +
                    "       <td>" + (i + 1) + "</td>" +
                    "       <td>" + datas[i].ysGoods.goodsId + "</td>" +
                    "       <td>" + datas[i].ysGoods.goodsName + "</td>" +
                    "       <td>" + datas[i].firstCategory + "</td>" +
                    "       <td>" + datas[i].secondCategory + "</td>" +
                    "       <td>" + datas[i].ysGoods.unit + "</td>\n" +
                    "       <td>" + (datas[i].ysGoods.salePrice).toFixed(2) + "</td>\n" +
                    "       <td>" + datas[i].publish + "</td>\n" +
                    "       <td>" + datas[i].ysStoreGoods.stock + "</td>\n" +
                    "       <td>\n" +
                    "           <a class=\"add add-g editStock\">修改库存</a> |\n" +
                    "           <a href=\"#\" class=\"add add-g operation\">" + type + "</a>" +
                    "       </td>\n" +
                    "    </tr>";
                $('.table-goods').find("tbody").append(tr);
            }
            initTable($('.table-goods'));
        },
        error: function () {
            alert("error")
        }
    })
}

$("#dataTable").on("click", ".editStock", function () {

    var goodsId = this.parentNode.parentNode.children[2].innerHTML;
    var stock = prompt("请输入需要修改的库存数量");
    var that = this;

    // 判断输入的库存是否为整数
    if (isNaN(stock)) {
        alert("请输入整数！");
        return;
    }

    if (stock !== null && stock != "") {
        console.log(stock);
        $.ajax({
            url: "/manager/item/updateStock",
            type: "POST",
            data: {
                "goodsId": goodsId,
                "stock": stock
            },
            dataType: "JSON",
            success: function (result) {
                if (result.code == 0) {
                    alert("获取商品数据失败")
                } else if (result.code == 1) {

                } else {
                    that.parentNode.parentNode.children[9].innerHTML = stock;

                }
            },
            error: function () {
                alert("获取商品数据失败")
            }
        })
    }
    else {
        alert("输入库存量不能为空哦")
    }
});

$("#dataTable").on("click", ".operation", function () {
    var goodsId = this.parentNode.parentNode.children[2].innerHTML;
    var status;
    if (this.parentNode.parentNode.children[8].innerHTML == "已上架") {
        status = 2;
    }
    else {
        status = 1;
    }
    operation(this, goodsId, status, 0);
});
var arr = [];

function opera(index) {
    var a = document.getElementsByName("select");
    var status;
    // $("#result").find('.result-item').remove();
    var html = "";
    for (var i = 0; i < a.length; i++) {
        if (a[i].checked) {
            var goodsId = a[i].parentNode.parentNode.children[2].innerHTML;
            arr.push(goodsId);
        }
    }
    if (parseInt(index) == 1) {
        status = 1;
    }
    else {
        status = 2;
    }
    operation("", arr.join(","), status, 1);
}

function operation(obj, goodsId, publish, type) {
    var that = obj;
    $.ajax({
        url: "/manager/item/updatePublish",
        type: "POST",
        data: {
            "goodsId": goodsId,
            "publish": publish
        },
        dataType: "JSON",
        success: function (result) {
            if (result.code == 0) {
                alert("获取商品数据失败")
            } else {
                if (parseInt(type) == 0) {
                    if (parseInt(publish) == 2) {
                        that.parentNode.parentNode.children[8].innerHTML = "已下架";
                        that.parentNode.parentNode.children[10].innerHTML = "<a class=\"add add-g editStock\">修改库存</a> |\n" +
                            "           <a href=\"#\" class=\"add add-g operation\">上架</a>";
                    }
                    else {
                        that.parentNode.parentNode.children[8].innerHTML = "已上架";
                        that.parentNode.parentNode.children[10].innerHTML = "<a class=\"add add-g editStock\">修改库存</a> |\n" +
                            "           <a href=\"#\" class=\"add add-g operation\">下架</a>";
                    }
                }
                else {
                    var eles = $("#dataTable").find('tr');
                    console.log(eles);
                    $.each(eles, function (index, ele) {
                        console.log(ele.children[2]);
                        for (var i = 0; i < arr.length; i++) {
                            if (ele.children[2].innerHTML == arr[i]) {
                                if (parseInt(publish) == 2) {
                                    ele.children[8].innerHTML = "已下架";
                                    ele.children[10].innerHTML = "<a class=\"add add-g editStock\">修改库存</a> |\n" +
                                        "           <a href=\"#\" class=\"add add-g operation\">上架</a>";
                                }
                                else {
                                    ele.children[8].innerHTML = "已上架";
                                    ele.children[10].innerHTML = "<a class=\"add add-g editStock\">修改库存</a> |\n" +
                                        "           <a href=\"#\" class=\"add add-g operation\">下架</a>";
                                }
                            }
                        }
                    })
                }
                initial();
            }
        },
        error: function () {
            alert("获取商品数据失败")
        }
    })
}

function initial() {
    arr.splice(0, arr.length);
    var a = document.getElementsByName("select");
    for (var i = 0; i < a.length; i++) {
        if (a[i].checked) {
            a[i].checked = false;
        }
    }
}

function selectGoods() {
    var selectStr = $("#selectStr").val()
    $.ajax({
        url: "/manager/item/select",
        type: "POST",
        dataType: "JSON",
        data: {
            "selectStr": selectStr
        },
        success: function (data) {
            var datas = data.itemList;
            var tr = "";
            $('.table-goods').dataTable().fnClearTable(); //清空一下table
            $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
            for (var i = 0; i < datas.length; i++) {
                var type = ""
                if (datas[i].ysStoreGoods.publish == 1) {
                    type = "下架";
                }
                else if (datas[i].ysStoreGoods.publish == 2) {
                    type = "上架";
                }
                tr = "<tr>" +
                    "      <td>" +
                    "         <input type=\"checkbox\" name=\"select\">" +
                    "       </td>\n" +
                    "       <td>" + (i + 1) + "</td>" +
                    "       <td>" + datas[i].ysGoods.goodsId + "</td>" +
                    "       <td>" + datas[i].ysGoods.goodsName + "</td>" +
                    "       <td>" + datas[i].firstCategory + "</td>" +
                    "       <td>" + datas[i].secondCategory + "</td>" +
                    "       <td>" + datas[i].ysGoods.unit + "</td>\n" +
                    "       <td>" + datas[i].ysGoods.salePrice.toFixed(2) + "</td>\n" +
                    "       <td>" + datas[i].publish + "</td>\n" +
                    "       <td>" + datas[i].ysStoreGoods.stock + "</td>\n" +
                    "       <td>\n" +
                    "           <a class=\"add add-g editStock\">修改库存</a> |\n" +
                    "           <a href=\"#\" class=\"add add-g operation\">" + type + "</a>" +
                    "       </td>\n" +
                    "    </tr>";
                $('.table-goods').find("tbody").append(tr);
            }
            initTable($('.table-goods'));
        },
        error: function () {
            alert("获取数据失败")
        }
    })
}

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
});
