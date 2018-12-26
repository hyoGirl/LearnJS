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
    $scope.count=[]; 
    //  $scope.prependedText = "__S_"
    $scope.prependedText = "__"

    $scope.addParam = function() {
        $scope.paramCount = $scope.paramCount + 1;
        var template = '<div class="controls" id="paramDiv' + $scope.paramCount + '"><select id="strParamType" class="span2 typeahead" name="type"><option value="String">String</option><option value="Integer">Integer</option></select> <input type="text" class="span4 typeahead"placeholder="Parameter comment" name="comment" /> <input type="text" class="span2 typeahead" placeholder="Parameter value" name="value" />  <a title="remove"class="red" ng-click="deleteParam(' + $scope.paramCount + ')"> <i class="icon-trash bigger-130"></i></a></div>';
        var content = $compile(template)($scope);
        $('#param').append(content);
    }
    $scope.addParamVar = function() {
        $scope.paramCount = $scope.paramCount + 1;
        var template = '<div class="controls" id="paramVarDiv' + $scope.paramCount + '"><input type="text" class="span4 typeahead"placeholder="Key" name="key" /> <input type="text" class="span2 typeahead" placeholder="Value" name="varvalue" />  <a title="remove"class="red" ng-click="deleteParamVar(' + $scope.paramCount + ')"> <i class="icon-trash bigger-130"></i></a></div>';
        var content = $compile(template)($scope);
        $('#paramVar').append(content);
    }

    $scope.deleteParam = function(id) {
        $('#paramDiv' + id).remove();
    }

    $scope.deleteParamVar = function(id) {
        $('#paramVarDiv' + id).remove();
    }

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
            
            var absurl = $location.absUrl(); 
			var n=absurl.split("=");
			var projectGroupId = n[1];
			console.log(projectGroupId);
            
            
            $http({
                method: "GET",
                url: "/task/addhtml"
            }).then(response => {
                var el = $compile(response.data)($scope);

                $(".page-content").append(el);
                $http({
                    method: "GET",
                    url: "/task/allTestPlans?groupId=" +projectGroupId,
                }).then(response => {
                	console.log(response.data);
                	$scope.data = response.data;
                	$scope.pageSize = 5;
                	 //总页数
			        $scope.totalPages = Math.ceil($scope.data.length / $scope.pageSize);
			        
			        $("#totalPage").html("总页数: "+$scope.totalPages);
			  
			        // 设置在分页中显示的条数
			        $scope.pageList = [];
			        //设置默认开始页
			        $scope.currentPage = 1;
			        
                    $scope.newPages = $scope.totalPages > 5 ? 5 : $scope.totalPages; 
                    
                    //初始时，显示工具条数据
                    for (var i = 0; i < $scope.newPages; i++) {
                		 $scope.pageList.push(i + 1);
           			}
           			
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
                		
                		 // if(page== $scope.totalPages){
                        //     $("#nextPage").css('display','none');
                        // }else{
                        //     $("#nextPage").css('display','inline');
                        // }
                		
                		console.log("选择的页：" + page);
         				
		            };
		            
		            //在客户端 通过当前页数筛选出表格当前页面显示数据
		            $scope.setData = function () {
		              //slice js方法，返回前后数据，不包含后面
		              $scope.items = $scope.data.slice(($scope.pageSize * ($scope.currentPage - 1)), ($scope.currentPage * $scope.pageSize));
		            }
		           //默认开始的分页数据
                   $scope.items = $scope.data.slice(0, $scope.pageSize);
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
                    
                });
            });

        });
    }
	
	$scope.checked = []
	

	$scope.chooseCurrent=function(entity){
	      	var index=$scope.checked.indexOf(entity.id);
	      	if(entity.check|| index==-1){
	      		 $scope.checked.push(entity.id);
	      	}else{
	      		$scope.checked.splice(index,1);
	      	}
	        if ($scope.items.length === $scope.checked.length) {
	            $scope.allcheck = true;
	        } else {
	            $scope.allcheck = false;
	        }
	      console.log($scope.checked); 
	}
	
	$scope.checkall = function() {
		if($scope.allcheck){
			$scope.checked = [];
			for(var i=0;i<$scope.items.length;i++){
				$scope.items[i].check=true;
				$scope.checked.push($scope.items[i].id);
			}
		}else{
			for(var i=0;i<$scope.items.length;i++){
				$scope.items[i].check=false;
				$scope.checked = []
			}
		}
		console.log($scope.checked); 
	};
	

    $scope.successCallback = function(res) {
        alert("success");
    }

    $scope.errorCallback = function(res) {
        alert("error");
    }

    $scope.saveTask = function() {
    
		if($scope.checked.length==0){
            alert("请在表格中至少选择一个");
            return;
        }
        if($scope.taskName==null || $scope.taskDescription==null){
            alert("请在输入框中输入数据");
            return;         
        }
        
      	var params={"taskName": $scope.taskName,"taskDescription": $scope.taskDescription,"ids":$scope.checked};
        $http({
        	   method: "POST",
               url: "/task/saveTestPlan",
               data: params,
        }).then(response =>{
        	
        })
        
        
        	
    }

    $scope.cancelButton = function() {
        var absurl = $location.absUrl();
        if ($location.absUrl().indexOf("action=add") > -1) {
            window.close();
        } else {
            window.location.href = ('/script/show');
        }
    }

});