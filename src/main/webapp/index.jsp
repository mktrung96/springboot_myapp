<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<%--<!DOCTYPE html>--%>
<%--<html lang="en">--%>
<%--<head>--%>
<%--    <meta charset="utf-8">--%>
<%--    <title>Create an account</title>--%>
<%--    <link href="${contextPath}/resources/css/bootstrap.min.css" rel="stylesheet">--%>
<%--</head>--%>
<%--<body>--%>
<%--  <div class="container">--%>
<%--    <c:if test="${pageContext.request.userPrincipal.name != null}">--%>
<%--        <form id="logoutForm" method="POST" action="${contextPath}/logout">--%>
<%--            <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>--%>
<%--        </form>--%>

<%--            <h2>Welcome ${pageContext.request.userPrincipal.name} | <a onclick="document.forms['logoutForm'].submit()">Logout</a></h2>--%>
<%--    </c:if>--%>
<%--  </div>--%>
<%--  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>--%>
<%--  <script src="${contextPath}/resources/js/bootstrap.min.js"></script>--%>
<%--</body>--%>
<%--</html>--%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Hệ thống quan trắc</title>
    <!-- Bootstrap core CSS -->
<%--    <link href="${contextPath}/assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />--%>
    <link href="${contextPath}/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" type="image/png" href="${contextPath}/resources/image/logo/IoT.png"/>
    <!-- Custom styles for this template -->
    <link href="${contextPath}/resources/css/simple-sidebar.css" rel="stylesheet">
    <!-- Kendo styles for this template -->
    <link rel="stylesheet" href="${contextPath}/resources/kendoui/styles_new/kendo.common.min.css">
    <link rel="stylesheet" href="${contextPath}/resources/kendoui/styles_new/kendo.default.min.css">
    <link rel="stylesheet" href="${contextPath}/resources/kendoui/styles_new/kendo.default.mobile.min.css">
    <link href="${pageContext.request.contextPath}/assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />


    <link href="${contextPath}/assets/layouts/layout/css/custom.min.css" rel="stylesheet" type="text/css" />

<%--    <link href="${contextPath}/assets/global/kendoui/styles/kendo.common-bootstrap.min.css" rel="stylesheet" type="text/css" />--%>
<%--    <link href="${contextPath}/assets/global/kendoui/styles/kendo.bootstrap.min.css" rel="stylesheet" type="text/css" />--%>

    <link href="${contextPath}/assets/layouts/layout/css/kendo.custom.css" rel="stylesheet" type="text/css" /><%--    căn ngang window--%>

<%--    <link rel="stylesheet" href="${contextPath}/assets/layouts/layout/css/angular-ui-tab-scroll.css" />--%>
<%--    <link href="${contextPath}/assets/global/grantt/grantt-custome.css" rel="stylesheet" type="text/css" />--%>


<%--    <link href="${contextPath}/assets/global/css/components.min.css" id="style_components" rel="stylesheet" type="text/css" />--%>
<%--    <link href="${contextPath}/assets/layouts/layout/css/bootstrap.custom.css" rel="stylesheet" type="text/css" />--%>
<%--    <link href="${contextPath}/assets/layouts/layout/css/custom.min.css" rel="stylesheet" type="text/css" />--%>
<%--    <link href="${contextPath}/assets/global/kendoui/styles/kendo.common-bootstrap.min.css" rel="stylesheet" type="text/css" />--%>
<%--    <link href="${contextPath}/assets/global/kendoui/styles/kendo.bootstrap.min.css" rel="stylesheet" type="text/css" />--%>
    <!--Toastr-->
    <link rel="stylesheet" href="${contextPath}/resources/css/toastr.min.css">
</head>
<!-- Body -->
<body data-ng-app="SalaryApp">
<div ng-controller="appController as vm">
    <div class="d-flex" id="wrapper">
        <!-- Sidebar -->
        <div class="bg-light border-right" id="sidebar-wrapper">
            <div class="sidebar-heading" ng-click="returnIndex()"><img src="${contextPath}/resources/image/logo/IoT.png" height="20" width="25"/></head> Hệ thống quan trắc
            </div>
            <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action bg-light" ng-click="onChange1()">Quản lý nhân viên</a>
                <a href="#" class="list-group-item list-group-item-action bg-light" ng-click="onChange2()">Quản lý khu vực</a>
                <a href="#" class="list-group-item list-group-item-action bg-light" ng-click="onChange3()">Quản lý chỉ tiêu</a>
                <a href="#" class="list-group-item list-group-item-action bg-light" ng-click="onChange4()">Quản lý data chỉ tiêu</a>
            </div>
        </div>
        <!-- /#sidebar-wrapper -->
        <!-- Page Content -->
        <!--style="background-color: #7cd1f5"-->
        <div id="page-content-wrapper">
            <!-- BEGIN HEADER -->
            <div  data-ng-controller="HeaderController as vm"data-ng-include="'${contextPath}/tpl/header.html'" >
<%--                <div > </div>--%>
            </div>
            <!-- END HEADER -->

            <!-- Navigate Html in here-->
            <div class="container-fluid" ng-include src="templateUrl()">
            </div>
            <!-- End-->
        </div>
        <!-- /#page-content-wrapper -->
    </div>
    <!-- /#wrapper -->
</div>


