angular.module('SalaryApp').service('searchType', function () {

});
angular
	.module('SalaryApp')
	.factory('CommonService',
		[
			'RestEndpoint',
			'Restangular',
			'$kWindow',
			'Constant',
			'$rootScope',
			'searchType',
			'$translate',
			'$filter',
			'$q',
			'$http',
			function (RestEndpoint,Restangular, $kWindow, Constant,
					  $rootScope, searchType,$translate, $filter, $q, $http) {

				var factory = {
					createCustomPopupWithEvent: createCustomPopupWithEvent
					, doSearchGrid: doSearchGrid
					,getModalInstance: getModalInstance
					,getModalInstance1:getModalInstance1,
					populatePopupCreate: populatePopupCreate,
					exportReport:exportReport,
					dismissPopup: dismissPopup,
					exportFile : exportFile,
					translate: translate
				};

				var modalInstance;
				var modalInstance1;
				var modalChangePass;
				var item;
				var checkOnePopup = false;
				var checkTowPopup = false;
				return factory;

				function translate(text) {
					try {
						return $translate.instant(text);
					} catch (err) {
						return text;
					}
				}
				//---------- Trung add 24/12/2019
				function createCustomPopupWithEvent(templateUrl, popupTitle, caller, controllerName
					, width, height, doWhenOpen, doWhenClose, data) {
					if (!controllerName) {
						controllerName = 'PopupCreateNewCtrl';
					}
					var pos = {top: "5%", left: "10%"};
					if (typeof height == "string") {
						if (height == "100%" ||
							(height.includes("px") && Number(height.substring(0, height.length - 2)) > screen.height)) {
							pos.top = "1%";
						}
					} else if (typeof height == "number" && height > screen.height) {
						pos.top = "1%";
					}
					var modal = $kWindow.open({
						options : {
							modal : true,
							title : popupTitle,
							visible : false,
							width : width,
							height : height,
							position: pos,
							actions : [ "Minimize", "Maximize", "Close" ],
							open: function() {
								if (doWhenOpen instanceof Function) {
									doWhenOpen(data);
								} else {
									$rootScope.$broadcast(doWhenOpen);
								}
							},
							// activate : function() {
							//     if (doWhenOpen instanceof Function) {
							//         doWhenOpen(data);
							//     } else {
							//         $rootScope.$broadcast(doWhenOpen);
							//     }
							// },
							close: function () {
								if (doWhenClose instanceof Function) {
									doWhenClose(data);
								} else {
									$rootScope.$broadcast(doWhenClose);
								}
							}
						},
						templateUrl : templateUrl,
						controller : controllerName,
						resolve : {
							caller : function() {
								return caller;
							},
							modalInstance : function() {
								return this;
							},
							modalInstance1 : function() {
								return this;
							},
							popup : function() {
								return popupTitle;
							},
							data : function() {
								return data;
							},
							isMultiSelect : function() {
								return null;
							},
							windowId : function() {
								return null;
							},
							isCreateNew : function() {
								return null;
							}
						}
					});

					modal.result.then(function(result) {
						console.log(result);
					});
					return modal;
				}

				function populatePopupCreate(templateUrl,
											 gridTitle, data, caller, windowId,
											 isCreateNew, sizeWith, sizeHeight, idFocus) {
					checkOnePopup = true;
					modalInstance = $kWindow
						.open({
							options: {
								modal: true,
								title: gridTitle,
								visible: false,
								width: sizeWith,
								height: sizeHeight,
								actions: ["Minimize",
									"Maximize", "Close"],
								open: function () {
									$("html, body").css("overflow", "hidden");
									if (!!caller.popupName && (caller.popupName == "DETAIL_POPUP_COPY"))
										caller.onPopupInitiate();
									this.wrapper
										.children(
											'.k-window-content')
										.addClass(
											"fix-footer popup1");
									$rootScope.$broadcast('Popup.open');
								},
								close: function () {
									$("html, body").css("overflow", "");
									$rootScope.$broadcast('Popup.CloseClick');
									isOpening = false;
									checkOnePopup = false;
									if (!!caller.popupName && caller.popupName == "DETAIL_POPUP_COPY")
										caller.onPopupClose();
								},
								activate: function () {
									if (document.getElementById(idFocus))
										document.getElementById(idFocus).focus();
//									if (!!caller.popupName && ( caller.popupName == 'ORDER_LIST'))
//										caller.onPopupInitiate();
								},
							},
							templateUrl: templateUrl,
							controller: 'PopupCreateNewCtrl',
							resolve: {
								data: function () {
									return data;
								},
								caller: function () {
									return caller;
								},
								modalInstance1: function () {
									return this;
								},
								windowId: function () {
									return windowId;
								},
								isCreateNew: function () {
									return isCreateNew;
								},
							}
						});

					modalInstance.result.then(function (result) {
						dismissPopup();
					});
					return modalInstance;
				}

				function doSearchGrid(grid, optsAdd) {
					var opts = {page: 1};
					if (grid) {
						opts.pageSize = grid.dataSource.pageSize();
						if (optsAdd) {
							Object.entries(optsAdd).forEach(function (obj) {
								opts[obj[0]] = obj[1];
							});
						}

						grid.dataSource.query(opts);
					} else {
						console.log("Grid not found!")
					}
				}
				function getModalInstance() {
					return modalInstance;
				}
				function getModalInstance1() {
					return modalInstance1;
				}

				function dismissPopup() {
					modalInstance.close();
					checkOnePopup = false;
					checkTowPopup = false;
				}

				// Export common
				function exportFile(kendoGrid, data, listRemove,
									listConvert,FileName) {
					var selectedRow = [];
					kendoGrid.table.find("tr").each(
						function(idx, item) {
							var row = $(item);
							var checkbox = $(
								'[name="gridcheckbox"]',
								row);

							if (checkbox.is(':checked')) {
								// Push id into selectedRow
								var tr = kendoGrid.select()
									.closest("tr");
								var dataItem = kendoGrid
									.dataItem(item);
								selectedRow.push(dataItem);
							}
						});
//								var data = [];
//								if (obj != null) {
//									data.push(obj);
//								} else if (selectedRow.length > 0
//										&& obj == null) {
//									data = selectedRow
//								} else {
//									data = kendoGrid.dataSource.data();
//								}
					var title = [];
					var field = [];
					for (var i = 0; i < kendoGrid.columns.length; i++) {
						var check = true;
						for (var j = 0; j < listRemove.length; j++) {
							if (kendoGrid.columns[i].title == listRemove[j].title) {
								check = false;
							}
						}
						if (check) {

							title.push(kendoGrid.columns[i].title);


							field.push(kendoGrid.columns[i])
						}
					}

					exportExcel(title, buildDataExport(data, field,
						listConvert), FileName);
				}
				function buildDataExport(data, filed, listConvert) {
					// Row content
					var rData = [];
					$
						.each(
							data,
							function(index, value) {
								var objJson = JSON
									.parse(JSON
										.stringify(value));
								var item = {
									cells : []
								};
								for (var i = 0; i < filed.length; i++) {
									var objadd = {};
									var check= false;
									var textAlign=(filed[i].attributes.style.split(":")[1]).replace(";","");
									for (var j = 0; j < listConvert.length; j++) {

										if (filed[i].field == listConvert[j].field) {
											objadd.value = listConvert[j].data[objJson[filed[i].field]];
											objadd.borderBottom= { color: "#000000", size: 1 };
											objadd.borderTop= { color: "#000000", size: 1 };
											objadd.borderRight= { color: "#000000", size: 1 };
											objadd.borderLeft= { color: "#000000", size: 1 };
											objadd.textAlign= textAlign;
											objadd.fontFamily="Times New Roman";
											check=true;
										}
									}
									if(check){

									} else if (filed[i].field == "stt") {
										objadd.value = index + 1;
										objadd.borderBottom= { color: "#000000", size: 1 };
										objadd.borderTop= { color: "#000000", size: 1 };
										objadd.borderRight= { color: "#000000", size: 1 };
										objadd.borderLeft= { color: "#000000", size: 1 };
										objadd.textAlign= textAlign;
										objadd.fontFamily="Times New Roman";
									} else {
										objadd.value = objJson[filed[i].field];
										objadd.borderBottom= { color: "#000000", size: 1 };
										objadd.borderTop= { color: "#000000", size: 1 };
										objadd.borderRight= { color: "#000000", size: 1 };
										objadd.borderLeft= { color: "#000000", size: 1 };
										objadd.textAlign= textAlign;
										objadd.fontFamily="Times New Roman";
									}
									item.cells.push(objadd);
								}

								rData.push(item);
							});
					return rData;
				}
				function exportReport(obj) {
					var deferred = $q.defer();
					$http({
						url: RestEndpoint.BASE_SERVICE_URL + "reportServiceRest" + "/exportPdf",
						dataType: 'json',
						method: 'POST',
						data: obj,
						enctype: 'multipart/form-data',
						processData: false,
						contentType: false,
						cache: false,
						headers: {
							"Content-Type": "application/json"
						},
						responseType: 'arraybuffer',//THIS IS IMPORTANT
					})
						.then(function success(response){
							if (response.headers('error')) {
								var obj1 = {};
								obj1.error = response.headers('error');
								deferred.resolve(obj1);
							} else {
								deferred.resolve(response.data);
							}
						},function error(response){
							deferred.reject(response.data);
						});

					// 	.success(function (data, status, headers, config) {
					// 	if (headers('error')) {
					// 		var obj1 = {};
					// 		obj1.error = headers('error');
					// 		deferred.resolve(obj1);
					// 	} else {
					// 		deferred.resolve(data);
					// 	}
					// }).error(function (data) {
					// 	deferred.reject(data);
					// });
					return deferred.promise;
				}
//---------- Trung end
			}]);
