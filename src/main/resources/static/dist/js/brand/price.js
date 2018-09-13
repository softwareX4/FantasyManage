// 按关键字查找
function selectPrice() {
    var keyword = $("#keyword").val();

    $.ajax({
        url:"/manager/brand/searchDiscount",
        type:"POST",
        dataType:"JSON",
        data:{
            "keyword":keyword
        },
        success: function (data) {
            var datas = data.priceDTOList;
            var tr = "";
            $('.table-goods').dataTable().fnClearTable(); //清空一下table
            $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
            // console.log(datas);
            for(var i = 0; i < datas.length; i++){
                var type = "";
                if(datas[i].goods.goods.publish === 1){
                    type = "下架";
                }
                else if(datas[i].goods.goods.publish === 2){
                    type = "上架";
                }
                tr =
                    "<tr id='tr"+datas[i].goods.goods.goodsId+"'>" +
                    // "      <td>" +
                    // "         <input type=\"checkbox\" name=\"select\">" +
                    // "       </td>\n" +s
                    "       <td>" + (i+1) + "</td>" +
                    "       <td>" + datas[i].goods.goods.goodsId + "</td>" +
                    "       <td>" + datas[i].goods.goods.goodsName + "</td>" +
                    "       <td>" + datas[i].goods.goods.unit + "</td>\n" +
                    "       <td>" + parseFloat(datas[i].goods.goods.salePrice) + "</td>\n" +
                    "       <td>" + datas[i].goods.goods.stock + "</td>\n" +
                    "       <td id=\'"+datas[i].goods.goods.goodsId+"goodsStatus\'>" + (datas[i].goods.goods.publish===1?'已上架':'未上架') + "</td>\n" +
                    "       <td>" + datas[i].goods.goods.putTime + "</td>\n" +
                    "       <td>" + ((datas[i].discount != null)?datas[i].discount.discount:'1') + "</td>\n" +
                    "       <td>" +  (datas[i].goods.goods.salePrice*((datas[i].discount != null)?datas[i].discount.discount:1)).toFixed(2) + "</td>\n" +
                    "       <td>\n" +
                        ((datas[i].discount != null)?
                    "           <a href='/manager/brand/editDiscountShow?discountId="+datas[i].discount.discountId+"' class=\"add add-g\">编辑</a> |\n" +
                            "           <a onclick='delPrice(\""+datas[i].discount.discountId+"\",\""+datas[i].goods.goods.goodsId+"\")' class=\"add add-g\">删除</a>"
                        :
                    "           <a href='/manager/brand/addSpecialDiscountShow?goodsId="+ datas[i].goods.goods.goodsId +"' class='add add-g'>添加折扣</a>")+
                    "       </td>\n" +
                    "    </tr>";
                $('.table-goods').find("tbody").append(tr);
            }
            initTable($('.table-goods'));
        },
        error:function () {
            alert("获取数据失败")
        }
    })




}
$(function () {


    $(".firstCategory").on("click", function () {
        // var index = $(this).index();
        var firstCategory = $(this).attr("data");
        var secondCategory = $("#secondCategory").find(".subcategory-active").attr("data");
        sendUrl(firstCategory, secondCategory, 1);

    });

// 标签的样式以及标签的更改
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

});

