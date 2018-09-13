function searchCategory() {
    $.ajax({
        url: "/manager/brand/searchCategory",
        type: "POST",
        dataType: "JSON",
        data: {"keyword": $("#input_keyword").val()},
        success: function (result) {
            if (result.code == 1) {
                $('.table-goods').dataTable().fnClearTable(); //清空一下table
                $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                $.each(result.data, function (index, category) {
                    var tr = "<tr>\n" +
                        "              <td>" + (index + 1) + "</td>\n" +
                        "              <td>" + category.categoryName + "</td>\n" +
                        "              <td>" + category.categoryId + "</td>\n" +
                        "              <td>" + category.rank + "</td>\n" +
                        "              <td>" + (category.description != null ? category.description : "") + "</td>\n" +
                        "              <td>\n" +
                        "                <a href='" + ((category.parentId != '00000001') ? "#" : "/manager/brand/toAddChildGoodsCategory?goodsCategoryId=" + category.categoryId) + "' class=\"add add-g\" style='" + ((category.parentId != '00000001') ? "color:gray;" : " ") + "'>添加子分类</a> |\n" +
                        "                <a href=\"/manager/brand/toEditGoodsCategory?goodsCategoryId=" + category.categoryId + "\" class=\"add add-g\">编辑</a> |\n" +
                        "                <a href=\"#\" class=\"add add-g\">删除</a>\n" +
                        "              </td>\n" +
                        "            </tr>"
                    $('.table-goods').find("tbody").append(tr);
                });
                initTable($('.table-goods'));
            } else {
                alert("请求数据失败")
            }
        },
        error: function () {
            alert("请求数据失败")
        }
    })
}

function clearSearchCategory() {
    $("#input_keyword").val("")
}

function selectParentCategory() {
    if ($("#parentCategory").val() != "00000001") {
        $("#addImg").html("");
        $("#iconLabel").html("");
    } else {
        $("#addImg").html(" <div class=\"rect-wechat\">\n" +
            "                          <img class=\"file-img\" id=\"img1\">\n" +
            "                          <i class=\"fa fa-fw  fa-plus addIcon\" id=\"icon1\"></i>\n" +
            "                          <input type=\"file\" name=\"categoryIcon\" class=\"up-file\" onchange=\"preview(this, 1)\" required>\n" +
            "                        </div>");
        $("#iconLabel").html("分类图标：")
    }
}


function addNextGoodsCategory() {

    var cateName = $("#cateName").val();
    console.log($("input[name = 'categoryIcon']").val());
    var Icon = $("input[name = 'categoryIcon']").val();
    if (cateName.trim().length === 0) {
        modalText = "请输入分类名称";
        $("#myModal").modal();
    } else if (Icon !== undefined && Icon !== null) {
        if (Icon.length !== 0) {
            $("#addGoodsCategoryForm").attr("action", "/manager/brand/addNextGoodsCategory");
            $("#addGoodsCategoryForm").submit()
        } else {
            modalText = "请上传图片";
            $("#myModal").modal();
        }
    } else {
        $("#addGoodsCategoryForm").attr("action", "/manager/brand/addNextGoodsCategory");
        $("#addGoodsCategoryForm").submit()
    }
}

function delCategory(categoryId) {

    $("#modalConfirmBtn").off("click");
    $("#modalConfirmBtn").on("click", function () {
        $.ajax({
            url: "/manager/brand/delGoodsCategory",
            type: "POST",
            dataType: "JSON",
            data: {"goodsCategoryId": categoryId},
            success: function (result) {
                if (result.code === 1) {
                    $('.table-goods').DataTable().row("#tr" + categoryId).remove().draw( false );
                } else if (result.code === 2) {
                    modalText = "此分类还有子分类或商品，请先将它们移除";
                    $("#myModal").modal();

                } else {
                    modalText = "删除失败";
                    $("#myModal").modal();
                }
            },
            error: function () {
                modalText = "删除失败";
                $("#myModal").modal();
            }
        })
    });


    modalText = "确认删除此分类？";
    $("#confirmModal").modal();

}

function addGoodsSelectFirstCategory() {

    var firstCategoryId = $("#firstCategory").val().toString();
    $.ajax({
        url: "/manager/brand/querySecondCategory",
        type: "POST",
        dataType: "JSON",
        data: {"categoryId": firstCategoryId},
        success: function (result) {
            if (result.code === 1) {
                $("#secondCategory").html("");
                var secondCategoryId = $("#secondCategoryId").val();
                var option = "";
                $.each(result.data, function (index, category) {
                    if (secondCategoryId !== undefined && secondCategoryId === category.categoryId) {
                        option = "<option value='" + category.categoryId + "' selected>" + category.categoryName + "</option>";
                    } else {
                        option = "<option value='" + category.categoryId + "'>" + category.categoryName + "</option>";
                    }
                    $("#secondCategory").append(option);
                });
            }
            else if (result.code === 2) {
                alert("请求数据失败")
            } else {
                modalText = "请为该一级分类添加二级分类，方可添加商品";
                $("#myModal").modal();
                $("#secondCategory").html("");
                var option = "<option value=''>请为该一级分类添加二级分类</option>";
                $("#secondCategory").append(option);
            }
        },
        error: function () {
            alert("请求数据失败")
        }
    })
}

