$(function(){
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();

});

//这个就是函数的第二种调用方式
var TableInit = function () {

    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_departments').bootstrapTable({
            url: '001.json',                   //请求后台的URL（*）
            dataType: "json",
            method: 'get',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 5,                       //每页的记录行数（*）
            pageList: [5, 10,20],        //可供选择的每页的行数（*）
            search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            contentType: "application/json,charset=utf-8",
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            // height: 700,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "no",                     //每一行的唯一标识，一般为主键列
            showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [
            {  checkbox: true},
            {
                field: 'ID',
                title: 'ID'
            }, {
                field: 'Name',
                title: '名字'
            }, {
                field: 'Sex',
                title: '性别'
            }, {
                field: 'age',
                title: '年龄'
            }
           
            ],

            rowStyle: function (row, index) {
                var classesArr = ['success', 'info'];
                var strclass = "";
                if (index % 2 === 0) {//偶数行
                    strclass = classesArr[0];
                } else {//奇数行
                    strclass = classesArr[1];
                }
                return { classes: strclass };
            },//隔行变色
        });

    };


    //得到查询的参数
   oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset,  //页码
         	order: params.order,  //排序
        };
        return temp;
    };
    return oTableInit;
};


var ButtonInit = function () {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function () {
        //初始化页面上面的按钮事件
    };
    return oInit;
};


function add(){
	layer.open({
	  type: 2,
	  skin: 'layui-layer-molv',
	  title: ['果子添加', 'font-size:18px;'],
	  area: ['700px', '400px'],
	  fix: false, //不固定
      maxmin: true,
      // '传入任意的文本或html' //这里content是一个普通的String
	  content: 'addTable.html'
	});

}



function check(){
	var selected=$("#tb_departments").bootstrapTable("getSelections");
	if(selected.length==0){

		layer.alert("请至少选择中一行！");

		return false;
	}else{

		return true;
	}


}

function edit(){
	if(check()){
		var index=layer.open({
					  type: 2,
					  skin: 'layui-layer-molv',
					  title: ['果子添加', 'font-size:18px;'],
					  area: ['700px', '400px'],
					  fix: false, //不固定
				      maxmin: true,
				      // 1 '传入任意的文本或html' //这里content是一个普通的String
					  content: 'editTable.html'
					});

	};	
}

function del(){

	if(check()){
		var selected=$("#tb_departments").bootstrapTable("getSelections");
		console.log(selected[0].Name)
		layer.confirm('确定要删除'+selected[0].Name+" 吗？",{
			btn: ['确定', '取消'],function(){
				layer.close(layer.index);
			}
		})

	}
}