$(function () {
   $("select[name = 'district']").on("change",function () {
       getLocalAgent();
   });
});

// 根据门店的区域限制代理商信息
function getLocalAgent(){
    var province = $("select[name = 'province'] option:selected").text();
    var city = $("select[name = 'city'] option:selected").text();
    var district = $("select[name= 'district'] option:selected").text();

    console.log(province,city,district);
    $.ajax({
        url: "/manager/brand/getLocalAgent",
        type: "POST",
        data: {
            province: province,
            city: city,
            district: district
        },
        dataType:"JSON",
        success: function (result) {

            if(result.code === 1){
                var agents = result.data;
                console.log(agents);
                var agentSelect = $("select[name = 'agentId']");
                var option = "";
                // 清空 select 中的内容
                agentSelect.empty();
                agentSelect.append("<option value=''>请选择代理商</option>");
                $.each(agents,function (index,agent) {
                    option = "<option value='"+agent.agent.agentId+"'>"+agent.agent.agentName+"</option>";
                    agentSelect.append(option);
                });
            }else{
                modalText = "获取代理商信息失败";
                $('#myModal').modal();
            }
        },
        error:function () {
            modalText = "获取代理商信息失败";
            $('#myModal').modal();
        }
    })
}