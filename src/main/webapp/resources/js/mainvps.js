/***
Metronic AngularJS App Main Script
***/

// BUILD LOCAL
// var API_URL="/springboot-myapp/";
var API_URL="";
/* Metronic App */
// var SalaryApp = angular.module("SalaryApp", [
//     // "ui.router",
//     // "oc.lazyLoad",
//     // "ngCookies",
//     // 'ngResource',
//     // 'ngStorage',
//     // 'pascalprecht.translate',
//     // 'kendo.directives',
//     // 'ngIdle',
//     // "ui.bootstrap",
//     // "ngSanitize", // sanitize các html đầu vào
//     // 'kendo.window',
//     // 'gettext',
//     // 'ui.tab.scroll',
//     'restangular',
//     // 'disableAll',
//     // 'vt.directive.isNumber',
//     // 'vt.directive.maskInput',
//     // 'ngMessages' // sử dụng để validate form
// ]);
var SalaryApp = angular.module('SalaryApp', [
    'ui.router',
    'ui.bootstrap',
    "oc.lazyLoad",
    'ui.tab.scroll',
    'kendo.directives',
    "oc.lazyLoad",
    'restangular',
    'kendo.window',
    'pascalprecht.translate']);
SalaryApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
SalaryApp.controller("appController", ["$scope", "$http", "$timeout", "$rootScope","Constant","$kWindow","Restangular", appFunc ]);
function appFunc($scope, $http,$timeout, $rootScope,Constant, $kWindow,Restangular) {
    var vm = this;
    window.confirm = function (message, doYes, caption, callback) {
        caption = caption || 'Xác nhận';
        var windowTemplate = kendo.template($("#windowConfirmTemplate").html());
//        $scope.message= message ;
        var data = { message: message };
        var modalInstance = $kWindow.open({
            options: {
                modal: true,
                title: caption,
                visible: false,
                width: '300',
                height: '150',
                actions: ["close"],
                open: function () {
                    this.wrapper.children('.k-window-content').addClass("fix-footer");

                    $("#confirmPopup_btnCancel" ).click(function() {
                        modalInstance.dismiss();
                    });

                    $("#confirmPopup_btnConfirm" ).click(function() {
                        modalInstance.dismiss();
                        if (doYes && (typeof doYes === "function")) {
                            doYes();
                        }
                    });
                    if(!!callback){
                        callback();
                    }
                }
            },
            template: windowTemplate(data)
        });
    };
    $scope.fileSizeConstant=300;
    init();
    var getOnChange;
    //set Base Url
    function init() {
        getUserInfo();
        // checkSession();
    }
    //Dowload File From Api
    $scope.fileDownload = function fileDown(fileName)
    {
        var bodyElement = document.getElementById("wrapper");
        var a = document.createElement("a");
        a.href =  "/dowload_file?filename=" + fileName;
        bodyElement.appendChild(a);
        a.click();
        bodyElement.removeChild(a);
    }
    //set full name using
    $scope.nameUsing = sessionStorage.getItem("nameUsing");

    //get session key value
    $scope.keySession = function getKeySession() {
        var sessionKey = sessionStorage.getItem("sessionKey");
        return sessionKey;
    }
    //save object User
    // $scope.UserInfo = [];
    //get User Info
    function getUserInfo() {
        var obj = {};
        // var sessionKey = sessionStorage.getItem("sessionKey");
        Restangular.all("user/get_user").post(obj).then(function(response){
            $rootScope.UserInfo = response.data;
            Constant.setUser(response.data);
            options.success(response);
            toastr.success();
        }).catch(function (err) {
            console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
        });
        // $http({
        //     method: 'POST',
        //     url:  "/user/get_user",
        //     data: {token: sessionKey},
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then(function successCallback(response) {
        //         $scope.UserInfo = response.data.data;
        //     },
        //     function errorCallback(response) {
        //     });
    }

    // vm.user.fullname =  Constant.user.fullname;

    // //Check Session by Send request user
    // $scope.checkSessionPage = function () {
    //     checkSession();
    // };
    // function checkSession() {
    //     var objSend = sessionStorage.getItem("sessionKey");
    //     $http({
    //         method: 'POST',
    //         url: $scope.baseUrlApi + "/login/get_user",
    //         data: {token: objSend},
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(function successCallback(response) {
    //         if (response.data.status == 404) {
    //             sessionStorage.clear();
    //             window.location.href = '../salary.ui/login/login.html';
    //         }
    //     },
    //             function errorCallback(response) {
    //                 sessionStorage.clear();
    //                 window.location.href = '../salary.ui/login/login.html';
    //             });
    // }

    //Check file size
    $scope.checkSizeImport = function checkFileSize(nameInput){
        var fi = document.getElementById(nameInput);
        if (fi.files.length > 0) {
            for (var i = 0; i <= fi.files.length - 1; i++) {
                var fsize = fi.files.item(i).size;
                //console.log(fsize);
                var file = Math.round((fsize /(1024*1024)));
                return file;
            }
        }
    }
    //return index html when click logo
    $scope.returnIndex = function () {
        var obj = {
            data: {
                search: '',
            },
            page: '1',
            pageRow: '5',
            token: $scope.keySession()
        };
        var objJson = JSON.stringify(obj)
        // $scope.checkSessionPage();
        window.location.href = 'index.jsp';
    }

    //Check Session by response
    $scope.actionAfterCheckSession = function (responseSession) {
        if (responseSession == 404) {
            sessionStorage.clear();
            window.location.href = '../login.jsp';
        }
    }
    // Notification alert

    //Notification PopUp
    $scope.messShow = function messShowPopUp(popUpName, messRespone) {

        var kendoWindowAssign = $("#" + popUpName + "");
        var title = "Thông báo";
        kendoWindowAssign.kendoWindow({
            width: "500",
            modal: true,
            height: "auto",
            iframe: true,
            resizable: false,
            title: title,
            content: {
                template: '</br>' + '<h6 style="text-align: center";>' + messRespone + '</h6>' + '</br>',
            },
            visible: false
        });
        var popup = $("#" + popUpName + "").data('kendoWindow');
        popup.open();
        popup.center();
        setTimeout(function () {
            popup.close();
        }, 2000);
    }

    $scope.logOut = function () {
        // document.forms['logoutForm'].submit();
        sessionStorage.clear();
        window.location.href = '../login.jsp';
    }
    $scope.onChange1 = function () {
        getOnChange = "employee";
    }
    $scope.onChange2 = function () {
        getOnChange = "area";
    }
    $scope.onChange3 = function () {
        getOnChange = "indicator";
    }
    $scope.onChange4 = function () {
        getOnChange = "dataIndicator";
    }

    //push html where select option
    $scope.templateUrl = function () {
        switch (getOnChange) {
            case "employee":
            {
                return "myapp/employee/employee.html";
                break;
            }
            case "area":
            {
                return "myapp/area/area.html";
                break;
            }
            case "indicator":
            {
                return "myapp/indicator/indicator.html";
                break;
            }
            case "dataIndicator":
            {
                return "myapp/dataIndicator/dataIndicator.html";
                break;
            }
            default:
        }
    }

    // $scope.loginPage = function () {
    //     return "login/login.html";
    // }

}

/* Setup Layout Part - Header */
SalaryApp.controller('HeaderController', ['$scope','$rootScope', 'Constant','Restangular', function($scope,$rootScope, Constant,Restangular) {
    var vm = this;
    $scope.$watch(function() {
        return $rootScope.UserInfo;
    }, function(UserInfo) {
        if (UserInfo==null) {
            return;
        }
        vm.fullName = UserInfo.fullName;


    }, true)

    // $scope.$on('$includeContentLoaded', function() {
    //     Layout.initHeader(); // init header
    // });

    // $scope.logout=function(){
    //     $rootScope.isAuthenticated=false;
    //     Restangular.one("authenServiceRest/logout").get().then(function(response){
    //
    //     }).catch(function (err) {
    //         console.log('Không kết nối dữ liệu ' + err.message);
    //     });
    //
    // };

    $scope.logOut = function () {
        // document.forms['logoutForm'].submit();
        sessionStorage.clear();
        window.location.href = '../login.jsp';
    }

}]);
/* Setup App Main Controller */
// SalaryApp.controller('AppController', ['$scope', function($scope) {
//     $scope.$on('$viewContentLoaded', function() {
//         //App.initComponents(); // init core components
//         //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
//     });
//
//     $scope.changeLanguage = changeLanguage;
//     $scope.activeLangCode = 'VN';
//     $scope.activeFlagIcon = 'vn';
//
//     function changeLanguage(langCode) {
//     	$scope.activeLangCode = langCode;
//
//     	if ('EN' == langCode) {
//     		$scope.activeFlagIcon = 'us';
//     		$translate.use('en_US');
//
//     	} else if ('VI' == langCode) {
//     		$scope.activeFlagIcon = 'vn';
//     		$translate.use('vi_VN');
//     	}
//     }
//
// }]);

SalaryApp.config([ 'Constant', function ( Constant) {
}]);
/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
SalaryApp.config(['$ocLazyLoadProvider', 'scrollableTabsetConfigProvider','RestangularProvider','$uibTooltipProvider', function($ocLazyLoadProvider,
                                                                                                                                  scrollableTabsetConfigProvider, RestangularProvider,$uibTooltipProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });

    scrollableTabsetConfigProvider.setShowTooltips(true);
    scrollableTabsetConfigProvider.setAutoRecalculate(true);
    scrollableTabsetConfigProvider.setTooltipLeftPlacement('bottom');
    scrollableTabsetConfigProvider.setTooltipRightPlacement('left');
    $uibTooltipProvider.options({
        appendToBody: true
    });

    RestangularProvider.setBaseUrl(API_URL);

    RestangularProvider.setDefaultHttpFields({withCredentials: true});

}]);

/* Setup Rounting For All Pages */
// SalaryApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
//     // Redirect any unmatched url
//     $urlRouterProvider.otherwise("myapp/dashboard/dashboard.html");
//     $stateProvider
//         .state('myapp', {
//             url: "",
//             templateUrl: "tpl/mainTab.view.html",
//             controller: "DashboardController",
//             resolve: {
//                 deps: ['$ocLazyLoad', function($ocLazyLoad) {
//                     return $ocLazyLoad.load({
//                         name: 'SalaryApp',
//                         insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
//                         files: [
//                             'assets/global/plugins/jquery.sparkline.min.js',
//                             'assets/pages/scripts/dashboard.js',
//                             'myapp/common/DashboardController.js',
//                         ]
//                     });
//                 }]
//             }
//         })
// }]);









