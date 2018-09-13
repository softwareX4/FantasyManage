function addNextSrategy() {
    var name = $("input#name").val().length;
    var datepicker = $("#datepicker").val().length;
    var timepicker = $("#timepicker").val().length;
    var datepickerEnd = $("#datepickerEnd").val().length;
    var timepickerEnd = $("#timepickerEnd").val().length;
    if(name*datepicker*timepicker*datepickerEnd*timepickerEnd === 0){
        alert("请填写完整信息")
    }else{
        alert("保存成功");
        $("#addStrategyForm").attr("action","/manager/brand/addNext");
        $("#addStrategyForm").submit();
    }

}