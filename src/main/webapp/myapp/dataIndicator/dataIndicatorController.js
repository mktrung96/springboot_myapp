(function () {
    'use strict';
    var controllerId = 'dataIndicatorController';

    angular.module('SalaryApp').controller(controllerId, dataIndicatorController);

    function dataIndicatorController($scope, $http,$timeout,$rootScope, $log,Constant,Restangular,CommonService,kendoConfig,$kWindow) {
        var vm = this;
        initFormData();
        //
        function initFormData() {
            $("#searchForm_dataIndicator_id").click(function (e) {
                console.log(vm.searchForm);
            });
            vm.searchForm = {};
            vm.addForm = {};
            vm.activeArray = [
                {idActive: "Y", nameActive: "Hoạt động"},
                {idActive: "N", nameActive: "Không hoạt động"}
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
        vm.dataIndicatorGridOptions = kendoConfig.getGridOptions({
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
                        '<button class="btn btn-outline-dark btn-md my-0 ml-sm-2" ' +
                        'type="submit" ng-click="vm.exportExcel()" >Export File' +
                        '</button>' +
                        '</div>'

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
                        url:  "/dataIndicator/getListDataIndicator",
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
                    title: "Nhân viên",
                    field: "username",
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
                    title: "Mã khu vực",
                    field: "areaCode",
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
                    title: "Mã chỉ tiêu",
                    field: "indicatorCode",
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
                    title: "Ngày nhập",
                    field: "date",
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
                    field: "value",
                    title: "Giá trị",
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
                    title: "Nội dung",
                    field: "content",
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
                    field: "created",
                    title: "Ngày tạo",
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
            ],
        });

        vm.doSearch = doSearch;
        function doSearch() {
            var grid = vm.dataIndicatorGrid;
            CommonService.doSearchGrid(grid,{pageSize: grid.dataSource.pageSize()});
            // $('#gridList').data('kendoGrid').dataSource.read();
            $('#gridList').data('kendoGrid').refresh();
            // grid.refresh();
        };

        vm.listRemove = [{
            title: CommonService.translate("Thao tác"),
        },{
            title: ""
        }];

        vm.listConvert = [{
            field: "isActive",
            data: {
                'Y' : CommonService.translate('Hoạt động'),
                'N' : CommonService.translate('Không hoạt động')

            }
        }];
        // vm.exportExcel_bo = function (){
        //     var obj={};
        //     obj.dateFrom = vm.searchForm.dateFrom;
        //     obj.dateTo = vm.searchForm.dateTo;
        //     obj.userId = vm.searchForm.userId;
        //     obj.areaId = vm.searchForm.areaId;
        //     obj.indicatorId = vm.searchForm.indicatorId;
        //     Restangular.all("dataIndicator/getListDataIndicator").post(obj).then(function (d) {
        //         CommonService.exportFile(vm.dataIndicatorGrid, d.data, vm.listRemove, vm.listConvert,  CommonService.translate("Dữ liệu quan trắc"));
        //     });
        // }

        vm.exportExcel= function(){
            var obj={};
            obj.dateFrom = vm.searchForm.dateFrom;
            obj.dateTo = vm.searchForm.dateTo;
            obj.userId = vm.searchForm.userId;
            obj.areaId = vm.searchForm.areaId;
            obj.indicatorId = vm.searchForm.indicatorId;
            obj.reportType="EXCEL";
            obj.reportName="BaoCaoTongHopTheoChiTieu";
            var date = kendo.toString(new Date((new Date()).getTime()),"dd-MM-yyyy");
            kendo.ui.progress($(vm.modalBody), true);
            CommonService.exportReport(obj).then(
                function(data) {
                    kendo.ui.progress($(vm.modalBody), false);
                    var binarydata= new Blob([data],{ type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    kendo.saveAs({dataURI: binarydata, fileName: date + "_BaoCaoTongHopTheoChiTieu" + '.xlsx'});
                }, function(errResponse) {
                    kendo.ui.progress($(vm.modalBody), false);
                    toastr.error(CommonService.translate("Lỗi không export EXCEL được!"));
                });
        };

        vm.userOptions = {
            dataTextField: "fullName",
            dataValueField: "username",
            open: function (e) {
                vm.isSelect = false;
            },
            select: function (e) {
                vm.isSelect = true;
                var dataItem = this.dataItem(e.item.index());
                vm.searchForm.username = dataItem.username;//thành name
                vm.searchForm.fullName = dataItem.fullName;
                vm.searchForm.userId = dataItem.userId;
            },
            change: function (e) {
                $timeout(function () {
                    if (e.sender.value() === '' || !vm.isSelect) {
                        vm.searchForm.username = null;
                        vm.searchForm.userId = null;
                        $("#user_searchForm").val(null);
                    }
                }, 100);
            },
            close: function (e) {
                $timeout(function () {
                    if (vm.searchForm.userId == null) {
                        document.getElementById("user_searchForm").value = "";
                    }
                }, 1000);

            },
            pageSize: 10,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        vm.isSelect = false;
                        return Restangular.all("user/getUsersForAutoComplete").post(
                            {
                                username: vm.searchForm.username
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
                '<p class="col-md-6 text-header-auto border-right-ccc" translate>Mã NV </p>' +
                '<p class="col-md-6 text-header-auto" translate>Tên NV </p>' +
                '</div>'+
                '</div>',
            template: '<div class="row" ><div class="col-md-6 col-xs-5" style="float:left">#: data.username #</div><div  style="padding-left: 5px;width:auto;overflow: hidden"> #: data.fullName #</div> </div>',

        };

        vm.indicatorOptions = {
            dataTextField: "indicatorName",
            dataValueField: "indicatorCode",
            open: function (e) {
                vm.isSelect = false;
            },
            select: function (e) {
                vm.isSelect = true;
                var dataItem = this.dataItem(e.item.index());
                vm.searchForm.indicatorName = dataItem.indicatorName;
                vm.searchForm.indicatorCode = dataItem.indicatorCode;
                vm.searchForm.indicatorId = dataItem.indicatorId;
            },
            change: function (e) {
                $timeout(function () {
                    if (e.sender.value() === '' || !vm.isSelect) {
                        vm.searchForm.indicatorName = null;
                        vm.searchForm.indicatorCode = null;
                        vm.searchForm.indicatorId = null;
                        $("#user_searchForm").val(null);
                    }
                }, 100);
            },
            close: function (e) {
                $timeout(function () {
                    if (vm.searchForm.indicatorId == null) {
                        document.getElementById("dai_indicator_searchForm").value = "";
                    }
                }, 1000);

            },
            pageSize: 10,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        vm.isSelect = false;
                        return Restangular.all("indicator/getIndicatorsForAutoComplete").post(
                            {
                                username: vm.searchForm.indicatorName
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
            template: '<div class="row" ><div class="col-md-6 col-xs-5" style="float:left">#: data.indicatorCode #</div><div  style="padding-left: 5px;width:auto;overflow: hidden"> #: data.indicatorName #</div> </div>',

        };

        vm.areaOptions = {
            dataTextField: "areaName",
            dataValueField: "areaCode",
            open: function (e) {
                vm.isSelect = false;
            },
            select: function (e) {
                vm.isSelect = true;
                var dataItem = this.dataItem(e.item.index());
                vm.searchForm.areaName = dataItem.areaName;
                vm.searchForm.areaCode = dataItem.areaCode;
                vm.searchForm.areaId = dataItem.areaId;
            },
            change: function (e) {
                $timeout(function () {
                    if (e.sender.value() === '' || !vm.isSelect) {
                        vm.searchForm.areaName = null;
                        vm.searchForm.areaCode = null;
                        vm.searchForm.areaId = null;
                        $("#dai_area_searchForm").val(null);
                    }
                }, 100);
            },
            close: function (e) {
                $timeout(function () {
                    if (vm.searchForm.areaId == null) {
                        document.getElementById("dai_area_searchForm").value = "";
                    }
                }, 1000);

            },
            pageSize: 10,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        vm.isSelect = false;
                        return Restangular.all("area/getAreasForAutoComplete").post(
                            {
                                name: vm.searchForm.areaName
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
                '<p class="col-md-6 text-header-auto border-right-ccc" translate>Mã KV </p>' +
                '<p class="col-md-6 text-header-auto" translate>Tên KV </p>' +
                '</div>'+
                '</div>',
            template: '<div class="row" ><div class="col-md-6 col-xs-5" style="float:left">#: data.areaCode #</div><div  style="padding-left: 5px;width:auto;overflow: hidden"> #: data.areaName #</div> </div>',

        };

        vm.clear = function (data) {
            switch (data) {
                case 'userList':
                    vm.searchForm.userId = null;
                    vm.searchForm.username = null;
                    vm.searchForm.fullName = null;
                    break;
                case 'indicator':
                    vm.searchForm.indicatorId = null;
                    vm.searchForm.indicatorCode = null;
                    vm.searchForm.indicatorName = null;
                    break;
                case 'areaList':
                    vm.searchForm.areaId = null;
                    vm.searchForm.areaCode = null;
                    vm.searchForm.areaName = null;
                    break;
                case 'dateList':
                    vm.searchForm.dateFrom = null;
                    vm.searchForm.dateTo = null;
                    break;

                default:0
            }
        }
    }
})();
