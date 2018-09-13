/**
 * Created by qiu on 18/6/12.
 */
$(function () {
    var provinceSelector = $("#input_province");
    var citySelector = $("#input_city");
    var areaSelector = $("#input_area");

    var html = "";
    citySelector.append(html);
    areaSelector.append(html);
    $.each(pdata, function (idx, item) {
        if (parseInt(item.level) === 0) {
            html += "<option value='" + item.names + "' exid='" + item.code + "'>" + item.names + "</option>";
        }
    });
    provinceSelector.append(html);
    provinceSelector.change(function () {
        if ($(this).val().length === 0)
            return;
        $("#input_city option").remove();
        $("#input_area option").remove();
        var code = $(this).find("option:selected").attr("exid");

        var html = "";
        if (code !== undefined) {
            code = code.substring(0, 2);
            html = "<option value=''>--请选择--</option><option value='all'>所有门店</option>";
        }

        $("#input_area").append(html);
        $.each(pdata, function (idx, item) {
            if (parseInt(item.level) === 1 && code === item.code.substring(0, 2)) {
                html += "<option value='" + item.names + "' exid='" + item.code + "'>" + item.names + "</option>";
            }
        });
        citySelector.append(html);
    });
    citySelector.change(function () {
        if ($(this).val().length === 0)
            return;
        $("#input_area option").remove();

        var code = $(this).find("option:selected").attr("exid");

        var html = "";
        if (code !== undefined) {
            code = code.substring(0, 4);
            html = "<option value=''>--请选择--</option><option value='all'>所有门店</option>";
        }

        $.each(pdata, function (idx, item) {
            if (parseInt(item.level) === 2 && code === item.code.substring(0, 4)) {
                html += "<option value='" + item.names + "' exid='" + item.code + "'>" + item.names + "</option>";
            }
        });
        areaSelector.append(html);
    });
});

function selectDistrict() {
    selectStore();

    var input_province = $("#input_province").val();
    var input_city = $("#input_city").val();
    var input_area = $("#input_area").val();

    if ((input_province.length * input_city.length * input_area.length !== 0) && (input_province !== 'all' && input_city !== 'all' && input_area !== 'all')) {
        $.ajax({
            url: "/manager/brand/stores",
            type: "POST",
            data: {"province": input_province, "city": input_city, "district": input_area},
            dataType: "JSON",
            success: function (result) {
                if (result.code === 1) {
                    var stores = result.data;
                    $("#stores").html("<option value=''>--请选择--</option>");
                    $.each(stores, function (index, store) {
                        $("#stores").append(" <option value=\"" + store.storeId + "\">" + store.storeName + "</option>")
                    })
                } else {
                    alert("获取数据失败")
                }
            },
            error: function () {
                alert("获取数据失败")
            }
        });
    }
}

function selectStore() {
    var province = $("#input_province option:selected").text();
    province = (province === "所有门店") ? 'all' : province;
    province = (province === "--请选择--") ? '' : province;
    var city = $("#input_city option:selected").text();
    city = (city === "所有门店") ? 'all' : city;
    city = (city === "--请选择--") ? '' : city;
    var district = $("#input_area option:selected").text();
    district = (district === "所有门店") ? 'all' : district;
    district = (district === "--请选择--") ? '' : district;
    var storeId = $("#stores").val();
    // console.log("("+province+","+city+","+district+","+storeId+")");

    if(province === 'all' || city === 'all' || district === 'all' || (storeId != null && storeId.length !== 0)){
        // console.log(province,city,district,storeId);
        $.ajax({
            url: "/manager/brand/storeInfo",
            type: "POST",
            data: {
                "province": province,
                "city": city,
                "district": district,
                "storeId": storeId
            },
            dataType: "JSON",
            success: function (result) {
                if (result.code === 1) {
                    var data = result.data;
                    var nowSale = data.nowSale;
                    var yesSale = data.yesSale;
                    var updateTime = data.updateTime;
                    $("#updateTime").html(updateTime);
                    $("#storeSale").html(nowSale.saleMoney);
                    $("#yesterdayStoreSale").html(yesSale.saleMoney);
                    $("#orderCount").html(nowSale.saleOrderNumber);
                    $("#yesterdayOrderCount").html(yesSale.saleOrderNumber);
                    $("#storeProfit").html(nowSale.saleProfit);
                    $("#yesterdayStoreProfit").html(yesSale.saleProfit);
                    $("#storeRate").html(nowSale.saleRatio + '%');
                    $("#yesterdayStoreRate").html(yesSale.saleRatio + '%');
                    $("#newCustomerCount").html(nowSale.newOrder);
                    $("#yesterdayCustomerCount").html(yesSale.newOrder);
                    $("#payCustomerCount").html(nowSale.payOrder);
                    $("#yesterdayPayCustomerCount").html(yesSale.payOrder);
                    $("#rechargeCount").html("0.00");
                    $("#yesterdayRechargeCount").html("0.00");
                    $("#newRecharge").html("0.00");
                    $("#yesterdayNewRecharge").html("0.00");
                } else {
                    alert("获取数据失败")
                }
            },
            error: function () {
                alert("获取数据失败")
            }
        });
    }else if(province !== 'all' && city !== 'all' && district !== 'all' && (storeId == null || storeId.length === 0)){
        // 若不选择某个具体门店也不选择所有门店
        $("#storeSale").html("----");
        $("#yesterdayStoreSale").html("----");
        $("#orderCount").html("--");
        $("#yesterdayOrderCount").html("--");
        $("#storeProfit").html("----");
        $("#yesterdayStoreProfit").html("----");
        $("#storeRate").html("--%");
        $("#yesterdayStoreRate").html("--%");
        $("#newCustomerCount").html("--");
        $("#yesterdayCustomerCount").html("--");
        $("#payCustomerCount").html("--");
        $("#yesterdayPayCustomerCount").html("--");
        $("#rechargeCount").html("--");
        $("#yesterdayRechargeCount").html("--");
        $("#newRecharge").html("----");
        $("#yesterdayNewRecharge").html("----");
    }

}

