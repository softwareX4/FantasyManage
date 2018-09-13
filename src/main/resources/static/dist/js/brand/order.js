/**
 * Created by qiu on 18/6/11.
 */
$('#datepicker').datepicker({
    // 使得显示出来的日期栏在下方，防止被头部导航栏挡住
    orientation: 'bottom',
    format: 'yyyy-mm-dd'
});
$('#datepickerEnd').datepicker({
    orientation: 'bottom',
    format: 'yyyy-mm-dd'
});
$(function () {

    var myTable = initOrderTable($('.table-goods'));
    myTable.order([[6,'decs'],[7,'decs']]).draw();

    $(".datepicker").on("blur", function () {
        if ($(this).val().length === 0) {
            var date = new Date();
            var seperator1 = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var end = date.getFullYear() + seperator1 + month + seperator1 + strDate;

            $(this).val(end);
        }
    });

    $("#datepicker").change(function () {
        if ($(this).val() > $("#datepickerEnd").val()) {
            modalText = "开始时间不能晚于结束时间";
            $("#myModal").modal();
            $("#datepickerEnd").val($(this).val());
        }
    });
    $("#datepickerEnd").change(function () {
        if ($(this).val() < $("#datepicker").val()) {
            modalText = "开始时间不能晚于结束时间";
            $("#myModal").modal();
            $("#datepicker").val($(this).val());
        }
    });

});

