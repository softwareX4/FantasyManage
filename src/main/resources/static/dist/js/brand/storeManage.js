function freezed(that,storeId) {

    $("#modalConfirmBtn").off("click");
    $("#modalConfirmBtn").on("click",function () {
        $.ajax({
            url:"/manager/brand/freezedStore",
            type:"POST",
            data:{"storeId":storeId},
            dataType:"JSON",
            success:function (result) {
                if (result.code == 1){
                    $("#statusA"+storeId).html("启用");
                    $("#statusA"+storeId).attr("onclick","use(this,\'"+storeId+"\')");
                    $("#status"+storeId).html("冻结");
                    $("#editA"+storeId).attr("style","color:gray;");
                    $("#editA"+storeId).attr("href","")
                }else {
                    alert("冻结失败")
                }
            },
            error:function () {
                alert("网络错误")
            }
        })
    });
    modalText = "确认冻结？";
    $("#confirmModal").modal();

}

function use(that,storeId) {

    var storeName = $(that).parent().parent().children().eq(2).text();

    if(storeName.trim().length === 0){
        modalText = "该门店信息不全，无法启用";
        $("#myModal").modal();
    }else{
        $("#modalConfirmBtn").off("click");
        $("#modalConfirmBtn").on("click",function () {
            $.ajax({
                url:"/manager/brand/useStore",
                type:"POST",
                data:{"storeId":storeId},
                dataType:"JSON",
                success:function (result) {
                    if (result.code == 1){
                        $("#statusA"+storeId).html("冻结");
                        $("#statusA"+storeId).attr("onclick","freezed(this,\'"+storeId+"\')");
                        $("#status"+storeId).html("正常");
                        $("#editA"+storeId).attr("style","");
                        $("#editA"+storeId).attr("href","/manager/brand/toEditStore?storeId="+storeId);
                    }else {
                        alert("启用失败")
                    }
                },
                error:function () {
                    alert("网络错误")
                }
            })
        });

        modalText = "确认启用？";
        $("#confirmModal").modal();
    }



}

function delStore(storeId) {

    $("#modalConfirmBtn").off("click");
    $("#modalConfirmBtn").on("click",function () {
        $.ajax({
            url:"/manager/brand/delStore",
            type:"POST",
            data:{"storeId":storeId},
            dataType:"JSON",
            success:function (result) {
                if (result.code === 1){
                    modalText = "删除成功";
                    $("#myModal").modal();
                    $('.table-goods').DataTable().row("#tr"+storeId).remove().draw( false );
                }else {
                    modalText = "删除失败";
                    $("#myModal").modal();
                }
            },
            error:function () {
                alert("网络错误")
            }
        })
    });


    modalText = "确认删除？";
    $("#confirmModal").modal();

}
