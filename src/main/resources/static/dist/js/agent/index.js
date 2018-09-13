$(function () {
    var html = "";
    $("#input_city").append(html); $("#input_area").append(html);
    $.each(pdata,function(idx,item){
        if (parseInt(item.level) == 0) {
            html += "<option value='" + item.names + "' exid='" + item.code + "'>" + item.names + "</option>";
        }
    });
    $("#input_province").append(html);
    $("#input_province").change(function(){
        if ($(this).val() == "") return;
        $("#input_city option").remove(); $("#input_area option").remove();
        var code = $(this).find("option:selected").attr("exid"); code = code.substring(0,2);
        var html = "<option value=''>--请选择--</option>"; $("#input_area").append(html);
        $.each(pdata,function(idx,item){
            if (parseInt(item.level) == 1 && code == item.code.substring(0,2)) {
                html += "<option value='" + item.names + "' exid='" + item.code + "'>" + item.names + "</option>";
            }
        });
        $("#input_city").append(html);
    });
    $("#input_city").change(function(){
        if ($(this).val() == "") return;
        $("#input_area option").remove();
        var code = $(this).find("option:selected").attr("exid"); code = code.substring(0,4);
        var html = "<option value=''>--请选择--</option>";
        $.each(pdata,function(idx,item){
            if (parseInt(item.level) == 2 && code == item.code.substring(0,4)) {
                html += "<option value='" + item.names + "' exid='" + item.code + "'>" + item.names + "</option>";
            }
        });
        $("#input_area").append(html);
    });
});

function selectDistrict() {
    var input_province = $("#input_province").val()
    var input_city = $("#input_city").val()
    var input_area = $("#input_area").val()
    $.ajax({
        url:"/manager/agent/stores",
        type:"POST",
        data:{"province":input_province, "city":input_city, "district": input_area},
        dataType:"JSON",
        success:function (result) {
            if (result.code == 1){
                var stores = result.data
                $("#stores").html("<option value='0'>--请选择--</option>")
                $.each(stores, function (index, store) {
                    $("#stores").append(" <option value=\""+store.storeId+"\">"+store.storeName+"</option>")
                })
            }else{
                alert("获取数据失败")
            }
        },
        error:function () {
            alert("获取数据失败")
        }
    })
}

function selectStore() {
    var storeId = $("#stores").val()
    if (storeId == '0'){
        return
    }
    $.ajax({
        url:"/manager/agent/storeInfo",
        type:"POST",
        data:{"storeId":storeId},
        dataType:"JSON",
        success:function (result) {
            if (result.code == 1){
                var data = result.data
                var nowSale = data.nowSale
                var yesSale = data.yesSale
                var updateTime = data.updateTime;
                $("#updateTime").html(updateTime)
                $("#storeSale").html(nowSale.saleMoney)
                $("#yesterdayStoreSale").html(yesSale.saleMoney)
                $("#orderCount").html(nowSale.saleOrderNumber)
                $("#yesterdayOrderCount").html(yesSale.saleOrderNumber)
                $("#storeProfit").html(nowSale.saleProfit)
                $("#yesterdayStoreProfit").html(yesSale.saleProfit)
                $("#storeRate").html(nowSale.saleRatio+'%')
                $("#yesterdayStoreRate").html(yesSale.saleRatio+'%')
                $("#newCustomerCount").html(nowSale.newOrder)
                $("#yesterdayCustomerCount").html(yesSale.newOrder)
                $("#payCustomerCount").html(nowSale.payOrder)
                $("#yesterdayPayCustomerCount").html(yesSale.payOrder)
                $("#rechargeCount").html("0.00")
                $("#yesterdayRechargeCount").html("0.00")
                $("#newRecharge").html("0.00")
                $("#yesterdayNewRecharge").html("0.00")
            }else {
                alert("获取数据失败")
            }
        },
        error:function () {
            alert("获取数据失败")
        }
    })
}

function clearStoreSearch() {
    $("#input_province").find("option:first").attr("selected","selected");
    $("#input_city").html("");
    $("#input_area").html("");
    $("#input_storeName").val("");
}



function queryStore() {
    $.ajax({
        url:"/manager/agent/fuzzySearchStore",
        type:"POST",
        data:{"storeName":$("#input_storeName").val(), "province":$("#input_province").val(), "city":$("#input_city").val(), "district":$("#input_area").val()},
        dataType:"JSON",
        success:function (result) {
            if (result.code != 1){
                alert("请求数据失败")
            }else{
                var stores = result.data
                $('.table-goods').dataTable().fnClearTable(); //清空一下table
                $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                $.each(stores, function (index, storeDTO) {
                    var tr = "<tr>\n" +
                        "              <td>"+(index+1)+"</td>\n" +
                        "              <td>"+storeDTO.store.storeId+"</td>\n" +
                        "              <td>"+storeDTO.store.storeName+"</td>\n" +
                        "              <td>"+storeDTO.store.contactName+"</td>\n" +
                        "              <td>"+storeDTO.store.contactPhone+"</td>\n" +
                        "              <td>"+storeDTO.store.area+"</td>\n" +
                        "              <td>"+storeDTO.agent.agentName+"</td>\n" +
                        "              <td>"+((storeDTO.store.status==1)?'正常':'冻结')+"</td>\n" +
                        "              <td>"+storeDTO.sale.toFixed(2)+"</td>\n" +
                        "              <td>"+new Date(storeDTO.store.createTime).Format("yyyy-MM-dd hh:mm")+"</td>\n" +
                        "              <td>\n" +
                        "                <a href='/manager/agent/toCheckStore?storeId="+storeDTO.store.storeId+"' class=\"add add-g\">查看</a>\n" +
                        "              </td>\n" +
                        "            </tr>"
                    $('.table-goods').find("tbody").append(tr);
                });
                initTable($('.table-goods'));
            }
        },
        error:function () {
            alert("请求数据失败")
        }
    })
}

function clearStoreSearch() {
    $("#input_province").find("option:first").attr("selected","selected");
    $("#input_city").html("");
    $("#input_area").html("");
    $("#input_storeName").val("")
}

