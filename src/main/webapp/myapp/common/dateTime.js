angular.module('SalaryApp')
	.directive(
		'dateTime',
		function ($rootScope, RestEndpoint, CommonService, $http) {

			return {
				restrict: 'AE',
				scope: {
					ngModel: '=',
					caller: '=',
					id: "@",
					errorDate: '=',
					rule: '=',
				},

				link: function ($scope, element, attrs, ctrl) {

					var transDate = $("#" + attrs.id);
					transDate.kendoMaskedTextBox({
						mask: "00/00/0000"
					});

					transDate.kendoDatePicker({
						format: "dd/MM/yyyy"
					});

					transDate.closest(".k-datepicker").add(transDate)
						.removeClass("k-textbox");


					//							 element.bind('blur', function(e) {
					//							  if($scope.rule._errors[attrs.name]!=null || $scope.rule._errors[attrs.name] != undefined){
					//									  $("#"+attrs.id).focus();
					//								  }
					//							 });

					/*element.bind('change', function(e) {
					// if($scope.rule._errors[attrs.name]){
							// $("#"+attrs.id).focus();
						// }
					});*/



				}
			};
		});
