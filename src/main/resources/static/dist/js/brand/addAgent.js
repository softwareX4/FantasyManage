/**
 * Created by qiu on 18/6/12.
 */
function preview(file, i){
    if (file.files && file.files[0]) {

        var idx = file.files[0].name.lastIndexOf(".");
        if (idx !== -1){
            var ext = file.files[0].name.substr(idx+1).toLowerCase();
            if (ext !== 'jpg' && ext !=='png' && ext !== 'jpeg' && ext !== 'gif'){
                modalText = "只能上传.jpg  .png  .jpeg  .gif类型的文件!";
                $('#myModal').modal();
                return;
            }
        } else {
            modalText = "只能上传.jpg  .png  .jpeg  .gif类型的文件!";
            $('#myModal').modal();
            return;
        }
        var filePath = file.value;
        if(filePath){
            //读取图片数据
            var filePic = file.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                //加载图片获取图片真实宽度和高度
                var image = new Image();
                image.onload=function(){
                    var width = image.width;
                    var height = image.height;
                    console.log(width + " " + height);
                    if (width <= 800 && height <= 1000){
                        $("#img" + i).attr("src", e.target.result);
                        $("#icon" + i).css("display", "none");
                    }else {
                        modalText = "请上传360*150像素的图片";
                        $('#myModal').modal();
                        file.value = "";
                        return false;
                    }
                };
                image.src= data;
            };
            reader.readAsDataURL(filePic);
        }else{
            return false;
        }
    }
}

function addNextAgentLevel() {
    var levelName = $("#levelName").val();

    if(levelName.length !== 0){
        $("#addCategoryLevelForm").attr("action","/manager/brand/addNextAgentLevel");
        $("#addCategoryLevelForm").submit()
    }else{
        modalText = "请输入级别名称";
        $("#myModal").modal();

    }
}

function registration(that,value) {

    if(value.trim().length === 0){
        $("#registerMsg").text("");
    }

    if(inputCondition(that,value,/^1[34578]\d{9}$/,'手机号码格式有误，请更改',100)){
        $.ajax({
            url: "/manager/brand/phone",
            type: "post",
            data: { "contectPhone": value },
            success: function (result) {
                if(result.code === 1){
                    $("#registerMsg").css("color","green").text(value+"可以使用");
                }else if(result.code === 2){
                    $("#registerMsg").css("color","red").text(value+"已经被注册");
                }
            },
            error: function () {
                $("#registerMsg").css("color","gray").text("获取电话号码失败");
            }
        })
    }else{
        $("#registerMsg").text("");
    }
}
