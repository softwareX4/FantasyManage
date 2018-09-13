function agentRank() {
    var rank = $("select[name = 'agentLevelId'] option:selected").attr("name");
    var province = $("select[name = 'province']");
    var city = $("select[name = 'city']");
    var district = $("select[name = 'district']");

    if(rank === "总分类"){
        $("#agentLevelMsg").css("display","block");
        province.css("display","none");
        city.css("display","none");
        district.css("display","none");
    }else if(rank === "一级分类"){
        $("#agentLevelMsg").css("display","none");
        province.css("display","block");
        city.css("display","none");
        district.css("display","none");
    }else if(rank === "二级分类"){
        $("#agentLevelMsg").css("display","none");
        province.css("display","block");
        city.css("display","block");
        district.css("display","none");
    }else if(rank === "三级分类"){
        $("#agentLevelMsg").css("display","none");
        province.css("display","block");
        city.css("display","block");
        district.css("display","block");
    }
}
$(function () {
    agentRank();
});