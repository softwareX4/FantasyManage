/**
 * Created by qiu on 18/6/15.
 */
function isPhone(phone) {
    var str = phone.trim();
    if (str.length != 0) {
        var reg = /^1[34578]\d{9}$/;
        if (!reg.test(str)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function isInteger(number) {
    var str = number.trim();
    if (str.length != 0) {
        reg = /^\d+$/;
        if (!reg.test(str)) {
            return false;
        }
        return true;
    }
}

function isEmail(email) {
    var str = email.trim();
    if (str.length != 0) {
        reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!reg.test(str)) {
            return false;
        }
        return true;
    }
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

function compareTime(begin, end) {

    var startTime = new Date(begin.replace("-", "/").replace("-", "/"));
    var endTime = new Date(end.replace("-", "/").replace("-", "/"));
    if (endTime < startTime) {
        return false;
    }
    return true;

}
function getValue() {
    console.log($("#phoneNumber").val())
}

// 若日期控件值为空则填充当前日期
function setDate(that) {
    // 若为空则填充当前日期
    if ($(that).val().trim().length === 0) {
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
        var date = date.getFullYear() + seperator1 + month + seperator1 + strDate;

        $(that).val(date);
    }
}

function setDayTime(that) {

    if ($(that).val().trim().length === 0) {
        var date = new Date();
        var time = date.getDay();

        $(that).val(time);
    }
}

// 开始日期不能晚于结束日期
function beginCondition(that) {

    if ($(that).val() > $("#datepickerEnd").val()) {
        modalText = "开始时间不能晚于结束时间";
        $('#myModal').modal();
        $("#datepickerEnd").val($(that).val());
    }
}

function endCondition(that) {

    if ($(that).val() < $("#datepicker").val()) {
        modalText = "开始时间不能晚于结束时间";
        $('#myModal').modal();
        $("#datepicker").val($(that).val());
    }
}

// 开始时间不能晚于结束时间
function btCondition(that) {

    if ($(that).val() > $("#timepickerEnd").val()) {
        modalText = "开始时间不能晚于结束时间";
        $('#myModal').modal();
        $("#timepickerEnd").val($(that).val());
    }
}

function etCondition(that) {

    if ($(that).val() < $("#timepicker").val()) {
        modalText = "开始时间不能晚于结束时间";
        $('#myModal').modal();
        $("#timepicker").val($(that).val());
    }
}

// input 输入框的验证
var modalText = "";
var inputFocus = null;

function inputCondition(that, value, reg, messsage, length) {
    var flag = true;
    // 手机号码
    if(reg.toString() === "/^1[34578]\\d{9}$/" && value.length !== 0){
        if(!reg.test(value)){
            modalText = messsage;
            $('#myModal').modal();
            inputFocus = $(that)[0];
            flag = false;
        }
    }else {
        if (value.length !== 0 && reg.test(value)) {
            modalText = messsage;
            $('#myModal').modal();
            inputFocus = $(that)[0];
            flag = false;
        }
    }
    if(value.trim().length > length){
        modalText = "允许输入的最大长度为"+length+"个字，请更改";
        $('#myModal').modal();
        inputFocus = $(that)[0];
        flag = false;
    }else if(value.trim().length === 0){
        flag = false;
    }
    return flag;
}

// 模态框的 文本绑定
$('#myModal').on('show.bs.modal', function () {
    var modal = $(this);
    modal.find('.modal-text').text(modalText);
    modal.find('#modal-text').text(modalText);
});
// 模态框的 消失之后进行 焦点设置
$('#myModal').on('hidden.bs.modal', function () {

    if (inputFocus != null && inputFocus!==undefined ) {
        inputFocus.focus();
    }
    inputFocus = null;
});
// 确认模态框的文本
$('#confirmModal').on('show.bs.modal', function () {

    var modal = $(this);
    modal.find('.modal-text').text(modalText);
    modal.find('#modal-text').text(modalText);

});
$(document).ready(function () {
    // 弹框提示
    if(msg !== null && msg !== undefined && msg !== "null" && msg.toString().length !== 0){
        console.log(msg);
        modalText = msg;
        $('#myModal').modal();
    }
    if(error !== null && error !== undefined && error !== "null" && error.toString().length !== 0){
        modalText = error;
        $('#myModal').modal();
    }

    // 运营时间的限制
    // $("#timepicker").on("change", function () {
    //     if ($(this).val() > $("#timepickerEnd").val()) {
    //         modalText = "开始时间不能晚于结束时间";
    //         $('#myModal').modal();
    //         $("#timepickerEnd").val($(this).val());
    //     }
    // });
    // $("#timepickerEnd").on("change", function () {
    //     if ($(this).val() < $("#timepicker").val()) {
    //         modalText = "开始时间不能晚于结束时间";
    //         $('#myModal').modal();
    //         $("#timepicker").val($(this).val());
    //     }
    // });

    // 将form 表单的按enter自动提交禁用
    document.onkeydown = function(event) {
        var target, code, tag;
        if (!event) {
            event = window.event; //针对ie浏览器
            target = event.srcElement;
            code = event.keyCode;
            if (code === 13) {
                tag = target.tagName;
                if (tag === "TEXTAREA") {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            target = event.target; //针对遵循w3c标准的浏览器，如Firefox
            code = event.keyCode;
            if (code === 13) {
                tag = target.tagName;
                if (tag === "INPUT") {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    };
});