<!-- Bootstrap core JavaScript -->
<script src="${pageContext.request.contextPath}/resources/js/jquery-2.2.2.min.js" type="text/javascript"></script>
<%--<script src="${contextPath}/vendor/jquery/jquery.min.js"></script>--%>
<%--<script src="${contextPath}/resources/js/lib/jquery-migrate-3.0.0.min.js"></script>--%>
<%--<script src="${contextPath}/resources/bootstrap/js/bootstrap.min.js"></script>--%>
<script src="${contextPath}/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- Angular-->
<script src="${contextPath}/resources/js/lib/angular.min.js"></script>
<script src="${contextPath}/resources/js/lib/angular-route.min.js"></script>
<script src="${contextPath}/resources/js/angular-ui-router.min.js" type="text/javascript"></script>
<script src="${contextPath}/resources/js/lib/ui-bootstrap-tpls-2.5.0.min.js"></script>
<script src="${contextPath}/resources/js/lib/angular-animate.js"></script>
<script src="${contextPath}/resources/js/lib/angular-touch.min.js"></script>
<script src="${contextPath}/resources/js/lib/restangular.min.js"></script>
<script src="${contextPath}/resources/js/lib/ocLazyLoad.min.js" type="text/javascript"></script>
<!-- Menu-tooger -->
<script src="${contextPath}/resources/js/lib/menu-toggle.js"></script>

<!--Ala Sql-->
<script src="${contextPath}/resources/js/lib/alasql.js" type="text/javascript"></script>

<script src="${contextPath}/resources/js/lib/read-excel-file.min.js" type="text/javascript"></script>

<script src="${contextPath}/resources/js/mainvps.js"></script>
<%--<script src="${contextPath}/resources/js/lib/directives.js"></script>--%>
<!-- AngularController -->
<script src="${contextPath}/myapp/login/loginController.js"></script>
<script src="${contextPath}/myapp/employee/employeeController.js"></script>
<script src="${contextPath}/myapp/area/areaController.js"></script>
<script src="${contextPath}/myapp/indicator/indicatorController.js"></script>
<script src="${contextPath}/myapp/dataIndicator/dataIndicatorController.js"></script>
<script src="${contextPath}/myapp/dashboard/dashboardController.js"></script>

<script src="${contextPath}/myapp/common/CommonService.js" type="text/javascript"></script>
<script src="${contextPath}/myapp/common/CommonUtil.js" type="text/javascript"></script>
<script src="${contextPath}/resources/js/app.constants.js?t=20200717" ></script>
<script src="${contextPath}/resources/js/app.rest.endpoint.js" type="text/javascript"></script>
<script src="${contextPath}/resources/js/app.kendoConfig.js" type="text/javascript"></script>
<script src="${contextPath}/myapp/common/dateTime.js" type="text/javascript"></script>
<script src="${contextPath}/myapp/common/PopupCreatNewController.js" type="text/javascript"></script>
<%--<script src="${contextPath}/myapp/login/loginController.js"></script>--%>



<!-- kendo -->
<script src="${contextPath}/resources/kendoui/js/kendo.all.min.js"></script>
<script src="${contextPath}/resources/kendoui/custom/angular-kendo-window.js" ></script>
<script src="${contextPath}/resources/js/jszip.min.js"></script>
<!-- Toastr -->
<script src="${contextPath}/resources/js/lib/toastr.min.js"></script>
<script src="${contextPath}/resources/js/lib/toastr-conf.js"></script>
<!-- declare -->
<script src="${contextPath}/resources/js/lib/lodash.min.js"></script>
<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/plugins/angular-translate/angular-translate.min.js" type="text/javascript"></script>
<%--<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/plugins/angular-ui-router.min.js" type="text/javascript"></script>--%>
<script src="${pageContext.request.contextPath}/resources/js/angular-ui-tab-scroll.js"></script>

<%--<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/angular.min.js" type="text/javascript"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/angular-sanitize.min.js" type="text/javascript"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/angular-touch.min.js" type="text/javascript"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/angular-cookies.min.js" type="text/javascript"></script>--%>

<%--<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/plugins/ngStorage/ngStorage.min.js"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/plugins/angular-resource.min.js" type="text/javascript"></script>--%>

<%--<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/plugins/angular-translate/angular-translate-loader-static-files.min.js" type="text/javascript"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/plugins/ocLazyLoad.min.js" type="text/javascript"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/global/plugins/angularjs/plugins/ui-bootstrap-tpls-0.14.3.js" type="text/javascript"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/global/scripts/app.min.js" type="text/javascript"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/layouts/layout/scripts/layout.min.js" type="text/javascript"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/layouts/global/scripts/quick-sidebar.min.js" type="text/javascript"></script>--%>
<%--<script src="${pageContext.request.contextPath}/assets/layouts/layout/scripts/demo.min.js" type="text/javascript"></script>--%>


<%--<script src="${pageContext.request.contextPath}/resources/kendoui/js/kendo.all.min.js" type="text/javascript"></script>--%>
<%--<script src="${pageContext.request.contextPath}/resources/kendoui/custom/angular-kendo-window.js" type="text/javascript"></script>--%>
<script type="text/x-kendo-template" id="windowConfirmTemplate">
    <div class="modal-body">
        <label class="control-label" traslate>#= message #</label>
    </div>
    <div class="modal-footer">
        <button id="confirmPopup_btnCancel" type="button" class="btn orange btn-outline padding-search" translate>Bỏ qua
        </button>
        <button id="confirmPopup_btnConfirm" type="button" class="btn orange border-button-tree padding-search-right"
                translate>Xác nhận
        </button>
    </div>
</script>

</body>
</html>
