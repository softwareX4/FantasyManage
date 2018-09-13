/**
 * Created by qiu on 18/6/11.
 */
$(function () {

    // 判断是否将第一个加号屏蔽掉
    if ($("#add1").length !== 0) {
        $("#add0").css("display", "none")
    }

    initDate();

    for (var i = 1;i <= 10;i++){
        // 节假日的时间约束
        $("#timepicker"+i).change(function () {
            if($("#datepicker" + i).val() === $("#datepicker" + i + "End").val()){
                if ($(this).val() > $("#timepicker" + i + "End").val()) {
                    alert("开始时间不能晚于结束时间");
                    $("#timepicker" + i + "End").val($(this).val());
                }
            }
        });
        $("#timepicker"+i+"End").change(function () {
            if($("#datepicker" + i).val() === $("#datepicker" + i + "End").val()){
                if ($(this).val() < $("#timepicker" + i).val()) {
                    alert("开始时间不能晚于结束时间");
                    $("#timepicker" + i).val($(this).val());
                }
            }
        });
    }
});

function initDate() {
    $("input[name = 'startTime']").timepicker({
        showInputs: false

    });
    $("input[name = 'endTime']").timepicker({
        showInputs: false

    });
    $(".timepicker").timepicker({
        showInputs: false
    });
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true
    });
    $('.timepicker').attr("readonly", "readonly");
    $('.datepicker').attr("readonly", "readonly");


}

