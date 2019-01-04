var app = angular.module('Task', ['ui.bootstrap']);
app.controller('Task', function($scope, $sce, $http, $location, $compile, $timeout, $window) {
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 10;
    $scope.changeTimes = 0;
    $scope.list;
    $scope.userName;
    $scope.paramCount = 1;
    $scope.scriptAuthority = "";
    $scope.data;
    $scope.items; 
    $scope.choose=[];
    $scope.count=[]; 
    $scope.prependedText = "__"


    $scope.init = function() {
        $http({
            method: "GET",
            url: "/treeviewindex",
        }).then(response => {
            //console.log(response.data);
            var el = $compile(response.data)($scope);
            $("body").prepend(el);

            //如果点击头像事件失效则添加此代码
            var isout = false
            $(".light-blue").click(function() {
                isout = !isout;
                if (isout) {
                    $(this).addClass("open");
                } else {
                    $(this).removeClass("open")
                }
            })
           $http({
			method : "GET",
			url : "/testuser/getuser",
			}).then(response=>{
				$scope.userName = response.data.userName;
				console.log($scope.userName);
			});
			
            var absurl = $location.absUrl(); 
            console.log(absurl);
            var spilt=absurl.split("\?");
            var spilt1=spilt[1].split("&");
            var projectGroupId=spilt1[0].split("=")[1];
            var testTaskId=spilt1[1].split("=")[1];
            
            $scope.projectGroupId=projectGroupId;
            $scope.testTaskId=testTaskId;
            
            $http({
                method: "GET",
                url: "/task/edithtml"
            }).then(response => {
                var el = $compile(response.data)($scope);

                $(".page-content").append(el);
                
                
               $http({
                    method: "GET",
                    url: "/testTask/allTestPlans?testTaskId=" +testTaskId,
                }).then(response => {
                    console.log(response.data);
                    $scope.testTaskdata = response.data;
                    $("#taskName").val(response.data[0].testTaskName);
                    $("#desctiption").val(response.data[0].testTaskDescription);
                });
                
                $http({
                    method: "GET",
                    url: "/task/allTestPlans?groupId=" +projectGroupId,
                }).then(response => {
                	console.log(response.data);
                	$scope.data = response.data;
                	
                	$scope.pageSize = 50;
                	 //总页数
			        $scope.totalPages = Math.ceil($scope.data.length / $scope.pageSize);
			        $("#totalPage").html("共  "+$scope.totalPages+"页");
			        $("#totalSum").html("总记录  "+$scope.data.length+"条");
			        // 设置在分页中显示的条数
			        $scope.pageList = [];
			        //设置默认开始页
			        $scope.currentPage = 1;
                    $scope.newPages = $scope.totalPages > 5 ? 5 : $scope.totalPages; 
                    //初始时，显示工具条数据
                    for (var i = 0; i < $scope.newPages; i++) {
                		 $scope.pageList.push(i + 1);
           			}
		           //默认开始的分页数据
                   $scope.items = $scope.data.slice(0, $scope.pageSize);
                   $scope.setData();
                   $scope.selectPage($scope.currentPage);
                });
            });
        });
    }
    
  //在客户端 通过当前页数筛选出表格当前页面显示数据
    $scope.setData = function () {
      //slice js方法，返回前后数据，不包含后面
      $scope.items = $scope.data.slice(($scope.pageSize * ($scope.currentPage - 1)), ($scope.currentPage * $scope.pageSize));
      $scope.cd();
    }

  //设置当前选中页样式
    $scope.isActivePage = function (page) {
    	
        return $scope.currentPage == page;
    };
    //上一页
    $scope.Previous = function () {
        $scope.selectPage($scope.currentPage - 1);
    }
    //下一页
    $scope.Next = function () {
        $scope.selectPage($scope.currentPage + 1);
    };
    
     // 加载指定页数据 
	$scope.selectPage = function (page) {
		if (page < 1 || page > $scope.pages) return;
		$scope.currentPage = page ;
		var begin;
		var end;
		begin = $scope.currentPage-2;
		if(begin < 1){
			begin=1;
		}
		end=begin+4;
		if(end >$scope.totalPages){
			end=$scope.totalPages;
		}
		begin=end-4;
		if(begin < 1){
			begin=1;
		}
		var newpageList = [];
		for(var i=begin;i<=end;i++){
			newpageList.push(i);
		}
		$scope.pageList = newpageList;
		$scope.currentPage = page;
		$scope.setData();
		$scope.isActivePage(page);
		console.log("选择的页：" + page);
		
    };
    //点击后回显数据    
	$scope.cd=function(){
		//所有的testPlan数据
	 	var dataList=$scope.data ;
	 	//testTaskPlan里面的数据
        var testTaskdatalist=$scope.testTaskdata;
    	for(var k=0;k<$scope.testTaskdata.length;k++){
    		for(var j=0;j<$scope.data.length;j++){
    			if(dataList[j].id==testTaskdatalist[k].testPlanID){
    				$($('#dataList tbody tr')[j]).children('#xuanze').children('input').prop('checked',true);
    				if($($('#dataList tbody tr')[j]).children('#xuanze').length>0){
    					$scope.choose.push(dataList[j].id+"_"+dataList[j].planName);
    				}
    			}
    		}
    	}
	}
	
	//选中当前
	$scope.chooseCurrent=function(entity){
	      	var index=$scope.choose.indexOf(entity.id+"_"+entity.planName);
	      	if(entity.check|| index==-1){
	      		 $scope.choose.push(entity.id+"_"+entity.planName);
	      	}else{
	      		$scope.choose.splice(index,1);
	      	}
	        if ($scope.items.length === $scope.choose.length) {
	            $scope.allcheck = true;
	        } else {
	            $scope.allcheck = false;
	        }
	      console.log($scope.choose); 
	}
	
	//选中当页所有
	$scope.checkall = function() {
		if($scope.allcheck){
			$scope.choose=[];
			for(var i=0;i<$scope.items.length;i++){
				$scope.items[i].check=true;
				$scope.choose.push($scope.items[i].id+"_"+$scope.items[i].planName);
			}
		}else{
			for(var i=0;i<$scope.items.length;i++){
				$scope.items[i].check=false;
				$scope.choose=[];
			}
		}
		console.log($scope.choose); 
	};
	

    $scope.successCallback = function(res) {
        alert("success");
    }

    $scope.errorCallback = function(res) {
        alert("error");
    }
	//数据保存
    $scope.saveTask = function() {
		if($scope.choose.length==0){
            alert("请在表格中至少选择一个");
            return;
        }
        if( $("#taskName").val()==null || $("#desctiption").val()==null){
            alert("请在输入框中输入数据");
            return;         
        }
      	var params={"taskName": $("#taskName").val(),"taskDescription": $("#desctiption").val(),"plans": $scope.choose,"projectGroupId":$scope.projectGroupId,"testTaskId":$scope.testTaskId,"userName":$scope.userName};
        $http({
        	   method: "POST",
               url: "/task/updateTestPlan",
               data: params,
        }).then(response =>{
        	alert("保存成功！！！");
        	$("#taskName").val("");
        	$("#desctiption").val("");
        	for(var i=0;i<$scope.items.length;i++){
				$scope.items[i].check=false;
			}
        })
    }
    
   $scope.queryName=function(){
    	var data=$("#searchTestPlan").val()+","+$scope.projectGroupId;
    	$http({
        	  method: "GET",
              url: "/task/searchTestPlansByName?planName=" +data,
        }).then(response =>{
        	console.log(response.data);
        	$scope.data = response.data;
        })
    	
    }
   
	$scope.mappingsRenderFinish = function() {
		$scope.cd();
	};



}).directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
            	$timeout(function() {
                	scope.$eval( attr.onFinishRender );
            	});
            }
        }
    }
});