function clearStoreSearch() {
    $("#input_province").find("option:first").attr("selected", "selected");
    $("#input_city").html("");
    $("#input_area").html("");
    $("#input_storeName").val("")
}


function queryStore() {
    $.ajax({
        url: "/manager/brand/fuzzySearchStore",
        type: "POST",
        data: {
            "storeName": $("#input_storeName").val(),
            "province": $("#input_province").val(),
            "city": $("#input_city").val(),
            "district": $("#input_area").val()
        },
        dataType: "JSON",
        success: function (result) {
            if (result.code != 1) {
                alert("请求数据失败")
            } else {
                var stores = result.data;
                $('.table-goods').dataTable().fnClearTable(); //清空一下table
                $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                $.each(stores, function (index, storeDTO) {
                    var areaStr = storeDTO.store.area;
                    if (areaStr.length > 7) {
                        areaStr = "..." + areaStr.substring(areaStr.length - 7, areaStr.length)
                    }
                    var click;
                    if (storeDTO.store.status == 1) {
                        click = "freezed(\'" + storeDTO.store.storeId + "\')"
                    } else {
                        click = "use(\'" + storeDTO.store.storeId + "\')"
                    }
                    var ahref = ((storeDTO.store.status === 1) ? '/manager/brand/toEditStore?storeId=' + storeDTO.store.storeId : '#');
                    var tr = "<tr id='tr" + storeDTO.store.storeId + "'>\n" +
                        "              <td>" + (index + 1) + "</td>\n" +
                        "              <td>" + storeDTO.store.storeId + "</td>\n" +
                        "              <td>" + storeDTO.store.storeName + "</td>\n" +
                        "              <td>" + storeDTO.store.contactName + "</td>\n" +
                        "              <td>" + storeDTO.store.contactPhone + "</td>\n" +
                        "              <td>" + areaStr + "</td>\n" +
                        "              <td>" + storeDTO.agent.agentName + "</td>\n" +
                        "              <td id='status" + storeDTO.store.storeId + "'>" + ((storeDTO.store.status == 1) ? "正常" : "冻结") + "</td>\n" +
                        "              <td>" + storeDTO.sale.toFixed(2) + "</td>\n" +
                        "              <td>" + new Date(storeDTO.store.createTime).Format("yyyy-MM-dd hh:mm") + "</td>\n" +
                        "              <td>\n" +
                        "                <a href='/manager/brand/checkStore?storeId=" + storeDTO.store.storeId + "' class=\"add add-g\">查看</a> |\n" +
                        "                <a id='editA" + storeDTO.store.storeId + "' href='" + ahref + "' style='" + ((storeDTO.store.status != 1) ? 'color:gray;' : '') + "' class=\"add add-g\">编辑</a> |\n" +
                        "                <a id='statusA" + storeDTO.store.storeId + "' onclick=" + click + " class=\"add add-g\">" + ((storeDTO.store.status == 1) ? "冻结" : "启用") + "</a> |\n" +
                        "                <a onclick=\"delStore(\'" + storeDTO.store.storeId + "\')\" class=\"add add-g\">删除</a>\n" +
                        "              </td>\n" +
                        "            </tr>";
                    $('.table-goods').find("tbody").append(tr);

                });
                initTable($('.table-goods'));
            }
        },
        error: function () {
            alert("请求数据失败")
        }
    })
}