// 初始化订单表格
function initOrderTable(object) {
    var myTable =  object.DataTable({
        'paging'      : true,
        'lengthChange': false,
        'searching'   : true,
        "columnDefs": [
            { "orderable": false, "targets": [0,1,2,3,4,5,8,9] }
        ],
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

    //为datatable增加序号列
    myTable.on('order.dt search.dt',function(){
        myTable.column(0,{
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

    return myTable;

}

// 根据标签展示订单（很长，后期需要优化）
function orderTypeClick(payStatus, send) {
    $.ajax({
        url: "/manager/store/order/sendAndPayStatus",
        type: "POST",
        dataType: "JSON",
        data: {
            "payStatus": payStatus,
            "send": send
        },
        success: function (result) {
            if (result.code === 200) {
                $('.table-goods').dataTable().fnClearTable(); //清空一下table
                $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                $("#orderNumberInput").val("");
                $("#datepicker").val("");
                $("#datepickerEnd").val("");

                // 根据数据库的字段进行操作的显示，此处需要后期优化
                var operation = "";
                var status;
                if (send === 2){
                    operation = "未发货";
                }
                if (payStatus === 5){
                    operation = "未退款";
                } else if (payStatus === 2){
                    operation = "未付款";
                }
                switch (operation) {
                    case "未付款":
                        $.each(result.orderList, function (index, order) {

                            status = confirmStatus(order.ysOrder.payStatus);

                            var tr = "<tr>\n" +
                                "<td>" + (index + 1) + "</td>\n" +
                                "<td>" + order.ysOrder.orderId + "</td>\n" +
                                "<td>" + order.userDTO.nickname + "</td>\n" +
                                "<td>" + order.userDTO.phone + "</td>\n" +
                                "<td>" + order.ysOrder.price + "</td>\n" +
                                "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                                "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                                "<td>" + status + "</td>\n" +
                                "<td>\n" +
                                "<a href='/manager/store/order/details?id=" + order.ysOrder.id + "'\n" +
                                "class=\"add add-g\">查看</a>&nbsp;\n" +
                                "</td>\n" +
                                "</tr>";
                            $('.table-goods').find("tbody").append(tr);

                        });
                        break;
                    case "未发货":
                        $.each(result.orderList, function (index, order) {

                            status = confirmStatus(order.ysOrder.payStatus);

                            var tr = "<tr id='" + order.ysOrder.orderId + "'>\n" +
                                "<td>" + (index + 1) + "</td>\n" +
                                "<td>" + order.ysOrder.orderId + "</td>\n" +
                                "<td>" + order.userDTO.nickname + "</td>\n" +
                                "<td>" + order.userDTO.phone + "</td>\n" +
                                "<td>" + order.ysOrder.price + "</td>\n" +
                                "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                                "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                                "<td>" + status + "</td>\n" +
                                "<td>\n" +
                                "<a href='/manager/store/order/details?id=" + order.ysOrder.id + "'\n" +
                                "class=\"add add-g\">查看</a>&nbsp;\n" +
                                "<a onclick=\"changeStatus('/manager/store/order/changeStatus'," + order.ysOrder.orderId + ",0,3,'发货成功')\" class=\"add add-g\">确认发货</a>\n" +
                                "</td>\n" +
                                "</tr>";

                            if(status === "已支付" || (status === "未支付" && order.ysOrder.payType === 2) || status === "货到付款"){
                                $('.table-goods').find("tbody").append(tr);
                            }
                        });
                        break;
                    case "未退款":
                        $.each(result.orderList, function (index, order) {

                            status = confirmStatus(order.ysOrder.payStatus);

                            var tr = "<tr id='" + order.ysOrder.orderId + "'>\n" +
                                "<td>" + (index + 1) + "</td>\n" +
                                "<td>" + order.ysOrder.orderId + "</td>\n" +
                                "<td>" + order.userDTO.nickname + "</td>\n" +
                                "<td>" + order.userDTO.phone + "</td>\n" +
                                "<td>" + order.ysOrder.price + "</td>\n" +
                                "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                                "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                                "<td>" + status + "</td>\n" +
                                "<td>\n" +
                                "<a href='/manager/store/order/details?id=" + order.ysOrder.id + "'\n" +
                                "class=\"add add-g\">查看</a>&nbsp;\n" +
                                "<a onclick=\"changeStatus('/manager/store/order/changeStatus'," + order.ysOrder.orderId + ",6,0,'退款成功')\" class=\"add add-g\">确认退款</a>\n" +
                                "<a onclick=\"changeStatus('/manager/store/order/changeStatus'," + order.ysOrder.orderId + ",7,0,'拒绝成功')\" class=\"add add-g\">拒绝退款</a>\n" +
                                "</td>\n" +
                                "</tr>";
                            $('.table-goods').find("tbody").append(tr);
                        });
                        break;
                    default:
                        $.each(result.orderList, function (index, order) {

                            status = confirmStatus(order.ysOrder.payStatus);
                            var tr = "<tr id='" + order.ysOrder.orderId + "'>\n" +
                                "<td>" + (index + 1) + "</td>\n" +
                                "<td>" + order.ysOrder.orderId + "</td>\n" +
                                "<td>" + order.userDTO.nickname + "</td>\n" +
                                "<td>" + order.userDTO.phone + "</td>\n" +
                                "<td>" + order.ysOrder.price + "</td>\n" +
                                "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                                "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                                "<td>" + status + "</td>\n" +
                                "<td>\n" +
                                "<a href='/manager/store/order/details?id=" + order.ysOrder.id + "'\n" +
                                "class=\"add add-g\">查看</a>&nbsp;\n" +
                                "</td>\n" +
                                "</tr>";
                            $('.table-goods').find("tbody").append(tr);

                        });
                        break;
                }
                var myTable = initOrderTable($('.table-goods'));
                myTable.order([[6,'decs'],[7,'decs']]).draw();
            } else {
                modalText = "获取数据失败";
                $("#myModal").modal();
            }
        },
        error: function () {
            modalText = "获取数据失败";
            $("#myModal").modal();
        }
    })
}

// 根据数据库字段payStatus确定订单状态
function confirmStatus(payStatus) {
    var status;
    switch (payStatus) {
        case 1:
            status = "已支付";
            break;
        case 2:
            status = "未支付";
            break;
        case 3:
            status = "取消支付";
            break;
        case 4:
            status = "货到付款";
            break;
        case 5:
            status = "申请退款";
            break;
        case 6:
            status = "已退款";
            break;
        case 7:
            status = "拒绝退款";
            break;
        default:
            status = "已支付";
            break;
    }
    return status;
}

// AJAX,修改订单状态
function changeStatus(url, orderId, payStatus, send, msg) {


    $.ajax({
        url: url,
        data: {
            orderId: orderId,
            payStatus: payStatus,
            send: send
        },
        success: function (data) {
            // var responseInfo = data.getElementsByTagName("msg")[0].firstChild.data;
            if (data.code === 1) {
                $("tr#" + orderId).remove();
                modalText = msg;
                $("#myModal").modal();
            } else {
                modalText = "更改订单状态失败";
                $("#myModal").modal();
            }
        },
        error: function () {
            modalText = "更改订单状态失败";
            $("#myModal").modal();
        }
    });
}

// 全局搜索
function filterGlobal(value) {

    $('.table-goods').DataTable().column(1).search(value, false, true).draw();

}

// 根据订单号展示订单
function orderNumberClick() {
    var value = $('#orderNumberInput').val();
    console.log(value);
    if (value.trim().length === 0) {

        $("#myTab").find("li").removeClass("active");
        $("#myTab").find("li").first().addClass("active");

        $.ajax({
            url: "/manager/store/order/sendAndPayStatus",
            type: "POST",
            dataType: "JSON",
            data: {
                "payStatus": 0,
                "send": 0
            },
            success: function (result) {
                if (result.code == 200) {
                    $('.table-goods').dataTable().fnClearTable(); //清空一下table
                    $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable

                    $.each(result.orderList, function (index, order) {

                        status = confirmStatus(order.ysOrder.payStatus);

                        var tr = "<tr>\n" +
                            "<td>" + (index + 1) + "</td>\n" +
                            "<td>" + order.ysOrder.orderId + "</td>\n" +
                            "<td>" + order.userDTO.nickname + "</td>\n" +
                            "<td>" + order.userDTO.phone + "</td>\n" +
                            "<td>" + order.ysOrder.price + "</td>\n" +
                            "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                            "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                            "<td>" + status + "</td>\n" +
                            "<td>\n" +
                            "<a href='/manager/store/order/details?id=" + order.ysOrder.id + "'\n" +
                            "class=\"add add-g\">查看</a>&nbsp;\n" +
                            "</td>\n" +
                            "</tr>";
                        $('.table-goods').find("tbody").append(tr);
                    });

                    var myTable = initOrderTable($('.table-goods'));
                    myTable.order([[6,'decs'],[7,'decs']]).draw();
                } else {
                    modalText = "获取数据失败";
                    $("#myModal").modal();
                }
            },
            error: function () {
                modalText = "获取数据失败";
                $("#myModal").modal();
            }
        });

    } else {
        filterGlobal(value);
    }
}

// 根据订单日期展示订单
function orderDateClick() {
    var send = $("#myTab").find(".active").index() / 2;
    var startDate = $("#datepicker").val();
    var endDate = $("#datepickerEnd").val();
    if ((startDate.length * endDate.length) === 0) {
        modalText = "请输入搜索的日期";
        $("#myModal").modal();

        return;
    }
    else {
        $.ajax({
            url: "/manager/store/order/date",
            type: "POST",
            dataType: "JSON",
            data: {
                "send": send,
                "startDate": startDate,
                "endDate": endDate
            },
            success: function (result) {
                if (result.code === 200) {
                    $('.table-goods').dataTable().fnClearTable(); //清空一下table
                    $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                    $("#orderNumberInput").val("");
                    $.each(result.orderList, function (index, order) {
                        var tr = "<tr>\n" +
                            "<td>" + (index + 1) + "</td>\n" +
                            "<td>" + order.ysOrder.orderId + "</td>\n" +
                            "<td>" + order.userDTO.nickname + "</td>\n" +
                            "<td>" + order.userDTO.phone + "</td>\n" +
                            "<td>" + order.ysOrder.price + "</td>\n" +
                            "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                            "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                            "<td>" + ((order.ysOrder.payStatus) == 1 ? '已支付' : '未支付') + "</td>\n" +
                            "<td>\n" +
                            "<a href='/manager/store/order/details?id=" + order.ysOrder.id + "'\n" +
                            "class=\"add add-g\">查看</a>\n" +
                            "</td>\n" +
                            "</tr>";
                        $('.table-goods').find("tbody").append(tr);
                    });
                    var myTable = initOrderTable($('.table-goods'));
                    myTable.order([[6,'decs'],[7,'decs']]).draw();
                    $("#orderNumberInput").val("");
                    $("#datepicker").val(startDate);
                    $("#datepickerEnd").val(endDate)
                } else {
                    modalText = "获取数据失败";
                    $("#myModal").modal();
                }
            },
            error: function () {
                modalText = "获取数据失败";
                $("#myModal").modal();
            }
        })
    }
}

function orderNumberRemove() {
    $("#orderNumberInput").val("")
}

// 根据标签展示品牌商订单（很长，后期需要优化）
function brand_orderTypeClick(payStatus, send) {
    $.ajax({
        url: "/manager/brand/order/sendAndPayStatus",
        type: "POST",
        dataType: "JSON",
        data: {
            "payStatus": payStatus,
            "send": send
        },
        success: function (result) {
            if (result.code == 200) {
                $('.table-goods').dataTable().fnClearTable(); //清空一下table
                $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                $("#orderNumberInput").val("");
                $("#datepicker").val("");
                $("#datepickerEnd").val("");

                // 根据数据库的字段进行操作的显示，此处需要后期优化
                var operation = "";
                var status;
                if (send === 2){
                    operation = "未发货";
                }
                if (payStatus === 5){
                    operation = "未退款";
                } else if (payStatus === 2){
                    operation = "未付款";
                }
                switch (operation) {
                    case "未付款":
                        $.each(result.orderList, function (index, order) {

                            status = confirmStatus(order.ysOrder.payStatus);

                            var tr = "<tr>\n" +
                                "<td>" + (index + 1) + "</td>\n" +
                                "<td>" + order.ysOrder.storeId + "</td>\n" +
                                "<td>" + order.ysOrder.orderId + "</td>\n" +
                                "<td>" + order.userDTO.nickname + "</td>\n" +
                                "<td>" + order.userDTO.phone + "</td>\n" +
                                "<td>" + order.ysOrder.price + "</td>\n" +
                                "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                                "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                                "<td>" + status + "</td>\n" +
                                "<td>\n" +
                                "<a href='/manager/brand/order/details?id=" + order.ysOrder.id + "'\n" +
                                "class=\"add add-g\">查看</a>&nbsp;\n" +
                                "</td>\n" +
                                "</tr>";
                            $('.table-goods').find("tbody").append(tr);

                        });
                        break;
                    case "未发货":
                        $.each(result.orderList, function (index, order) {

                            status = confirmStatus(order.ysOrder.payStatus);

                            var tr = "<tr id='" + order.ysOrder.orderId + "'>\n" +
                                "<td>" + (index + 1) + "</td>\n" +
                                "<td>" + order.ysOrder.storeId + "</td>\n" +
                                "<td>" + order.ysOrder.orderId + "</td>\n" +
                                "<td>" + order.userDTO.nickname + "</td>\n" +
                                "<td>" + order.userDTO.phone + "</td>\n" +
                                "<td>" + order.ysOrder.price + "</td>\n" +
                                "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                                "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                                "<td>" + status + "</td>\n" +
                                "<td>\n" +
                                "<a href='/manager/brand/order/details?id=" + order.ysOrder.id + "'\n" +
                                "class=\"add add-g\">查看</a>&nbsp;\n" +
                                "</td>\n" +
                                "</tr>";

                            if(status === "已支付" || (status === "未支付" && order.ysOrder.payType === 2) || status === "货到付款"){
                                $('.table-goods').find("tbody").append(tr);
                            }
                        });
                        break;
                    case "未退款":
                        $.each(result.orderList, function (index, order) {

                            status = confirmStatus(order.ysOrder.payStatus);

                            var tr = "<tr id='" + order.ysOrder.orderId + "'>\n" +
                                "<td>" + (index + 1) + "</td>\n" +
                                "<td>" + order.ysOrder.storeId + "</td>\n" +
                                "<td>" + order.ysOrder.orderId + "</td>\n" +
                                "<td>" + order.userDTO.nickname + "</td>\n" +
                                "<td>" + order.userDTO.phone + "</td>\n" +
                                "<td>" + order.ysOrder.price + "</td>\n" +
                                "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                                "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                                "<td>" + status + "</td>\n" +
                                "<td>\n" +
                                "<a href='/manager/brand/order/details?id=" + order.ysOrder.id + "'\n" +
                                "class=\"add add-g\">查看</a>&nbsp;\n" +
                                "</td>\n" +
                                "</tr>";
                            $('.table-goods').find("tbody").append(tr);
                        });
                        break;
                    default:
                        $.each(result.orderList, function (index, order) {

                            status = confirmStatus(order.ysOrder.payStatus);
                            var tr = "<tr id='" + order.ysOrder.orderId + "'>\n" +
                                "<td>" + (index + 1) + "</td>\n" +
                                "<td>" + order.ysOrder.storeId + "</td>\n" +
                                "<td>" + order.ysOrder.orderId + "</td>\n" +
                                "<td>" + order.userDTO.nickname + "</td>\n" +
                                "<td>" + order.userDTO.phone + "</td>\n" +
                                "<td>" + order.ysOrder.price + "</td>\n" +
                                "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                                "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                                "<td>" + status + "</td>\n" +
                                "<td>\n" +
                                "<a href='/manager/brand/order/details?id=" + order.ysOrder.id + "'\n" +
                                "class=\"add add-g\">查看</a>&nbsp;\n" +
                                "</td>\n" +
                                "</tr>";
                            $('.table-goods').find("tbody").append(tr);

                        });
                        break;
                }
                var myTable = initOrderTable($('.table-goods'));
                myTable.order([[6,'decs'],[7,'decs']]).draw();
            } else {
                modalText = "获取数据失败";
                $("#myModal").modal();
            }
        },
        error: function () {
            modalText = "获取数据失败";
            $("#myModal").modal();
        }
    })
}

// 根据订单号展示品牌商订单
function brand_orderNumberClick() {
    var value = $('#orderNumberInput').val();
    console.log(value);
    if (value.trim().length === 0) {

        $("#myTab").find("li").removeClass("active");
        $("#myTab").find("li").first().addClass("active");

        $.ajax({
            url: "/manager/brand/order/sendAndPayStatus",
            type: "POST",
            dataType: "JSON",
            data: {
                "payStatus": 0,
                "send": 0
            },
            success: function (result) {
                if (result.code == 200) {
                    $('.table-goods').dataTable().fnClearTable(); //清空一下table
                    $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable

                    $.each(result.orderList, function (index, order) {

                        status = confirmStatus(order.ysOrder.payStatus);

                        var tr = "<tr>\n" +
                            "<td>" + (index + 1) + "</td>\n" +
                            "<td>" + order.ysOrder.storeId + "</td>\n" +
                            "<td>" + order.ysOrder.orderId + "</td>\n" +
                            "<td>" + order.userDTO.nickname + "</td>\n" +
                            "<td>" + order.userDTO.phone + "</td>\n" +
                            "<td>" + order.ysOrder.price + "</td>\n" +
                            "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                            "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                            "<td>" + status + "</td>\n" +
                            "<td>\n" +
                            "<a href='/manager/brand/order/details?id=" + order.ysOrder.id + "'\n" +
                            "class=\"add add-g\">查看</a>&nbsp;\n" +
                            "</td>\n" +
                            "</tr>";
                        $('.table-goods').find("tbody").append(tr);
                    });

                    var myTable = initOrderTable($('.table-goods'));
                    myTable.order([[6,'decs'],[7,'decs']]).draw();
                } else {
                    modalText = "获取数据失败";
                    $("#myModal").modal();
                }
            },
            error: function () {
                modalText = "获取数据失败";
                $("#myModal").modal();
            }
        });

    } else {
        filterGlobal(value);
    }
}

// 根据订单日期展示品牌商订单
function brand_orderDateClick() {
    var send = $("#myTab").find(".active").index() / 2;
    var startDate = $("#datepicker").val();
    var endDate = $("#datepickerEnd").val();
    if ((startDate.length * endDate.length) === 0) {
        modalText = "请输入搜索的日期";
        $("#myModal").modal();

        return
    }
    else {
        $.ajax({
            url: "/manager/brand/order/date",
            type: "POST",
            dataType: "JSON",
            data: {
                "send": send,
                "startDate": startDate,
                "endDate": endDate
            },
            success: function (result) {
                if (result.code == 200) {
                    $('.table-goods').dataTable().fnClearTable(); //清空一下table
                    $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                    $("#orderNumberInput").val("");
                    $.each(result.orderList, function (index, order) {
                        var tr = "<tr>\n" +
                            "<td>" + (index + 1) + "</td>\n" +
                            "<td>" + order.ysOrder.storeId + "</td>\n" +
                            "<td>" + order.ysOrder.orderId + "</td>\n" +
                            "<td>" + order.userDTO.nickname + "</td>\n" +
                            "<td>" + order.userDTO.phone + "</td>\n" +
                            "<td>" + order.ysOrder.price + "</td>\n" +
                            "<td>\n" + new Date(order.ysOrder.createTime).Format("yyyy-MM-dd hh:mm:ss") + "</td>\n" +
                            "<td>\n" + ((order.ysOrder.payTime) == null ? '未支付' : new Date(order.ysOrder.payTime).Format("yyyy-MM-dd hh:mm:ss")) + "</td>\n" +
                            "<td>" + ((order.ysOrder.payStatus) == 1 ? '已支付' : '未支付') + "</td>\n" +
                            "<td>\n" +
                            "<a href='/manager/brand/order/details?id=" + order.ysOrder.id + "'\n" +
                            "class=\"add add-g\">查看</a>\n" +
                            "</td>\n" +
                            "</tr>";
                        $('.table-goods').find("tbody").append(tr);
                    });
                    var myTable = initOrderTable($('.table-goods'));
                    myTable.order([[6,'decs'],[7,'decs']]).draw();
                    $("#orderNumberInput").val("");
                    $("#datepicker").val(startDate);
                    $("#datepickerEnd").val(endDate)
                } else {
                    modalText = "获取数据失败";
                    $("#myModal").modal();
                }
            },
            error: function () {
                modalText = "获取数据失败";
                $("#myModal").modal();
            }
        })
    }
}