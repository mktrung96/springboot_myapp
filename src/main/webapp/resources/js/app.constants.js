(function () {
	'use strict';

	angular.module('SalaryApp').constant('Constant', Config());

	/* @ngInject */
	function Config() {
		var config = {};
		// config.authen = {
		// 	LOGIN_URL: "auth/kttsAuthenRsService/login",
		// 	LOGOUT_URL: "auth/kttsAuthenRsService/logout",
		// 	GET_USER_INFO: 'auth/kttsAuthenRsService/getUserInfo'
		//
		// }
		/***********************************************************************
		 **********************************************************************/
		config.BASE_SERVICE_URL = API_URL;
		config.TEMPLATE_URL = [
			{
				key: 'CATEGORY',
				title: 'Danh mục'

			},
			{
				key: 'DASH_BOARD',
				title: 'Home',
				templateUrl: 'dashboard/dashboard.html',
				lazyLoadFiles: ['myapp/common/DashboardController.js',]
			},
			{
				// key: 'AMS_STAFF_MANAGEMENT',
				title : 'Quản lý nhân viện',
				// parent : 'Quản lý danh mục',
				templateUrl : 'lora/loraAQI/loraAQI.html',
				lazyLoadFiles : [
					'lora/loraAQI/loraAQIController.js',
					'lora/loraAQI/loraAQIService.js'
				]
			}
		];

		config.getTemplateUrl = function (key) {
			for (var i in config.TEMPLATE_URL) {
				if (config.TEMPLATE_URL[i].key == key) {
					return config.TEMPLATE_URL[i];
				}
			}

			return null;
		}

		config.getUser = function () {
			return this.user;
		}



		config.setUser = function (user) {
			this.user = user;
			config.userInfo = this.user;
		}

		return config;
	}
//	angular.module('SalaryApp').constant('PopupConst', {
//
//	});


})();
