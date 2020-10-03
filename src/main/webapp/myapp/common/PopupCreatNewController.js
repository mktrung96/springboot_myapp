/* Modal Controller */
SalaryApp.controller('PopupCreateNewCtrl', [
	'$scope',
	'data',
	'caller',
	'modalInstance1',
	'windowId',
	'isCreateNew',
	'CommonService',
	// 'PopupConst',
	'RestEndpoint',
	// '$localStorage',
	'$rootScope',
	'kendoConfig',
	function ($scope, data, caller, modalInstance1, windowId, isCreateNew, CommonService, RestEndpoint, $rootScope,kendoConfig) {

		$rootScope.flag = false;
		$scope.data = data;
		$scope.modalInstance = modalInstance1;
		$scope.windowId = windowId;
		$scope.caller = caller;
		$scope.cancel = cancel;
		$scope.save = save;
		$scope.remove = remove;
		$scope.isCreateNew = isCreateNew;
		$scope.saveConfig = saveConfig;
		$scope.validatorOptions = kendoConfig.get('validatorOptions');

		function cancel() {
			CommonService.dismissPopup();
		}

		$(document).on("click", ".k-overlay", function () {
			setTimeout(function () {
				if ($(document).find(".k-window .popup1").is(":visible")) {
					if (!($(document).find(".k-window .popup1").is(":hover")) && $(document).find("div.k-overlay").is(":hover") && !($(document).find("div.popup2").is(":visible"))) {
						CommonService.dismissPopup();
					}
				} else {
					CommonService.dismissPopup();
				}
			}, 15);
		});

		$scope.focusOut = function () {
			if ($(document).find("button.saveQLK").is(':hover')) {
				setTimeout(function () {
					if (!$scope.validator.validate()) {
						focusElement($scope.validator._errors);
						var typeAdds = document.getElementsByName("typeAdd");
						var applyAdds = document.getElementsByName("applyAdd");
						var ignoreAdds = document.getElementsByName("ignoreAdd");
						if (typeAdds.length) {
							if (typeAdds[0].checked == false && typeAdds[1].checked == false) {
								var msg = '<br /><br /><span >Loại thuế chưa được chọn</span><br /><br />';
								document.getElementById('msg').innerHTML = msg;
							}
						}
						if (applyAdds.length) {
							if (ignoreAdds[0].checked == false && ignoreAdds[1].checked == false) {
								var msg = '<br /><br /><span >Miễn thuế chưa được chọn</span><br /><br />';
								document.getElementById('msg1').innerHTML = msg;
							}
						}
						if (ignoreAdds.length) {
							if (applyAdds[0].checked == false && applyAdds[1].checked == false) {
								var msg = '<br /><br /><span >Phân bổ chưa được chọn</span><br /><br />';
								document.getElementById('msg2').innerHTML = msg;
							}
						}
					}
				}, 20);
			}
		}

		function save() {
			if ($scope.validator.validate()) {
				caller.save($scope.data, $scope.isCreateNew);
			} else {
				focusElement($scope.validator._errors)
				return;
			}
		}

		function saveConfig() {
			if ($scope.validator.validate()) {
				caller.saveConfig();
			}
		}

		function remove() {
			if ($scope.validator.validate()) {
				caller.remove($scope.data);
			}
			else {
				$("#cancelReasonCode").data("kendoDropDownList").focus();
				return;
			}
		}
		function focusElement(obj){
			var arr=Object.keys(obj);

			document.getElementById(arr[0]).focus();
		}
	}]);
