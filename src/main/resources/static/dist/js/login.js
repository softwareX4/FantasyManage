function sendCode() {
    var phoneNumber = $("#phoneNumber").val()
    var reg = /^1[3|4|5|7|8|9][0-9]{9}$/
    if(phoneNumber == undefined || !reg.test(phoneNumber)){
        alert("手机号码格式错误")
        return
    }
    $.ajax({
        url:"/manager/sendCode",
        type:"POST",
        dataType:"JSON",
        data:{"phoneNumber":phoneNumber},
        success:function (result) {
            if(result.code == 1){
                alert("验证码发送成功")
            }else{
                alert("发送验证码失败")
            }
        },
        error:function () {
            alert("发送验证码失败")
        }
    })
}

$().ready(function() {


});