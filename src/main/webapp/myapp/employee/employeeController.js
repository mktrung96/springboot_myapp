(function (message) {
    'use strict';
    var controllerId = 'employeeController';

    angular.module('SalaryApp').controller(controllerId, employeeController);

    function employeeController($scope, $http,$timeout,$rootScope, $log,Constant,Restangular,CommonService,kendoConfig,$kWindow) {
        var vm = this;
        var modalAdd,modalEdit,modalChanePass;
        initFormData();

        function initFormData() {
            vm.searchForm = {};
            vm.addForm = {};
            vm.activeArray = [
                {idActive: "Y", nameActive: "Hoạt động"},
                {idActive: "N", nameActive: "Không hoạt động"}
            ];
            vm.permissionArray = [
                {idAdmin: "Y", nameAdmin: "Admin"},
                {idAdmin: "N", nameAdmin: "Normal User"}
            ];
            vm.modalBody = ".k-widget.k-window";
            vm.isAdmin = false;
            if (Constant.user.isAdmin == 'Y'){
                vm.isAdmin = true ;
            }
        }
        //
        var record = 0;

        vm.employeeGridOptions = kendoConfig.getGridOptions({
                autoBind: true,
                scrollable: true,
                resizable: true,
                editable: false,
                dataBinding: function () {
                    record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
                },
                reorderable: true,
                toolbar: [
                    {
                        name: "actions",
                        template: '<div class=" pull-left ">' +
                            '<button type="button" class="btn btn-primary" ng-click="vm.openAdd()">Tạo mới' +
                            '</button>'
                    }
                ],
                dataSource: {
                    serverPaging: true,
                    schema: {
                        total: function (response) {
                            $timeout(function () {
                                vm.count = response.data.total
                            });
                            return response.data.total;
                        },
                        data: function (response) {
                            return response.data.data;
                        }
                    },
                    transport: {
                        read: {
                            url: "/user/getListEmployee",
                            contentType: "application/json; charset=utf-8",
                            type: "POST"
                        },
                        parameterMap: function (options, type) {
                            var obj = angular.copy(vm.searchForm);
                            obj.page = options.page;
                            obj.pageSize = options.pageSize;
                            return JSON.stringify(obj);

                        }
                    },
                    pageSize: 10
                },
                columnMenu: false,
                noRecords: true,
                messages: {
                    noRecords: ("Không có kết quả hiển thị")
                },
                pageable: {
                    refresh: false,
                    pageSizes: [5, 10, 15, 20, 25],
                    // buttonCount: 5,
                    messages: {
                        display: "{0}-{1} của {2} kết quả",
                        itemsPerPage: "kết quả/trang",
                        empty: "Không có kết quả hiển thị"
                    }
                },
                columns: [
                    {
                        title: "TT",
                        field: "stt",
                        template: function () {
                            return ++record;
                        },
                        width: "3%",
                        headerAttributes: {
                            style: "text-align:center;",
                            translate:""
                        },
                        attributes: {
                            style: "text-align:center;"
                        },
                    },
                    {
                        field: "username",
                        title: "Tên đăng nhập",
                        headerAttributes: {
                            "class": "table-header-cell",
                            style: "text-align: center; font-weight: bold;"
                        },
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center; font-size: 14px"
                        },
                        width: "120px"

                    }, {
                        field: "fullName",
                        title: "Tên đầy đủ",
                        headerAttributes: {
                            "class": "table-header-cell",
                            style: "text-align: center; font-weight: bold;"
                        },
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center; font-size: 14px"
                        },
                        width: "120px"

                    }, {
                        field: "email",
                        title: "Email",
                        headerAttributes: {
                            "class": "table-header-cell",
                            style: "text-align: center; font-weight: bold;"
                        },
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center; font-size: 14px"
                        },
                        width: "120px"
                    }, {
                        field: "phone",
                        title: "Điện thoại",
                        headerAttributes: {
                            "class": "table-header-cell",
                            style: "text-align: center; font-weight: bold;"
                        },
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center; font-size: 14px"
                        },
                        width: "120px"
                    }, {
                        field: "isActive",
                        title: "Trạng thái",
                        width: "120px",
                        headerAttributes: {
                            "class": "table-header-cell",
                            style: "text-align: center; font-weight: bold;"
                        },
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center; font-size: 14px"
                        },
                        template: function (dataItem) {
                            if (dataItem.isActive === 'Y'){
                                return "Hoạt động";
                            } else if (dataItem.isActive === 'N'){
                                return "Không hoạt động";
                            } else
                                return "";
                        }
                    },
                    {
                        title: "Thao tác",
                        headerAttributes: {
                            style: "text-align:center;",
                            translate:""
                        },

                        template: function (dataItem) {
                           return (
                            '<div class="text-center #=userId#"">' +
                            '<button ng-show="vm.isAdmin == true && vm.checkActive(dataItem)" style=" border: none; background-color: white;"' +
                            'class="#=userId# icon_table"  uib-tooltip="Sửa" translate ng-click="vm.openEdit(dataItem)" >' +
                            '<i  style="color:#f1c40f;" class="fa fa-pencil " aria-hidden="true"></i>' +
                            '</button>' +
                            '<button ng-show="vm.isAdmin == true && vm.checkActive(dataItem)" style=" border: none; background-color: white;"' +
                            'class="#=userId# icon_table"  uib-tooltip="Đổi mật khẩu" translate ng-click="vm.openChangePass(dataItem)" >' +
                            '<i  style="color:#17a2b8;" class="fa fa-exchange" aria-hidden="true"></i>' +
                            '</button>' +
                            '<button ng-show="vm.isAdmin == true && vm.checkActive(dataItem) " style=" border: none; background-color: white;" class="#=areaId# icon_table ng-scope" uib-tooltip="Xóa" translate="" ' +
                            'ng-click="vm.remove(dataItem)" > <i style="color:steelblue;" class="fa fa-trash ng-scope" aria-hidden="true"></i>' +
                            '</button>'+
                            '</div>'
                           )
                        },
                        width: "120px",
                        field: "stt"
                    }
                ],
            }
        );

        vm.checkActive = function (dataItem){
            if (dataItem.isActive == "Y"){
                return true;
            }else {
                return false;
            }

        }

        vm.doSearch = doSearch;
        function doSearch() {
            var grid = vm.employeeGrid;
            CommonService.doSearchGrid(grid,{pageSize: grid.dataSource.pageSize()});
            grid.refresh();
        };

        vm.openAdd = function (){
            vm.addForm = {};
            vm.typeCreate = 'add';
            var templateUrl = 'myapp/employee/addPopup.html';
            var title = "Thêm mới nhân viên";
            modalAdd = CommonService.createCustomPopupWithEvent(templateUrl, title, vm, null, "80%", "40%", initDataAddFunction, null);
        };

        function initDataAddFunction() {
            $("#employee_add_popupId").click(function (e) {
                console.log(vm.addForm);
            });
        }

        vm.openEdit = function (dataItem){
            vm.typeCreate = 'edit';
            var templateUrl = 'myapp/employee/addPopup.html';
            var title = "Thêm mới chỉ tiêu";
            modalEdit = CommonService.createCustomPopupWithEvent(templateUrl, title, vm, null, "80%", "40%", initDataEditFunction(dataItem), null);
        };

        function initDataEditFunction(dataItem) {
            $("#employee_add_popupId").click(function (e) {
                console.log(vm.addForm);
            });
            vm.addForm.userId = dataItem.userId;
            vm.addForm.username =dataItem.username;
            vm.addForm.fullName = dataItem.fullName;
            vm.addForm.phone = dataItem.phone;
            vm.addForm.email = dataItem.email;
            vm.addForm.isActive = dataItem.isActive;
            vm.addForm.isAdmin = dataItem.isAdmin;

        }

        vm.openChangePass = function (dataItem){
            var templateUrl = 'myapp/employee/changePass.html';
            var title = "Đổi mật khẩu";
            modalChanePass = CommonService.createCustomPopupWithEvent(templateUrl, title, vm, null, "80%", "40%", initDataChangePassFunction(dataItem), null);
        };

        function initDataChangePassFunction(dataItem) {
            $("#employee_add_popupId").click(function (e) {
                console.log(vm.addForm);
            });
            vm.addForm = {};
            vm.addForm.userId = dataItem.userId;
            vm.addForm.username =dataItem.username;
            vm.addForm.fullName = dataItem.fullName;
            vm.typeCreate = 'changePass';
        }

        vm.saveItem = function () {
            var obj = vm.addForm;
            if (obj.username == undefined || obj.username == "" ){
                toastr.error("Chưa chọn tên đăng nhập");
                return;
            }
            if (obj.fullName == undefined || obj.fullName == ""){
                toastr.error("Chưa chọn tên đầy đủ");
                return;
            }
            if (obj.email == undefined|| obj.email == ""){
                toastr.error("Chưa chọn email");
                return;
            }
            if (obj.phone == undefined || obj.phone == "" ){
                toastr.error("Chưa chọn số điện thoại");
                return;
            }
            if (obj.isAdmin == undefined || obj.isAdmin == "" ){
                toastr.error("Chưa quyền quản trị");
                return;
            }

            if (vm.typeCreate === 'add'){
                if (obj.password == undefined || obj.password == "" ){
                    toastr.error("Chưa nhập mật khẩu");
                    return;
                }
                if (obj.passwordConfirm == undefined || obj.passwordConfirm == "" ){
                    toastr.error("Chưa nhập mật khẩu xác nhận");
                    return;
                }
                kendo.ui.progress($(vm.modalBody), true);
                Restangular.all("user/save").post(obj).then(function(response){
                    kendo.ui.progress($(vm.modalBody), false);
                    if (response.code == "error"){
                        toastr.error(response.data);
                        return;
                    }
                    toastr.success("Ghi lại thành công");
                    vm.doSearch();
                    modalAdd.close();
                }).catch(function (err) {
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.error(err.data);
                    console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                });

            }else if(vm.typeCreate === 'edit'){
                kendo.ui.progress($(vm.modalBody), true);
                Restangular.all("user/edit").post(obj).then(function(response){
                    kendo.ui.progress($(vm.modalBody), false);
                    if (response.code == "error"){
                        toastr.error(response.data);
                        return;
                    }
                    toastr.success("Ghi lại thành công");
                    vm.doSearch();
                    modalEdit.close();
                }).catch(function (err) {
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.error(err.data);
                    console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                });
            }
        };

        vm.saveChangePass = function () {
            var obj = vm.addForm;
            if (obj.password == undefined || obj.password == "" ){
                toastr.error("Chưa nhập mật khẩu");
                return;
            }
            if (obj.passwordConfirm == undefined || obj.passwordConfirm == "" ){
                toastr.error("Chưa nhập mật khẩu xác nhận");
                return;
            }
            kendo.ui.progress($(vm.modalBody), true);
            if (vm.typeCreate === 'changePass'){
                Restangular.all("user/changePass").post(obj).then(function(response){
                    kendo.ui.progress($(vm.modalBody), false);
                    if (response.code == "error"){
                        toastr.error(response.data);
                        return;
                    }
                    toastr.success("Ghi lại thành công");
                    vm.doSearch();
                    modalChanePass.close();
                }).catch(function (err) {
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.error(err.data);
                    console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                });

            }
        };

        vm.remove = function (dataItem){
            kendo.ui.progress($(vm.modalBody), true);
            confirm(CommonService.translate('Xác nhận xóa'), function () {
                var obj = {};
                obj.userId = dataItem.userId;
                Restangular.all("user/remove").post(obj).then(function(response){
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.success(CommonService.translate("Xóa thành công!!"));
                    vm.doSearch();
                }).catch(function (err) {
                    kendo.ui.progress($(vm.modalBody), false);
                    console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                });
            })
        };
        /*
     * đóng Popup
     */
        vm.cancel = function () {
            $("div.k-window-actions > a.k-window-action > span.k-i-close").click();
            // vm.doSearch();
            // modalAdd.cancel()
        };

        vm.clear = function (data) {
            switch (data) {
                case 'keySearch':
                    vm.searchForm.keySearch = null;
                    break;
                default:0
            }
        }
    }
})();
