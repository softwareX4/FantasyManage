$(function () {

});

// 启用，禁用
$("#dataTable").on("click", ".operation", function () {

    var printId = this.parentNode.parentNode.children[1].innerHTML;
    console.log(printId);
    var text = this.text;
    var status;
    if(text === "启用"){
        status = 1;
    } else {
        status = 2;
    }
    var that = $(this);
    if (printId != null) {
        $.ajax({
            url: "/manager/print/changeStatus",
            type: "get",
            data: {
                printId: printId,
                status: status
            },
            success: function (data) {
                var msg = data.getElementsByTagName('msg')[0].firstChild.data;
                if (msg === "Success") {
                    var aStatus = $("#"+printId+"status");
                    if(text === "启用"){
                       that.text("禁用");
                       aStatus.text("已启用")
                    }
                    if(text === "禁用"){
                        that.text("启用");
                        aStatus.text("已禁用")
                    }
                }
            },
            error: function () {
                alert("更改打印机状态失败")
            }
        })
    }
});
var printId = 0;
var modalText;
// 删除
$("#dataTable").on("click", ".delete", function () {
    printId = this.parentNode.parentNode.children[1].innerHTML;

    $("#confirmModal").modal({
        backdrop : 'static',
        keyboard : false
    });

});
// 模态框中的删除事件
function deletePrint() {
    $.ajax({
        url: "/manager/print/delPrint",
        type: "get",
        data: {
            printId: printId
        },
        success: function (data) {
            var msg = data.getElementsByTagName('msg')[0].firstChild.data;
            if (msg === "Success") {
                $("#"+printId).remove();
                modalText = "删除成功";
                $("#myModal").modal({
                    backdrop : 'static',
                    keyboard : false
                });
            }
        },
        error: function () {
            modalText = "删除失败";
            $("#myModal").modal({
                backdrop : 'static',
                keyboard : false
            });
        }
    })
}
