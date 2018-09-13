$(function () {
    $('img.file-img').click(function(){
        var that =$(this);
        showImg("#outerdiv","#innerdiv","#bigimg",that);
    });
});
// 显示图片大图
function showImg(outerdiv,innerdiv,bigimg,that){
    var winW = $(window).width();
    var winH = $(window).height();
    var src = $(that).attr('src');
    $(bigimg).attr("src",src);
    $("<img/>").attr("src",src).on("load",function(){
        var imgW = this.width;
        var imgH = this.height;
        var scale= imgW/imgH;
        var w = 0;
        var h = 0;

        if( imgW > winW ){
            $(bigimg).css("width","50%").css("height","auto");
            imgH = winW/scale;
            // h=(winH-imgH)/2;
            $(innerdiv).css({"left":winW/3,"top":winH/12});
        }else{
            $(bigimg).css("width",imgW+'px').css("height",imgH+'px');
            w=(winW-imgW)/2;
            h=(winH-imgH)/2;
            $(innerdiv).css({"left":w,"top":h});
        }

        $(outerdiv).fadeIn("fast");
        $(outerdiv).click(function(){
            $(this).fadeOut("fast");
        });
    });
}

