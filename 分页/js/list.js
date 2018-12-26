var app = angular.module('Task', []);
app.controller('Task', function($scope, $sce, $compile, $http, $timeout) {
    $scope.list;
    $scope.userName;
    $scope.projectGroups;
    $scope.init = function() {

        $http({
            method: "GET",
            url: "/treeviewindex",
        }).then(response => {
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
                method: "GET",
                url: "/task/showhtml",
            }).then(response => {
                var el = $compile(response.data)($scope);
                $(".page-content").append(el);
                $http({
                    method: "GET",
                    url: "/testuser/getuser",
                }).then(response => {
                    $scope.userName = response.data.userName;
                });

                $http({
                    method: "GET",
                    url: "/groups/allProjectGroup",
                }).then(response => {
                    $scope.projectGroups = response.data;
                    //console.log($scope.projectGroups);
                });

            });
        });


    };

    $scope.query = function() {
        var scriptSearchCatagory = $("#scriptSearchCatagory").val();
        $http({
            method: "GET",
            url: "/script/scriptSearchCatagory?scriptSearchCatagory=" + scriptSearchCatagory
        }).then(response => {
            console.log(response.data);
            $scope.list = response.data;
            for (j = 0; j < $scope.list.length; j++) {
                //alert($scope.list[j].params);
                jsonParams = JSON.parse($scope.list[j].params);
                strParams = "";
                for (i = 0; i < jsonParams.length; i++) {
                    comma = "";
                    if (i > 0) {
                        comma = ",";
                    }
                    strParams = strParams + comma + jsonParams[i][0];
                }
                if ($scope.list[j].scriptType == "SIMPLE") {
                    $scope.list[j].scriptName = "__" + $scope.list[j].scriptName;
                } else if ($scope.list[j].scriptType == "CONTEXT") {
                    $scope.list[j].scriptName = "__" + $scope.list[j].scriptName;
                } else {
                    $scope.list[j].scriptName = "__" + $scope.list[j].scriptName;
                }
                $scope.list[j].params = strParams.replace(/^\s+|\s+$/g, "");
            }
        });
    }



    $scope.addTaskPlanButton = function() {

        var projectGroupName = document.getElementsByName("projectGroupName")[0];
        var index = projectGroupName.selectedIndex;
        var id = projectGroupName.options[index].value;
        window.location.href = ('/task/add?projectGroupId=' + id);
    }

    $scope.editScriptButton = function(script) {
        window.location.href = ('/script/edit?scriptId=' + script.id);
    }

    $scope.deleteScript = function(script) {
        var r = window.confirm("确认要删除\"" + script.scriptName + "\"这个script吗？");
        if (!r) {
            return;
        }
        $http({
            method: "POST",
            url: "/script/delete",
            data: script,
        }).then(response => {
            $http({
                method: "POST",
                url: "/script/list",
            }).then(response => {
                $scope.list = response.data;

                for (j = 0; j < $scope.list.length; j++) {
                    //alert($scope.list[j].params);
                    jsonParams = JSON.parse($scope.list[j].params);
                    strParams = "";
                    for (i = 0; i < jsonParams.length; i++) {
                        comma = "";
                        if (i > 0) {
                            comma = ",";
                        }
                        strParams = strParams + comma + jsonParams[i][0];
                    }
                    //alert($scope.list[j].scriptType);
                    if ($scope.list[j].scriptType == "SIMPLE") {
                        //         					$scope.list[j].scriptName = "__S_" + $scope.list[j].scriptName;
                        $scope.list[j].scriptName = "__" + $scope.list[j].scriptName;
                    } else if ($scope.list[j].scriptType == "CONTEXT") {
                        //         					$scope.list[j].scriptName = "__C_" + $scope.list[j].scriptName;
                        $scope.list[j].scriptName = "__" + $scope.list[j].scriptName;
                    } else {
                        $scope.list[j].scriptName = "__" + $scope.list[j].scriptName;
                    }
                    $scope.list[j].params = strParams.replace(/^\s+|\s+$/g, "");
                }
            });
        });
    }

    $scope.execScriptButton = function(scriptId) {
        $http({
            method: "GET",
            url: "/script/debug?scriptId=" + scriptId
        });
    }
});