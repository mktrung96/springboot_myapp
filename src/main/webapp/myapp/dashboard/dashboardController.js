// angular.module('MetronicApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout, $kWindow) {
//     $scope.$on('$viewContentLoaded', function() {
//         // initialize core components
//         App.initAjax();
//     });
//
//     // set sidebar closed and body solid layout mode
//     $rootScope.settings.layout.pageContentWhite = true;
//     $rootScope.settings.layout.pageBodySolid = false;
//     $rootScope.settings.layout.pageSidebarClosed = false;
//
//     window.confirm = function (message, doYes, caption) {
//         caption = caption || 'Xác nhận'
//         var windowTemplate = kendo.template($("#windowConfirmTemplate").html());
//         var data = { message: message };
//         var modalInstance = $kWindow.open({
//             options: {
//                 modal: true,
//                 title: caption,
//                 visible: false,
//                 width: '300',
//                 height: '150',
//                 actions: ["close"],
//                 open: function () {
//                     this.wrapper.children('.k-window-content').addClass("fix-footer");
//
//                     $("#confirmPopup_btnCancel" ).click(function() {
//                     	modalInstance.dismiss();
//                 	});
//
//                     $("#confirmPopup_btnConfirm" ).click(function() {
//                     	modalInstance.dismiss();
//                     	if (doYes && (typeof doYes === "function")) {
//                             doYes();
//                         }
//                 	});
//                 }
//             },
//             template: windowTemplate(data)
//         });
//     };
//
//     window.prompt = function (message, doYes, caption, require, requireMsg) {
//         caption = caption || 'Nh?c nh?'
//         var windowTemplate = kendo.template($("#windowPromptTemplate").html());
//         var data = { message: message };
//         var modalInstance = $kWindow.open({
//             options: {
//                 modal: true,
//                 title: caption,
//                 visible: false,
//                 width: '350',
//                 height: '200',
//                 actions: ["close"],
//                 open: function () {
//                     this.wrapper.children('.k-window-content').addClass("fix-footer");
//
//                     $("#promptPopup_btnCancel" ).click(function() {
//                     	modalInstance.dismiss();
//                 	});
//
//                     $("#promptPopup_btnConfirm" ).click(function() {
//                     	var value = $('#promptPopup_txtReason').val();
//                     	if (require && (value.trim() == undefined || value.trim() == '')) {
//                     		toastr.warning(requireMsg);
//                     	} else {
//                     		modalInstance.dismiss();
//                         	if (doYes && (typeof doYes === "function")) {
//                                 doYes(value);
//                             }
//                     	}
//                 	});
//                 }
//             },
//             template: windowTemplate(data)
//         });
//     };
//
//     kendo.ui.Tooltip.fn._show = function (show) {
//         return function (target) {
//             var e = {
//                 sender: this,
//                 target: target,
//                 preventDefault: function () {
//                     this.isDefaultPrevented = true;
//                 }
//             };
//
//             if (typeof this.options.beforeShow === "function") {
//                 this.options.beforeShow.call(this, e);
//             }
//             if (!e.isDefaultPrevented) {
//                 show.call(this, target);
//             }
//         };
//     }(kendo.ui.Tooltip.fn._show);
//
//     var tooltip = $("#MainTabController").kendoTooltip({
//         filter: "button",
//         width: 120,
//         position: "bottom",
//         beforeShow: function (e) {
//         	if ($(e.target).data("title") === undefined) {
//                 e.preventDefault();
//             }
//         },
//         show: function (e) {
//         	var position = e.sender.options.position;
//             if (position == "bottom") {
//             	e.sender.popup.element.css("margin-top", "10px");
//             } else if(position == "top") {
//             	e.sender.popup.element.css("margin-bottom", "10px");
//             }
//         }
//     }).data("kendoTooltip");
//     Dashboard.init();
//
//     new Chart(document.getElementById("myChart"), {
//     	  type: 'line',
//     	  data: {
//     	    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
//     	    datasets: [{
//     	        data: [86,114,106,106,107,111,133,221,783,2478],
//     	        label: "Africa",
//     	        borderColor: "#bf4d4a",
//     	        fill: false
//     	      }, {
//     	        data: [282,350,411,502,635,809,947,1402,3700,5267],
//     	        label: "Asia",
//     	        borderColor: "#4177b8",
//     	        fill: false
//     	      }
//     	    ]
//     	  },
//     	  options: {
//     	    title: {
//     	      display: true,
//     	      text: 'World population per region (in millions)'
//     	    },
// 		   responsive: true,
// 		       maintainAspectRatio: false,
// 		        scales: {
// 		            yAxes: [{
// 		                ticks: {
// 		                    beginAtZero:true
// 		                }
// 		            }]
// 		   },
//     	  legend: {
//               display: true,
//               labels: {
//                   fontColor: 'rgb(255, 99, 132)'
//               },
//               position:'bottom'
//           }
//     	  }
//     	});
//
//     new Chart(document.getElementById("bar-chart-grouped"), {
//         type: 'bar',
//         data: {
//           labels: ["1900", "1950", "1999", "2050"],
//           datasets: [
//             {
//               label: "Africa",
//               backgroundColor: "#bf4d4a",
//               data: [133,221,783,2478]
//             }, {
//               label: "Europe",
//               backgroundColor: "#4177b8",
//               data: [408,547,675,734]
//             }
//           ]
//         },
//         options: {
//           title: {
//             display: true,
//             text: 'Population growth (millions)'
//           },
//           responsive: true,
//           maintainAspectRatio: false,
//            scales: {
//                yAxes: [{
//                    ticks: {
//                        beginAtZero:true
//                    }
//                }]
//            },
//         legend: {
//             display: true,
//             labels: {
//                 fontColor: '#000'
//             },
//             position:'bottom'
//         }
//         }
//     });
//     new Chart(document.getElementById("bar-chart-kpi"), {
//         type: 'bar',
//         data: {
//           labels: ["1900", "1950", "1999", "2050"],
//           datasets: [
//             {
//               label: "Africa",
//               backgroundColor: "#3e95cd",
//               data: [133,221,783,2478]
//             }
//           ]
//         },
//         options: {
//           title: {
//             display: true,
//             text: 'Population growth (millions)'
//           },
//           responsive: true,
//           maintainAspectRatio: false,
//            scales: {
//                yAxes: [{
//                    ticks: {
//                        beginAtZero:true
//                    }
//                }]
//            },
//         legend: {
//             display: true,
//             labels: {
//                 fontColor: 'rgb(255, 99, 132)'
//             },
//             position:'bottom'
//         }
//         }
//     });
//
//     var ctx = document.getElementById("chartCircle");
//     var chartCircle = new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             label: ["Red"],
//             datasets: [{
//                 label: '# of Votes',
//                 data: [12, 19],
//                 backgroundColor: [
//                     '#f75a5a',
//                     '#e8e8e8'
//
//                 ],
//                 borderColor: [
//                     '#f75a5a',
//                     '#e8e8e8'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             rotation: 0.8 * Math.PI,
//             circumference: 1.4 * Math.PI,
//             cutoutPercentage:90,
//             tooltips: {
//                 enabled:false
//             },
//             legend: {
//                 position :'bottom'
//              }
//         }
//     });
//
//     var ctxTwo = document.getElementById("chartCircleTwo");
//     var chartCircleTwo = new Chart(ctxTwo, {
//         type: 'doughnut',
//         data: {
//             label: ["Red"],
//             datasets: [{
//                 label: '# of Votes',
//                 data: [12, 19],
//                 backgroundColor: [
//                     '#44cce1',
//                     '#e8e8e8'
//
//                 ],
//                 borderColor: [
// 					'#44cce1',
// 					'#e8e8e8'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             rotation: 0.8 * Math.PI,
//             circumference: 1.4 * Math.PI,
//             cutoutPercentage:90,
//             tooltips: {
//                 enabled:false
//             },
//             legend: {
//                 position :'bottom'
//              }
//         }
//     });
//     var ctxThree = document.getElementById("chartCircleThree");
//     var chartCircleThree = new Chart(ctxThree, {
//         type: 'doughnut',
//         data: {
//             label: ["Red"],
//             datasets: [{
//                 label: '# of Votes',
//                 data: [12, 19],
//                 backgroundColor: [
// 					'#52d568',
// 					'#e8e8e8'
//
//                 ],
//                 borderColor: [
// 					'#52d568',
// 					'#e8e8e8'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             rotation: 0.8 * Math.PI,
//             circumference: 1.4 * Math.PI,
//             cutoutPercentage:90,
//             tooltips: {
//                 enabled:false
//             },
//             legend: {
//                 position :'bottom'
//              }
//         }
//     });
//     var ctxFour = document.getElementById("chartCircleFour");
//     var chartCircleFour = new Chart(ctxFour, {
//         type: 'doughnut',
//         data: {
//             label: ["Red"],
//             datasets: [{
//                 label: '# of Votes',
//                 data: [12, 19],
//                 backgroundColor: [
// 					'#cb7836',
// 					'#e8e8e8'
//
//                 ],
//                 borderColor: [
// 					'#cb7836',
// 					'#e8e8e8'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             rotation: 0.8 * Math.PI,
//             circumference: 1.4 * Math.PI,
//             cutoutPercentage:90,
//             tooltips: {
//                 enabled:false
//             },
//             legend: {
//                 position :'bottom'
//              }
//         }
//     });
//     var ctxFive = document.getElementById("chartCircleFive");
//     var chartCircleFive = new Chart(ctxFive, {
//         type: 'doughnut',
//         data: {
//             label: ["Red"],
//             datasets: [{
//                 label: '# of Votes',
//                 data: [12, 19],
//                 backgroundColor: [
//                   '#44cce1',
//                   '#e8e8e8'
//
//                 ],
//                 borderColor: [
//                   '#44cce1',
//                   '#e8e8e8'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             rotation: 0.8 * Math.PI,
//             circumference: 1.4 * Math.PI,
//             cutoutPercentage:90,
//             tooltips: {
//                 enabled:false
//             },
//             legend: {
//                 position :'bottom'
//              }
//         }
//     });
// });


function dashboardController($scope, $http,$timeout, $rootScope,Constant, $kWindow) {
    window.confirm = function (message, doYes, caption) {
        caption = caption || 'Xác nhận'
        var windowTemplate = kendo.template($("#windowConfirmTemplate").html());
        var data = { message: message };
        var modalInstance = $kWindow.open({
            options: {
                modal: true,
                title: caption,
                visible: false,
                width: '300',
                height: '150',
                actions: ["close"],
                open: function () {
                    this.wrapper.children('.k-window-content').addClass("fix-footer");

                    $("#confirmPopup_btnCancel" ).click(function() {
                        modalInstance.dismiss();
                    });

                    $("#confirmPopup_btnConfirm" ).click(function() {
                        modalInstance.dismiss();
                        if (doYes && (typeof doYes === "function")) {
                            doYes();
                        }
                    });
                }
            },
            template: windowTemplate(data)
        });
    };
}
