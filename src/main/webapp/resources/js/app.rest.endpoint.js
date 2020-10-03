/* global toastr:false, moment:false */
(function() {
	'use strict';

	angular.module('SalaryApp').constant('RestEndpoint', RestEndpoint());

	/* @ngInject */
	function RestEndpoint() {
		var endpoints = {
			// we only need this - link from mainvps.js
			BASE_SERVICE_URL : API_URL
		};

		return endpoints;
	}
})();