// 添加新节假日
function addNewItem(i) {

    // 得到当前日期 yyyy-mm-dd
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
    var today = date.getFullYear() + seperator1 + month + seperator1 + strDate;

    var length = $('#info').children('.form-group').length;
    $("#add" + (i - 1)).css("display", "none");// 隐藏上一个加号
    var diff = "";
    if (length < 9) {
        diff = "<div class=\"col-sm-1 addP\"><i class=\"fa fa-fw  fa-plus-circle operation-icon\" id=\"add" + i + "\"" + " onclick=\"addNewItem(" + (i + 1) + ")\"></i></div>";
    }
    else {
        diff = "<div class=\"col-sm-1 addP\"><i class=\"fa fa-fw  fa-plus-circle operation-icon\" style=\"display: none;\" id=\"add" + i + "\"" + " onclick=\"addNewItem(" + (i + 1) + ")\"></i></div>";
    }
    var html = "<div class=\"form-group\" id=\"form" + i + "\">" +
        "<label class=\"col-sm-1\"></label>" + diff +
        "<div class=\"col-sm-2\">" +
        "<div class=\"input-group date\">" +
        "<div class=\"input-group-addon\" style=\"padding: 8px;\">" +
        "<i class=\"fa fa-calendar\"></i>" +
        "</div>" +
        "<input type=\"text\" class=\"form-control pull-right datepicker\" id=\"datepicker" + i + "\" onblur=\"setDate(this)\"\n" +
        " value='" + today + "'  onchange=\"beginConditionByI(this," + i + ")\" name=\"startDate:" + (i - 1) + "\">" +
        "</div>" +
        "</div>" +
        "<div class=\"col-sm-2\">" +
        "<div class=\"bootstrap-timepicker\">" +
        "<div class=\"input-group\">" +
        "<input type=\"text\" class=\"form-control timepicker\" id=\"timepicker" + i + "\" name=\"startTime:" + (i - 1) + "\">" +
        "<div class=\"input-group-addon\">" +
        "<i class=\"fa fa-clock-o\"></i>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class=\"col-sm-1\" style=\"text-align: center;margin-top: 5px;\">~</div>" +
        "<div class=\"col-sm-2\">" +
        "<div class=\"input-group date\">" +
        "<div class=\"input-group-addon\" style=\"padding: 8px;\">" +
        "<i class=\"fa fa-calendar\"></i>" +
        "</div>" +
        "<input type=\"text\" class=\"form-control pull-right datepicker\" id=\"datepicker" + i + "End\" onblur=\"setDate(this)\"\n" +
        "  value='" + today + "'   onchange=\"endConditionByI(this," + i + ")\" name=\"endDate:" + (i - 1) + "\">" +
        "</div>" +
        "</div>" +
        "<div class=\"col-sm-2\">" +
        "<div class=\"bootstrap-timepicker\">" +
        "<div class=\"input-group\">" +
        "<input type=\"text\" class=\"form-control timepicker\" id=\"timepicker" + i + "End\" name=\"endTime:" + (i - 1) + "\">" +
        "<div class=\"input-group-addon\">" +
        "<i class=\"fa fa-clock-o\"></i>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class=\"col-sm-1 addP\"><i class=\"fa fa-fw fa-times-circle operation-del-icon\" id=\"del" + i + "\"" + " onclick=\"delItem(" + (i) + ")\"></i></div>" + "<label class=\"col-sm-1\"></label>" +
        "</div>";
    $("#info").append(html);
    initDate();


    // 节假日的时间约束
    $("#timepicker"+i).on("change",function () {
        var endDate = $("#datepicker" + i + "End").val();
        var endTime = $("#timepicker" + i + "End").val();
        if($("#datepicker" + i).val() === endDate){
            if($(this).val().indexOf("AM")!==-1 && endTime.indexOf("AM") !== -1){
                if ($(this).val() > endTime) {
                    alert("开始时间不能晚于结束时间");
                    $("#timepicker" + i + "End").val($(this).val());
                }
            }else if($(this).val().indexOf("PM")!==-1 && endTime.indexOf("PM") !== -1){
                if ($(this).val() > endTime) {
                    alert("开始时间不能晚于结束时间");
                    $("#timepicker" + i + "End").val($(this).val());
                }
            }else if($(this).val().indexOf("PM")!==-1 && endTime.indexOf("AM") !== -1){
                alert("开始时间不能晚于结束时间");
                $("#timepicker" + i + "End").val($(this).val());
            }
        }
    });
    $("#timepicker"+i+"End").on("change",function () {
        var beginDate = $("#datepicker" + i).val();
        var beginTime = $("#timepicker" + i).val();
        if(beginDate === $("#datepicker" + i + "End").val()){
            if($(this).val().indexOf("AM")!==-1 && beginTime.indexOf("AM") !== -1){
                if ($(this).val() < beginTime) {
                    alert("开始时间不能晚于结束时间");
                    $("#timepicker" + i).val($(this).val());
                }
            }else if($(this).val().indexOf("PM")!==-1 && beginTime.indexOf("PM") !== -1){
                if ($(this).val() < beginTime) {
                    alert("开始时间不能晚于结束时间");
                    $("#timepicker" + i).val($(this).val());
                }
            }else if($(this).val().indexOf("AM")!==-1 && beginTime.indexOf("PM") !== -1){
                alert("开始时间不能晚于结束时间");
                $("#timepicker" + i).val($(this).val());
            }
        }
    })

}

// 删除节假日
function delItem(i) {
    var length = $('#info').children('.form-group').length;
    if (length > 1) {
        $("#form" + i).remove();
        var child = $("#info").children(".form-group:last-child");
        child.find(".operation-icon").css("display", "block");
    }
    else {
        $("#form" + i).remove();
        $("#add0").css("display", "block");
    }

    // 将第一个加号显示出来
    if ($("#add1") === null) {
        $("#add0").css("display", "block")
    }

}
// 节假日的日期约束
function beginConditionByI(that, i) {
    if ($(that).val() > $("#datepicker" + i + "End").val()) {
        alert("开始时间不能晚于结束时间");
        $("#datepicker" + i + "End").val($(that).val());
    }
}

function endConditionByI(that, i) {
    if ($(that).val() < $("#datepicker" + i).val()) {
        alert("开始时间不能晚于结束时间");
        $("#datepicker" + i).val($(that).val());
    }
}
