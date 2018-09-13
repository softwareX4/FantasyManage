function preview(file, i){
    if (file.files && file.files[0]) {
        // 后缀名
        var idx = file.files[0].name.lastIndexOf(".");
        // 图片大小
        var size = file.files[0].size / (1024*1024);
        alert(size);
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

        if(size > 5){
            modalText = "请上传大小不大于5M的图片!";
            $('#myModal').modal();
            return;
        }else{
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
                        // var width = image.width;
                        // var height = image.height;
                        // console.log(width + " " + height);
                        // if (width <= 800 && height <= 1000){
                        //     $("#img" + i).attr("src", e.target.result);
                        //     $("#icon" + i).css("display", "none");
                        // }else {
                        //     modalText = "请上传360*150像素的图片";
                        //     $('#myModal').modal();
                        //     file.value = "";
                        //     return false;
                        // }
                        $("#img" + i).attr("src", e.target.result);
                        $("#icon" + i).css("display", "none");
                    };
                    image.src= data;
                };
                reader.readAsDataURL(filePic);
            }else{
                return false;
            }
        }

    }
}