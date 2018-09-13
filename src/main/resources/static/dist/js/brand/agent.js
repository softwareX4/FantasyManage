var modalText;
// 搜索代理商
function searchAgent() {
    var agentName = $("#input_agentName").val();
    var agentLevelId = $("#input_agentLevel").val();

    $.ajax({
        url:"/manager/brand/searchAgents",
        type:"POST",
        data:{"agentName": agentName, "agentLevelId": agentLevelId},
        dataType:"JSON",
        success:function (result) {
            if (result.code != 1){
                alert("请求数据失败")
            }else{
                var agentDTOs = result.data;
                console.log(agentDTOs);
                console.log(agentDTOs.length);
                // $("#agentsTable").html("");
                $('.table-goods').dataTable().fnClearTable(); //清空一下table
                $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                $.each(agentDTOs, function (index, agentDTO) {
                    var status;
                    if(agentDTO.agent.status == 1){
                        status = "正常"
                    }else{
                        status = "冻结"
                    }
                    var areaStr = agentDTO.agent.area;
                    if (areaStr.length > 7){
                        areaStr = "..." + areaStr.substring(areaStr.length-7,areaStr.length)
                    }

                    var click;
                    if(agentDTO.agent.status == 1){
                        click = "freezedAgent(\'"+agentDTO.agent.agentId+"\')"
                    }else{
                        click = "useAgent(\'"+agentDTO.agent.agentId+"\')"
                    }
                    console.log(agentDTO.level);
                    var tr = "<tr id='tr"+agentDTO.agent.agentId+"'>\n" +
                        "              <td>"+(index+1)+"</td>\n" +
                        "              <td>"+agentDTO.agent.agentId+"</td>\n" +
                        "              <td>"+agentDTO.agent.agentName+"</td>\n" +
                        "              <td>"+agentDTO.agent.contactName+"</td>\n" +
                        "              <td>"+agentDTO.agent.contectPhone+"</td>\n" +
                        "              <td>"+agentDTO.level.agentLevelName+"</td>\n" +
                        "              <td>"+areaStr+"</td>\n" +
                        "              <td>"+agentDTO.storeCount+"</td>\n" +
                        "              <td id='status"+agentDTO.agent.agentId+"'>"+status+"</td>\n" +
                        "              <td>"+agentDTO.sale.toFixed(2)+"</td>\n" +
                        "              <td>"+new Date(agentDTO.agent.createTime).Format("yyyy-MM-dd hh:mm")+"</td>\n" +
                        "              <td>\n" +
                        "                <a href=\"/manager/brand/checkAgent?agentId="+agentDTO.agent.agentId+"\" class=\"add add-g\">查看</a> |\n" +
                        "                <a id='editA"+agentDTO.agent.agentId+"' href=\""+((agentDTO.agent.status == 1)?("/manager/brand/toEditAgent?agentId="+agentDTO.agent.agentId):"#")+"\" style='"+((agentDTO.agent.status != 1)?'color:gray;':'')+"' class=\"add add-g\">编辑</a> |\n" +
                        "                <a id='statusA"+agentDTO.agent.agentId+"' onclick="+click+" class=\"add add-g\">"+((agentDTO.agent.status == 1)?"冻结":"启用")+"</a> |\n" +
                        "                <a onclick=\"delAgent(\'"+agentDTO.agent.agentId+"\')\" class=\"add add-g\">删除</a>\n" +
                        "              </td>\n" +
                        "            </tr>";

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

function clearAgentSearch() {
    $("#input_agentName").val("");
    $("#input_agentLevel").find("option:first").attr("selected","selected")

}

function freezedAgent(agentId) {
    // 在绑定事件前先把之前的事件注销
    $("#modalConfirmBtn").off("click");
    $("#modalConfirmBtn").on("click",function () {
        $.ajax({
            url:"/manager/brand/freezedAgent",
            type:"POST",
            data:{"agentId":agentId},
            dataType:"JSON",
            success:function (result) {
                if (result.code === 1){
                    modalText = "冻结成功";
                    $("#myModal").modal();
                    $("#statusA"+agentId).html("启用");
                    $("#statusA"+agentId).attr("onclick","useAgent(\'"+agentId+"\')");
                    $("#status"+agentId).html("冻结");
                    $("#editA"+agentId).attr("style","color:gray;");
                    $("#editA"+agentId).attr("href","javascript:void(0)")
                }else if(result.code === 2){
                    modalText = "冻结失败，请先冻结或删除其下的门店";
                    $("#myModal").modal();
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

function useAgent(agentId) {
    $("#modalConfirmBtn").off("click");
    $("#modalConfirmBtn").on("click",function () {
        $.ajax({
            url:"/manager/brand/useAgent",
            type:"POST",
            data:{"agentId":agentId},
            dataType:"JSON",
            success:function (result) {
                if (result.code == 1){
                    modalText = "启用成功";
                    $("#myModal").modal();
                    $("#statusA"+agentId).html("冻结");
                    $("#statusA"+agentId).attr("onclick","freezedAgent(\'"+agentId+"\')");
                    $("#status"+agentId).html("正常");
                    $("#editA"+agentId).attr("style","");
                    $("#editA"+agentId).attr("href","/manager/brand/editAgent?agentId="+agentId)
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

function delAgent(agentId) {
    $("#modalConfirmBtn").off("click");
    $("#modalConfirmBtn").on("click",function () {
        $.ajax({
            url:"/manager/brand/delAgent",
            type:"POST",
            data:{"agentId":agentId},
            dataType:"JSON",
            success:function (result) {
                if (result.code === 1){
                    modalText = "删除成功";
                    $("#myModal").modal();
                    $('.table-goods').DataTable().row("#tr"+agentId).remove().draw( false );
                }else if (result.code === 0){
                    modalText = result.msg;
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

function delAgentLevel(agentLevelId) {

    $("#modalConfirmBtn").off("click");
    $("#modalConfirmBtn").on("click",function () {
        $.ajax({
            url:"/manager/brand/delAgentLevel",
            type:"POST",
            dataType:"JSON",
            data:{"agentLevelId":agentLevelId},
            success:function (result) {
                if(result.code === 0){
                    modalText = "删除失败";
                    $("#myModal").modal();
                }else if(result.code === 1){
                    $('.table-goods').DataTable().row('#tr'+agentLevelId).remove().draw( false );
                    modalText = "删除成功";
                    $("#myModal").modal();
                }else if(result.code === 2){
                    modalText = "请先删除子分类或移除其下的代理商";
                    $("#myModal").modal();
                }
            },
            error:function () {
                modalText = "删除失败";
                $("#myModal").modal();
            }
        });

    });

    modalText = "确认删除此级别？";
    $("#confirmModal").modal();

}

function clearAgentLevelSearch() {
    $("#input_agentName").val("")
}

function searchAgentLevel() {
    $.ajax({
        url:"/manager/brand/searchAgentLevel",
        type:"POST",
        data:{"agentLevelName":$("#input_agentName").val()},
        dataType:"JSON",
        success:function (result) {
            if (result.code == 1){
                $("#levelsTable").html("");
                var levels = result.data;
                $('.table-goods').dataTable().fnClearTable(); //清空一下table
                $('.table-goods').dataTable().fnDestroy(); //还原初始化了的datatable
                $.each(levels, function (index, level) {
                    var tr = "<tr id='"+level.agentLevelId+"'>\n" +
                        "              <td>"+(index+1)+"</td>\n" +
                        "              <td>"+level.agentLevelName+"</td>\n" +
                        "              <td>"+level.agentLevelId+"</td>\n" +
                        "              <td>"+level.rank+"</td>\n" +
                        "              <td>"+level.description+"</td>\n" +
                        "              <td>\n" +
                        "                <a "+((level.rank == '三级分类')?" ":("href=\"/manager/brand/toAddChildAgentLevel?agentLevelId="+level.agentLevelId+"\""))+ ((level.rank == '三级分类')?" style='color:gray;'":" ") + " class=\"add add-g\">添加子级别</a> |\n" +
                        "                <a href='/manager/brand/toEditAgentLevel?agentLevelId="+level.agentLevelId+ "' class=\"add add-g\">编辑</a> |\n" +
                        "                <a onclick='delAgentLevel("+level.agentLevelId+")' class=\"add add-g\">删除</a>\n" +
                        "              </td>\n" +
                        "            </tr>";
                    $('.table-goods').find("tbody").append(tr);
                });
                initTable($('.table-goods'));
            }else{
                alert("请求数据失败")
            }
        },
        error:function () {
            alert("请求数据失败")
        }
    })
}
// $(function () {
//     // 代理商级别管理 的业务需求
//     if(levels !== null && levels !== undefined){
//         for(var i = 0;i < levels.length;i++){
//             if(levels[i].parentId.length !== 0){
//                 var parentId = (Array(4).join('0') + levels[i].parentId).slice(-4);
//                 $($("#tr"+parentId).find("a")[0]).attr("href","#").css("color","gray");
//             }
//         }
//     }
//
// });