function sendUrl(category, subCategory, index) {
    $.ajax({
        url: "/manager/brand/discountCondition",
        type: "post",
        data: {
            "firstCategory": category,
            "secondCategory": subCategory
        },
        success: function (data) {

            if(index == 1) {
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

            var datas = data.priceDTOList;

            var html = "";
            $('.table-goods').dataTable().fnClearTable(); //清空一下table
            $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
            console.log(datas);
            for(var i = 0; i < datas.length; i++){
                var type = "";
                if(datas[i].goods.goods.publish === 1){
                    type = "下架";
                }
                else if(datas[i].goods.goods.publish === 2){
                    type = "上架";
                }
                tr =
                    "<tr id='tr"+datas[i].goods.goods.goodsId+"'>" +
                    // "      <td>" +
                    // "         <input type=\"checkbox\" name=\"select\">" +
                    // "       </td>\n" +
                    "       <td>" + (i+1) + "</td>" +
                    "       <td>" + datas[i].goods.goods.goodsId + "</td>" +
                    "       <td>" + datas[i].goods.goods.goodsName + "</td>" +
                    "       <td>" + datas[i].goods.goods.unit + "</td>\n" +
                    "       <td>" + parseFloat(datas[i].goods.goods.salePrice) + "</td>\n" +
                    "       <td>" + datas[i].goods.goods.stock + "</td>\n" +
                    "       <td id=\'"+datas[i].goods.goods.goodsId+"goodsStatus\'>" + (datas[i].goods.goods.publish==1?'已上架':'未上架') + "</td>\n" +
                    "       <td>" + datas[i].goods.goods.putTime + "</td>\n" +
                    "       <td>" + ((datas[i].discount != null)?datas[i].discount.discount:'1') + "</td>\n" +
                    "       <td>" +  (datas[i].goods.goods.salePrice*((datas[i].discount != null)?datas[i].discount.discount:1)).toFixed(2) + "</td>\n" +
                    "       <td>\n" +
                    ((datas[i].discount != null)?
                        "           <a href='/manager/brand/editDiscountShow?discountId="+datas[i].discount.discountId+"' class=\"add add-g\">编辑</a> |\n" +
                        "           <a onclick='delPrice(\""+datas[i].discount.discountId+"\",\""+datas[i].goods.goods.goodsId+"\")' class=\"add add-g\">删除</a>"
                        :
                        "           <a href='/manager/brand/addSpecialDiscountShow?goodsId="+ datas[i].goods.goods.goodsId +"' class='add add-g'>添加折扣</a>")+
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
var modalText;
// 删除折扣
function delPrice(discountId,goodsId) {

    $("#modalConfirmBtn").off("click");
    $("#modalConfirmBtn").on("click",function () {
        $.ajax({
            url:"/manager/brand/deleteDiscount",
            type:"POST",
            dataType:"JSON",
            data:{"discountId":discountId},
            success:function (result) {
                if(result.code == 1){
                    $($("#tr"+goodsId).find("td")[10]).html(
                        "           <a href='/manager/brand/addSpecialDiscountShow?goodsId="+ goodsId +"' class='add add-g'>添加折扣</a>"
                    );
                    modalText = "删除成功";
                    $("#myModal").modal();
                }else{
                    modalText = "删除失败1";
                    $("#myModal").modal();
                }
            },
            error:function () {
                modalText = "删除失败";
                $("#myModal").modal();
            }
        })
    });

    modalText = "确认删除？";
    $("#confirmModal").modal();
}

function addDiscountAndToAddNextDiscount() {

    var cost = $("#cost").val().length;
    var sale = $("#sale").val().length;
    var market = $("#market").val().length;
    var discount = $("#discount").val().length;
    var datepicker = $("#datepicker").val().length;
    var datepickerEnd = $("#datepickerEnd").val().length;
    var goodsId = $("select[name='goodsId'] option:selected").val();
    var secondCategory = $("select[name='secondCategory'] option:selected").val();

    console.log(goodsId);
    console.log(secondCategory);

    if((cost*sale*market*discount*datepicker*datepickerEnd === 0) && (goodsId!==0) && (secondCategory!==0)){
        modalText = "请填写完商品完整信息";
        $("#myModal").modal();

    }else{
        $("#addDiscountForm").attr("action","/manager/brand/toAddNextDiscount");
        $("#addDiscountForm").submit();

    }
}
// 在改变折扣后改变折扣价格，但是有点失灵
function changeDiscounted() {
    var discount = $("#discount").val();
    var sale = $("#sale").val();

    $("#discounted").val((discount*sale).toFixed(2));
}
// 清除选项卡
function clearOption(select,str) {
    select.find("option:selected").text("");
    select.empty();
    select.append(
        "<option value=\"0\">"+str+"</option>"
    );
    $("#discounted").val("请输入折后价格");
}
// 根据一级分类查出该分类下所有的二级分类或者直接隶属于一级分类的商品
function querySecondCategoryByFirstCategory() {
    var firstCategoryId = $("select[name='firstCategory'] option:selected").val();
    var secondCategory = $("select[name='secondCategory']");
    var goodsId = $("select[name='goodsId']");

    clearOption(secondCategory,"--请选择二级分类--");
    clearOption(goodsId,"--请选择商品--");

    if(firstCategoryId !== '0'){
        $.ajax({
            url: "/manager/brand/queryCategory",
            type: "get",
            data: {
                firstCategory: firstCategoryId
            },
            success: function (data) {

                if(data.categoryList != null){
                    $.each(data.categoryList,function () {
                        secondCategory.append(
                            "<option value=\'"+this.categoryId+"\'>"+this.categoryName+"</option>"
                        );
                    });
                }
                if(data.itemList != null){
                    $.each(data.itemList,function () {
                        goodsId.append(
                            "<option value=\'"+this.goods.goodsId+"\'>"+this.goods.goodsName+"</option>"
                        );
                    });
                }

            },
            error: function () {
                alert("获取二级分类失败");
            }
        })
    }

}
// 根据二级分类查出该分类下所有的不在折扣范围内的商品
function queryGoodsBySecondCategory() {
    var secondCategoryId = $("select[name='secondCategory']").val();
    var goodsId = $("select[name='goodsId']");

    clearOption(goodsId,"--请选择商品--");

    console.log(secondCategoryId);
    if(secondCategoryId !== '0'){
        $.ajax({
            url: "/manager/brand/queryCategory",
            type: "get",
            data: {
                secondCategory: secondCategoryId
            },
            success: function (data) {
                if(data.itemList !== null){
                    $.each(data.itemList,function () {
                        console.log(data.itemList);
                        goodsId.append(
                            "<option name='goodsId' value=\'"+this.goods.goodsId+"\'>"+this.goods.goodsName+"</option>"
                        );
                    });
                }
            },
            error: function () {
                alert("获取商品失败")
            }
        })
    }

}
// 展示商品的详细信息
function showGoods() {
    var goodsId = $("select[name='goodsId'] option:selected").val();
    var cost = $("#cost");
    var sale = $("#sale");
    var market = $("#market");
    var stock = $("#stock");

    if(goodsId !== '0'){
        $.ajax({
            url: "/manager/brand/goodsPrice",
            type: "get",
            data: {
                goodsId: goodsId
            },
            success: function (data) {
                cost.val(data.costPrice);
                sale.val(data.salePrice);
                market.val(data.marketPrice);
                stock.val(data.stock);
                $("#img1").attr("src", data.picture);
            },
            error: function () {
                alert("获取商品详细信息失败")
            }
        })
    }else{

    }
}