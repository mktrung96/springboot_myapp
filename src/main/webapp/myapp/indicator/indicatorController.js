(function () {
    'use strict';
    var controllerId = 'indicatorController';

    angular.module('SalaryApp').controller(controllerId, indicatorController);

    function indicatorController($scope, $http,$timeout,$rootScope, $log,Constant,Restangular,CommonService,kendoConfig,$kWindow) {
        var vm = this;
        var bien = Constant.BASE_SERVICE_URL;
        var modalAdd,modalEdit;
        // var check;
        // var dataR;
        // var dataSelect;
        // var fileSize;
        //
        initFormData();
        //
        function initFormData() {
            $("#iot_searchForm_indicatorId").click(function (e) {
                console.log(vm.searchForm);
            });
            // vm.fileSizeMax = $scope.$parent.fileSizeConstant;
            // getListServer();
            vm.searchForm = {
                // isActive : "Y"
            };
            vm.addForm = {};
            vm.activeArray = [
                {id: "Y", nameActive: "Hoạt động"},
                {id: "N", nameActive: "Không hoạt động"}
            ];
            vm.isSummaryArray = [
                {id: "Y", name: "Có"},
                {id: "N", name: "Không"}
            ];
            vm.dataTypeArray = [
                {id: "1", name: "Kiểu số"},
                {id: "2", name: "Kiểu chữ"}
            ];
            vm.modalBody = ".k-widget.k-window";
            vm.isAdmin = false;
            if (Constant.user.isAdmin == 'Y'){
                vm.isAdmin = true ;
            }
        }
        //
        var record = 0;
        // Grid colunm config
        vm.indicatorGridOptions = kendoConfig.getGridOptions({
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
                        '<button ng-if="vm.isAdmin" type="button" class="btn btn-primary" ng-click="vm.openAdd()">Tạo mới'+
                        '</button>'
                        // +
                        // '<button ng-if="vm.isAdmin" class="btn btn-outline-dark btn-md my-0 ml-sm-2" type="submit">Import File' +
                        // '</button>' +
                        // '</div>' +
                        // '<button ng-if="vm.isAdmin" type="submit" class="btn btn-outline-dark btn-md my-0 ml-sm-2" ng-click="vm.saveForm()">Tải biểu mẫu' +
                        // '</button>'
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
                        url:  "/indicator/getListIndicator",
                        contentType: "application/json; charset=utf-8",
                        type: "POST"
                    },
                    parameterMap: function (options, type) {
                        vm.searchForm.page = options.page;
                        vm.searchForm.pageSize = options.pageSize;
                        return JSON.stringify(vm.searchForm);
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
                    field: "code",
                    title: "Mã chỉ tiêu",
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
                    field: "name",
                    title: "Tên chỉ tiêu",
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
                    field: "unit",
                    title: "Đơn vị tính",
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center; font-weight: bold;"
                    },
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center; font-size: 14px"
                    },
                    width: "120px"
                },
                {
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
                    field: "seqNo",
                    title: "Thứ tự hiển thị",
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center; font-weight: bold;"
                    },
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center; font-size: 14px"
                    },
                    width: "120px"
                },{
                    title: "Thao tác",
                    headerAttributes: {
                        style: "text-align:center;",
                        translate:""
                    },

                    template: function (dataItem) {
                        return (
                            '<div class="text-center #=indicatorId#"">' +
                            '<button ng-show="vm.isAdmin == true && vm.checkActive(dataItem) " style=" border: none; background-color: white;"' +
                            'class="#=indicatorId# icon_table"  uib-tooltip="Sửa" translate ng-click="vm.openEdit(dataItem)" >' +
                            '<i  style="color:#f1c40f;" class="fa fa-pencil " aria-hidden="true"></i>' +
                            '</button>' +
                            '<button ng-show="vm.isAdmin ==true && vm.checkActive(dataItem) " style=" border: none; background-color: white;" class="#=indicatorId# icon_table ng-scope" uib-tooltip="Xóa" translate="" ' +
                            'ng-click="vm.remove(dataItem)" > <i style="color:steelblue;" class="fa fa-trash ng-scope" aria-hidden="true"></i>' +
                            '</button>'+
                            '</div>'
                        )
                    },
                    width: "120px",
                    field: "stt"
                }
            ],
        });

        vm.checkActive = function (dataItem){
            if (dataItem.isActive == "Y"){
                return true;
            }else {
                return false;
            }

        }

        vm.doSearch = doSearch;
        function doSearch() {
            if ($('.k-invalid-msg').is(':visible')) {
                return;
            }
            console.log(vm.searchForm);
            var grid = vm.indicatorGrid;
            CommonService.doSearchGrid(grid,{pageSize: grid.dataSource.pageSize()});
            grid.refresh();
        };

        vm.openAdd = function () {
            vm.addForm = {};
            vm.typeCreate = 'add';
            var templateUrl = 'myapp/indicator/addPopup.html';
            var title = "Thêm chỉ tiêu";
            modalAdd = CommonService.createCustomPopupWithEvent(templateUrl, title, vm, null, "75%", "40%", initDataAddFunction, null);
        };

        function initDataAddFunction() {
            $("#indicator_add_popupId").click(function (e) {
                console.log(vm.addForm);
            });
        }

        vm.openEdit = function (dataItem) {
            vm.typeCreate = 'edit';
            var templateUrl = 'myapp/indicator/addPopup.html';
            var title = "Chỉnh sửa chỉ tiêu";
            modalEdit = CommonService.createCustomPopupWithEvent(templateUrl, title, vm, null, "75%", "40%", initDataEditFunction(dataItem), null);
        };

        function initDataEditFunction(dataItem) {
            $("#indicator_add_popupId").click(function (e) {
                console.log(vm.addForm);
            });
            vm.addForm.indicatorId = dataItem.indicatorId;
            vm.addForm.seqNo = dataItem.seqNo;
            vm.addForm.code = dataItem.code;
            vm.addForm.name = dataItem.name;
            vm.addForm.unit = dataItem.unit;
            vm.addForm.dataType = dataItem.dataType;
            vm.addForm.isActive = dataItem.isActive;
            vm.addForm.parentCode = dataItem.parentCode;
            vm.addForm.parentId = dataItem.parentId;
            vm.addForm.parentName = dataItem.parentName;
        }

        vm.saveItem = function () {
            var obj = vm.addForm;
            if (obj.name == undefined || obj.name == "" ){
                toastr.error("Chưa chọn tên chỉ tiêu");
                return;
            }
            if (obj.code == undefined || obj.code == ""){
                toastr.error("Chưa chọn mã chỉ tiêu");
                return;
            }
            if (obj.unit == undefined|| obj.unit == ""){
                toastr.error("Chưa chọn đơn vị tính");
                return;
            }
            if (obj.isSummary == undefined|| obj.isSummary == ""){
                toastr.error("Chưa chọn Là cấp cha");
                return;
            }
            if (obj.dataType == undefined || obj.dataType == "" ){
                toastr.error("Chưa chọn loại dữ liệu");
                return;
            }
            kendo.ui.progress($(vm.modalBody), true);
            if (vm.typeCreate === 'add'){
                Restangular.all("indicator/save").post(obj).then(function(response){
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.success("Ghi lại thành công");
                    vm.doSearch();
                    modalAdd.close();
                }).catch(function (err) {
                    console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                });

            }else if(vm.typeCreate === 'edit'){
                Restangular.all("indicator/edit").post(obj).then(function(response){
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.success("Ghi lại thành công");
                    vm.doSearch();
                    modalEdit.close();
                }).catch(function (err) {
                    console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                });
            }
        };

        /*
		 * đóng Popup
		 */
        vm.cancel = function () {
            $("div.k-window-actions > a.k-window-action > span.k-i-close").click();
            // vm.doSearch();
            // modalAddGood.cancel()
        }
        vm.remove = function (dataItem){
            var obj = {};
            obj.indicatorId = dataItem.indicatorId;
            kendo.ui.progress($(vm.modalBody), true);
            confirm(CommonService.translate('Xác nhận xóa'), function () {
                Restangular.all("indicator/remove").post(obj).then(function(response){
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.success(CommonService.translate("Xóa thành công!!"));
                    vm.doSearch();
                }).catch(function (err) {
                    kendo.ui.progress($(vm.modalBody), false);
                    console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                });
            })
        };

        vm.parentOptions = {
            dataTextField: "parentName", placeholder:CommonService.translate("Nhập mã hoặc tên chỉ tiêu"),
            dataValueField: "parentCode",
            open: function (e) {
                vm.isSelect = false;
            },
            select: function (e) {
                vm.isSelect = true;
                var dataItem = this.dataItem(e.item.index());
                vm.addForm.parentName = dataItem.parentName;//thành name
                vm.addForm.parentCode = dataItem.parentCode;
                vm.addForm.parentId = dataItem.parentId;
            },
            change: function (e) {
                $timeout(function () {
                    if (e.sender.value() === '' || !vm.isSelect) {
                        vm.addForm.parentName = null;
                        vm.addForm.parentCode = null;
                        vm.addForm.parentId = null;
                        $("#indicatorParent").val(null);
                    }
                }, 100);
            },
            close: function (e) {
                $timeout(function () {
                    if (vm.addForm.parentId == null) {
                        document.getElementById("indicatorParent").value = "";
                    }
                }, 1000);

            },
            pageSize: 10,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        vm.isSelect = false;
                        return Restangular.all("indicator/getParentIndicatorsForAutoComplete").post(
                            {
                                name: vm.addForm.parentName
                            }
                        ).then(function (response) {
                            options.success(response.data);
                        }).catch(function (err) {
                            console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                        });
                    }
                }
            },

            headerTemplate: '<div class="dropdown-header text-center k-widget k-header">' +
                '<div class="row">'+
                '<p class="col-md-6 text-header-auto border-right-ccc" translate>Mã chỉ tiêu </p>' +
                '<p class="col-md-6 text-header-auto" translate>Tên chỉ tiêu </p>' +
                '</div>'+
                '</div>',
            template: '<div class="row" ><div class="col-md-6 col-xs-5" style="float:left">#: data.parentCode #</div><div  style="padding-left: 5px;width:auto;overflow: hidden"> #: data.parentName #</div> </div>',

        };

        vm.clear = function (data) {
            switch (data) {
                case 'keySearch':
                    vm.searchForm.keySearch = null;
                    break;

            }
        }
    }
})();