// 对标签进行样式和内容修改
$(".firstCategory").on("click", function () {
    // var index = $(this).index();
    var firstCategory = $(this).attr("data");
    var secondCategory = $("#secondCategory").find(".subcategory-active").attr("data");
    sendUrl(firstCategory, secondCategory, 1);

});

$("#secondCategory").on("click", ".category-second", function () {
    // var index = $(this).index();
    var secondCategory = $(this).attr("data");
    var firstCategory = $("#firstCategory").find(".category-active").attr("data");
    sendUrl(firstCategory, secondCategory, 2);

});

$(".firstCategory").on("click", function () {
    $("#firstCategory").find(".firstCategory").removeClass("category-active");
    $(this).addClass("category-active");
});
$("#secondCategory").on("click", ".category-second", function () {
    $("#secondCategory").find(".subcategory-active").removeClass("subcategory-active");
    $(this).addClass("subcategory-active");
});

// 根据点击的标签进行条件查询
function sendUrl(category, subCategory, index) {
    $.ajax({
        url: "/manager/brand/condition",
        type: "post",
        data: {
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
            var tr = "";
            $('.table-goods').dataTable().fnClearTable(); //清空一下table
            $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
            console.log(datas);
            for (var i = 0; i < datas.length; i++) {
                var type = "";
                if (datas[i].goods.publish == 1) {
                    type = "下架";
                }
                else if (datas[i].goods.publish == 2) {
                    type = "上架";
                }
                tr = "<tr id='tr" + datas[i].goods.goodsId + "'>" +
                    // "      <td>" +
                    // "         <input type=\"checkbox\" name=\"select\">" +
                    // "       </td>\n" +
                    "       <td>" + (i + 1) + "</td>" +
                    "       <td>" + datas[i].goods.goodsId + "</td>" +
                    "       <td>" + datas[i].goods.goodsName + "</td>" +
                    "       <td>" + datas[i].firstCategory.categoryName + "</td>" +
                    "       <td>" + datas[i].secondCategory.categoryName + "</td>" +
                    "       <td>" + datas[i].goods.unit + "</td>\n" +
                    "       <td>" + datas[i].goods.salePrice + "</td>\n" +
                    "       <td>" + datas[i].goods.stock + "</td>\n" +
                    "       <td id=\'" + datas[i].goods.goodsId + "goodsStatus\'>" + (datas[i].goods.publish == 1 ? '已上架' : '未上架') + "</td>\n" +
                    "       <td>" + datas[i].goods.putTime + "</td>\n" +
                    "       <td>\n" +
                    "           <a id='publish" + datas[i].goods.goodsId + "' onclick='changePublish(" + datas[i].goods.goodsId + "," + (datas[i].goods.publish == 1 ? 2 : 1) + ")' class='add add-g'>" + type + "</a> |\n" +
                    "           <a href='/manager/brand/toEditGoods?goodsId=" + datas[i].goods.goodsId + "' class=\"add add-g\">编辑</a> |\n" +
                    "           <a onclick='delGoods(" + datas[i].goods.goodsId + ")' class=\"add add-g\">删除</a>" +
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

// 根据关键字进行查询
function selectGoods() {
    var selectStr = $("#keyword").val();

    $.ajax({
        url: "/manager/brand/select",
        type: "POST",
        dataType: "JSON",
        data: {
            "selectStr": selectStr
        },
        success: function (data) {
            var datas = data.itemList;
            console.log(datas);
            var tr = "";
            $('.table-goods').dataTable().fnClearTable(); //清空一下table
            $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
            for (var i = 0; i < datas.length; i++) {
                var type = "";
                if (datas[i].goods.publish == 1) {
                    type = "下架";
                }
                else if (datas[i].goods.publish == 2) {
                    type = "上架";
                }
                tr = "<tr>" +
                    // "      <td>" +
                    // "         <input type=\"checkbox\" name=\"select\">" +
                    // "       </td>\n" +
                    "       <td>" + (i + 1) + "</td>" +
                    "       <td>" + datas[i].goods.goodsId + "</td>" +
                    "       <td>" + datas[i].goods.goodsName + "</td>" +
                    "       <td>" + datas[i].firstCategory.categoryName + "</td>" +
                    "       <td>" + datas[i].secondCategory.categoryName + "</td>" +
                    "       <td>" + datas[i].goods.unit + "</td>\n" +
                    "       <td>" + datas[i].goods.salePrice + "</td>\n" +
                    "       <td>" + datas[i].goods.stock + "</td>\n" +
                    "       <td id=\'" + datas[i].goods.goodsId + "goodsStatus\'>" + (datas[i].goods.publish == 1 ? '已上架' : '未上架') + "</td>\n" +
                    "       <td>" + datas[i].goods.putTime + "</td>\n" +
                    "       <td>\n" +
                    "           <a id='publish" + datas[i].goods.goodsId + "' href=\"#\" class=\"add add-g operation\" onclick='changePublish(" + datas[i].goods.goodsId + "," + (datas[i].goods.publish == 1 ? 2 : 1) + ")' >" + type + "</a> |\n" +
                    "           <a class=\"add add-g\" href='/manager/brand/toEditGoods?goodsId=" + datas[i].goods.goodsId + "' >编辑</a> |\n" +
                    "           <a href=\"#\" class=\"add add-g\" onclick='delGoods(" + datas[i].goods.goodsId + ")'>删除</a>" +
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

// 提取商品关键字
function getkeyWords(that, value) {

    if (inputCondition(that, value, /[\s\S]*？/g, '你输入了非法字符，请更改', 20)) {
        $.ajax({
            url: "/manager/brand/getKeyWords",
            type: "GET",
            dataType: "JSON",
            data: {
                goodsName: value.toString()
            },
            success: function (result) {
                console.log(result);
                if (result.code === 1) {
                    var str = result.data.join(',');
                    $("input#keyword").val(str);
                } else {
                    modalText = "获取商品关键字失败";
                    $("#myModal").modal();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                modalText = "获取商品关键字失败,原因：" + errorThrown;
                $("#myModal").modal();
            }
        })
    }
}

function addGoodsAndToAddNextGoods() {
    var goodsName = $("#goodsName").val().trim().length;
    var keyword = $("#keyword").val().trim().length;
    var cost = $("#cost").val().trim().length;
    var sale = $("#sale").val().trim().length;
    var market = $("#market").val().trim().length;
    var strategy = $("#strategy").val().trim().length;
    var warning = $("#warning").val().trim().length;
    var picture = $("input[name = 'picture']").val().trim().length;
    var unit = $("input[name = 'unit']").val().trim().length;

    if (goodsName * keyword * cost * sale * market * strategy * warning * unit * picture === 0) {
        modalText = "请填写完商品完整信息";
        $("#myModal").modal();
    } else {
        $("#addGoodsForm").attr("action", "/manager/brand/addGoodsAndToAddNextGoods");
        $("#addGoodsForm").submit()
    }
}

function editGoodsAsNewPuttime() {
    var keyword = $("#keyword").val().trim().length;
    var cost = $("#cost").val().trim().length;
    var sale = $("#sale").val().trim().length;
    var market = $("#market").val().trim().length;
    var strategy = $("#strategy").val().trim().length;
    var warning = $("#warning").val().trim().length;
    var unit = $("input[name = 'unit']").val().trim().length;

    if (keyword * cost * sale * market * strategy * warning * unit === 0) {
        modalText = "请填写完商品完整信息";
        $("#myModal").modal();
    } else {
        $("#editGoodsForm").attr("action", "/manager/brand/editGoodsAsNewPuttime");
        $("#editGoodsForm").submit()
    }
}

var modalText;

// 模态框绑定修改商品状态事件
function changePublish(goodsId, publish) {

    $("#modalConfirmBtn").off("click");
    $("#modalConfirmBtn").on("click", function () {
        $.ajax({
            url: "/manager/brand/changePublish",
            type: "POST",
            dataType: "JSON",
            data: {"goodsId": goodsId, "publish": publish},
            success: function (result) {
                if (result.code == 1) {
                    if (publish == 2) {
                        $("#publish" + goodsId).html("上架");
                        $("#publish" + goodsId).attr("onclick", "changePublish('" + goodsId + "'," + 1 + ")");
                        $("#" + goodsId + "goodsStatus").text("未上架")

                    } else {
                        $("#publish" + goodsId).html("下架");
                        $("#publish" + goodsId).attr("onclick", "changePublish('" + goodsId + "'," + 2 + ")");
                        $("#" + goodsId + "goodsStatus").text("已上架")

                    }
                } else {
                    modalText = "修改失败";
                    $("#myModal").modal();
                }
            },
            error: function () {
                modalText = "修改失败";
                $("#myModal").modal();
            }
        })
    });

    modalText = "确认修改？";
    $("#confirmModal").modal();

}

// 模态框绑定删除商品事件
function delGoods(goodsId) {

    $("#modalConfirmBtn").off("click");
    $("#modalConfirmBtn").on("click", function () {
        $.ajax({
            url: "/manager/brand/delGoods",
            type: "POST",
            dataType: "JSON",
            data: {"goodsId": goodsId},
            success: function (result) {
                if (result.code == 1) {
                    $('.table-goods').DataTable().row("#tr" + goodsId).remove().draw( false );
                } else {
                    modalText = "删除成功";
                    $("#myModal").modal();
                }
            },
            error: function () {
                modalText = "删除失败";
                $("#myModal").modal();
            }
        })
    });

    modalText = "确认删除？";
    $("#confirmModal").modal();

}

// 添加商品，默认市场价和销售价相同
function setMarket(value) {
    $("input#market").val(value);
}
