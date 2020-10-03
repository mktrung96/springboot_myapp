(function () {
    'use strict';
    var controllerId = 'areaController';

    angular.module('SalaryApp').controller(controllerId, areaController);

    function areaController($scope, $http, $timeout, $rootScope, $log, Constant, Restangular, CommonService, kendoConfig, $kWindow) {
        var vm = this;
        var modalAdd;
        var modalEdit;

        initFormData();

        //
        function initFormData() {
            vm.searchForm = {};
            vm.addForm = {};
            vm.activeArray = [
                {idActive: "Y", nameActive: "Hoạt động"},
                {idActive: "N", nameActive: "Không hoạt động"}
            ];
            vm.isSummaryArray = [
                {id: "Y", name: "Có"},
                {id: "N", name: "Không"}
            ];
            vm.modalBody = ".k-widget.k-window";
            vm.isAdmin = false;
            if (Constant.user.isAdmin == 'Y') {
                vm.isAdmin = true;
            }

        }

        //
        var record = 0;
        // Grid colunm config
        vm.areaGridOptions = kendoConfig.getGridOptions({
            autoBind: true,
            scrollable: true,
            resizable: true,
            editable: false,
            dataBound: function (e) {
                // var grid = vm.searchFormGrid;
            },
            save: function () {
                vm.areaGrid.refresh();
            },
            dataBinding: function () {
                record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            },
            reorderable: true,
            toolbar: [
                {
                    name: "actions",
                    template: '<div class=" pull-left ">' +
                        '<button ng-if="vm.isAdmin" type="button" class="btn btn-primary" ng-click="vm.openAdd()">Tạo mới' +
                        '</button>' +
                        '<button class="btn btn-outline-dark btn-md my-0 ml-sm-2" '
                    // +
                    // 'type="submit" ng-click="vm.openImportFile">Import File' +
                    // '</button>' +
                    // +
                    // '</div>'
                    // '<button type="submit" class="btn btn-outline-dark btn-md my-0 ml-sm-2" ng-click="vm.saveForm()">Tải biểu mẫu' +
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
                        url: "area/getListArea",
                        contentType: "application/json; charset=utf-8",
                        type: "POST"
                    },
                    parameterMap: function (options, type) {
                        vm.searchForm.page = options.page
                        vm.searchForm.pageSize = options.pageSize
                        return JSON.stringify(vm.searchForm);

                    }
                },
                pageSize: 5
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
                        translate: ""
                    },
                    attributes: {
                        style: "text-align:center;"
                    },
                },
                {
                    field: "code",
                    title: "Mã khu vực",
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
                    title: "Tên KV",
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
                    field: "parentCode",
                    title: "Khu vực cha",
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
                        if (dataItem.isActive === 'Y') {
                            return "Hoạt động";
                        } else if (dataItem.isActive === 'N') {
                            return "Không hoạt động";
                        } else
                            return "";
                    }
                }, {
                    title: "Thao tác",
                    headerAttributes: {
                        style: "text-align:center;",
                        translate: ""
                    },

                    template: function (dataItem) {
                        return (
                            '<div class="text-center #=areaId#"">' +
                            '<button ng-show="vm.isAdmin == true && vm.checkActive(dataItem)" style=" border: none; background-color: white;"' +
                            'class="#=areaId# icon_table"  uib-tooltip="Sửa" translate ng-click="vm.openEdit(dataItem)" >' +
                            '<i  style="color:#f1c40f;" class="fa fa-pencil " aria-hidden="true"></i>' +
                            '</button>' +
                            '<button ng-show="vm.isAdmin == true && vm.checkActive(dataItem)" style=" border: none; background-color: white;" class="#=areaId# icon_table ng-scope" uib-tooltip="Xóa" translate="" ' +
                            'ng-click="vm.remove(dataItem)" > <i style="color:steelblue;" class="fa fa-trash ng-scope" aria-hidden="true"></i>' +
                            '</button>' +
                            '</div>'
                        )
                    },
                    width: "120px",
                    field: "stt"
                }],
        });

        vm.checkActive = function (dataItem){
            if (dataItem.isActive == "Y"){
                return true;
            }else {
                return false;
            }

        }

        vm.openAdd = function () {
            vm.addForm = {};
            vm.typeCreate = 'add';
            var templateUrl = 'myapp/area/addPopup.html';
            var title = "Thêm mới khu vực";
            modalAdd = CommonService.createCustomPopupWithEvent(templateUrl, title, vm, null, "75%", "30%", initDataAddFunction, null);
        };

        function initDataAddFunction() {
            $("#area_add_popupId").click(function (e) {
                console.log(vm.addForm);
            });
        }

        vm.openEdit = function (dataItem) {
            vm.typeCreate = 'edit';
            var templateUrl = 'myapp/area/addPopup.html';
            var title = "Thêm mới khu vực";
            modalEdit = CommonService.createCustomPopupWithEvent(templateUrl, title, vm, null, "75%", "30%", initDataEditFunction(dataItem), null);
        };

        function initDataEditFunction(dataItem) {
            $("#area_add_popupId").click(function (e) {
                console.log(vm.addForm);
            });
            vm.addForm.areaId = dataItem.areaId;
            vm.addForm.segno = dataItem.segno;
            vm.addForm.code = dataItem.code;
            vm.addForm.name = dataItem.name;
            vm.addForm.unit = dataItem.unit;
            vm.addForm.parentId = dataItem.parentId;
            vm.addForm.parentCode = dataItem.parentCode;
            vm.addForm.parentName = dataItem.parentName;
            vm.addForm.isActive = dataItem.isActive;
            vm.addForm.isSummary = dataItem.isSummary;

        }

        vm.saveItem = function () {
            var obj = vm.addForm;
            if (obj.code == undefined || obj.code == "") {
                toastr.error("Chưa chọn mã khu vực");
                return;
            }
            if (obj.name == undefined || obj.name == "") {
                toastr.error("Chưa chọn tên khu vực");
                return;
            }
            if (obj.isSummary == undefined || obj.isSummary == "") {
                toastr.error("Chưa chọn isSummary");
                return;
            }
            kendo.ui.progress($(vm.modalBody), true);
            if (vm.typeCreate === 'add') {
                Restangular.all("area/save").post(obj).then(function (response) {
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.success("Ghi lại thành công");
                    vm.doSearch();
                    modalAdd.close();
                }).catch(function (err) {
                    kendo.ui.progress($(vm.modalBody), false);
                    console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                });

            } else if (vm.typeCreate === 'edit') {
                Restangular.all("area/edit").post(obj).then(function (response) {
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.success("Ghi lại thành công");
                    vm.doSearch();
                    modalEdit.close();
                }).catch(function (err) {
                    kendo.ui.progress($(vm.modalBody), false);
                    console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                });
            }
        };

        vm.remove = function (dataItem) {
            kendo.ui.progress($(vm.modalBody), true);
            var obj = {};
            obj.areaId = dataItem.areaId;
            confirm(CommonService.translate('Xác nhận xóa'), function () {
                Restangular.all("area/remove").post(obj).then(function (response) {
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.success(CommonService.translate("Xóa thành công!!"));
                    vm.doSearch();
                }).catch(function (err) {
                    kendo.ui.progress($(vm.modalBody), false);
                    console.log('Không thể kết nối để lấy dữ liệu: ' + err.message);
                });
            })
        };

        vm.doSearch = doSearch;

        function doSearch() {
            if ($('.k-invalid-msg').is(':visible')) {
                return;
            }
            console.log(vm.searchForm);
            var grid = vm.areaGrid;
            CommonService.doSearchGrid(grid, {pageSize: grid.dataSource.pageSize()});
            grid.refresh();
        };

        /*
         * đóng Popup
         */
        vm.cancel = function () {
            $("div.k-window-actions > a.k-window-action > span.k-i-close").click();
            // vm.doSearch();
            // modalAdd.cancel()
        };

        vm.parentOptions = {
            dataTextField: "parentName",
            dataValueField: "parentCode",
            placeholder: CommonService.translate("Nhập mã hoặc tên khu vực"),
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
                        vm.addForm.parentId = null;
                        vm.addForm.parentCode = null;
                        $("#areaParent").val(null);
                    }
                }, 100);
            },
            close: function (e) {
                $timeout(function () {
                    if (vm.addForm.parentId == null) {
                        document.getElementById("areaParent").value = "";
                    }
                }, 1000);

            },
            pageSize: 10,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        vm.isSelect = false;
                        return Restangular.all("area/getParentAreasForAutoComplete").post(
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
                '<div class="row">' +
                '<p class="col-md-6 text-header-auto border-right-ccc" translate>Mã KV </p>' +
                '<p class="col-md-6 text-header-auto" translate>Tên KV </p>' +
                '</div>' +
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
