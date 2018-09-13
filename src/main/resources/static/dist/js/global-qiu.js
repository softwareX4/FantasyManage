/**
 * Created by qiu on 18/6/12.
 */
$(function () {

    // initTable($('.table-goods'));

    $('.datepicker').datepicker({
        startDate: new Date(),
        format: 'yyyy-mm-dd',
        autoclose: true,
        language: "cn"
    });
    $('.datepicker').attr("readonly","readonly");

    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if(month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if(strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var end = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    if($(".datepicker").val() == "") {
        $(".datepicker").val(end);
    }
});


Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
// 初始化表格
function initTable(object) {
    var myTable =  object.DataTable({
        'paging'      : true,
        'lengthChange': false,
        'searching'   : true,
        'ordering'    : false,
        'info'        : true,
        'autoWidth'   : false,
        "language"    : {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        }
    });
    // 再隐藏原生搜索组件
    $(".dataTables_filter").css("display","none");

    //为datatable增加序号列
    myTable.on('order.dt search.dt',function(){
        myTable.column(0,{
            search: 'applied',
            order: 'applied'
        }).nodes().each(function(cell,i){
            i = i + 1;
            var page = myTable.page.info();
            var pageno = page.page;
            var length = page.length;
            var columnIndex = (i+pageno*length);
            cell.innerHTML = columnIndex;
        });
    }).draw();

    return myTable;

}