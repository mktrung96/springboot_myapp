/*------------------Created by Tung Mp-------------------*/
    /*-------------------15/10/2019-------------------*/
angular.module("LoginApp", []).controller("loginController", loginController);

function loginController($scope, $http, $log, $rootScope, $timeout, $window) {
    $scope.logacc = {
        username: "",
        password: ""
    };
    // $scope.baseUrlApi = 'http://localhost:9001';
    //$scope.baseUrlApi = 'http://10.61.19.230:9001';
    $scope.dataContents;
    $scope.submitLogin = function (logacc) {
        dataContents = {
            data: $scope.logacc
        };
        checkLogin(dataContents);
    }

    function saveSesionKey(skey,fullname) {
        try {
            // session save key
            sessionStorage.setItem("sessionKey", skey);
            sessionStorage.setItem("nameUsing", fullname);
        } catch (e) {
            console.log("không lưu được session");
        }
    }

    function checkLogin(logInfo) {
        $http({
            method: 'Post',
            url:   '/api/login',
            data: JSON.stringify(logInfo),
            header: {'Content-Type': 'application/json'}
        }).then(function successCallBack(response) {
                // console.log(response.data);
                // console.log(response.data.data.token);
                if (response.data.status == "200") {
                    saveSesionKey(response.data.data.token,response.data.data.salaryUser.fullname);
                    $window.location.href = '../index.html';
                } else {
                    console.log("Login Failed");
                    $scope.responeLogin = "Đăng nhập thất bại, xin vui lòng thử lại !";
                    $('#itemLogin').modal('show');
                    $timeout(callAtTimeout, 1500);
                }
            },
            function errorCallBack(response) {

                console.log("Login Failed");
                $scope.responeLogin = "Đăng nhập thất bại, xin vui lòng thử lại !";
                $('#itemLogin').modal('show');
                $timeout(callAtTimeout, 1500);
                //$('#itemLogin').modal('hide');
            }
        )
    }

    function callAtTimeout() {
        $('#itemLogin').modal('hide');
    }
}
