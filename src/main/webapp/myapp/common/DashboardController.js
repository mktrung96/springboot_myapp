(function() {
    'use strict';
    var controllerId = 'DashboardController';
    angular.module('SalaryApp').filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
        
       
    });

angular.module('SalaryApp').controller(controllerId, function($rootScope, $scope, $http, $timeout,$kWindow, CommonService, Constant,Restangular) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    var vm=this;
    vm.obj={};
	vm.obj.reportGroup="DASH_BROAD";
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    //VietNT_20190118_start
//    window.confirm = function (message, doYes, caption) {
    console.log(" window.confirm = function (message, doYes, caption, doCancel, width='300', height='150')");
    window.confirm = function (message, doYes, caption, doCancel, width='300', height='150') {
    //VietNT_end
        caption = CommonService.translate(caption) || CommonService.translate('Xác nhận')
        var windowTemplate = kendo.template($("#windowConfirmTemplate").html());
//        $scope.message= message ;
        var data = { message: message };
        var modalInstance = $kWindow.open({
            options: {
                modal: true,
                title: caption,
                visible: false,
                width: width,
                height: height,
                actions: ["close"],
                open: function () {
                    this.wrapper.children('.k-window-content').addClass("fix-footer");
                    
                    $("#confirmPopup_btnCancel" ).click(function() {
                    	modalInstance.dismiss();
                    	if (doCancel && (typeof doCancel === "function")) {
                    		doCancel();
                    	}
                	});
                    
                    $("#confirmPopup_btnConfirm" ).click(function() {
                    	modalInstance.dismiss();
                    	if (doYes && (typeof doYes === "function")) {
                            doYes();
                        }
                	});
                }
            },
           /* template: '<div class="modal-body">'+
    		'<label class="control-label" traslate>{{$scope.message}}</label> </div>  '	+	
    		'<div class="modal-footer">'+
    			'<button id="confirmPopup_btnCancel" type="button" class="btn green btn-outline padding-search" translate>Bỏ qua</button>'+
    			'<button id="confirmPopup_btnConfirm" type="button" class="btn green border-button-tree padding-search-right" translate>Xác nhận</button>'+
    		'</div>'*/
            template: windowTemplate(data)
        });
    };
    
    window.prompt = function (message, doYes, caption, require, requireMsg) {
        caption = caption || 'Nh?c nh?'
        var windowTemplate = kendo.template($("#windowPromptTemplate").html());
        var data = { message: message };
        var modalInstance = $kWindow.open({
            options: {
                modal: true,
                title: caption,
                visible: false,
                width: '350',
                height: '200',
                actions: ["close"],
                open: function () {
                    this.wrapper.children('.k-window-content').addClass("fix-footer");
                    
                    $("#promptPopup_btnCancel" ).click(function() {
                    	modalInstance.dismiss();
                	});
                    
                    $("#promptPopup_btnConfirm" ).click(function() {
                    	var value = $('#promptPopup_txtReason').val();
                    	if (require && (value.trim() == undefined || value.trim() == '')) {
                    		toastr.warning(requireMsg);
                    	} else {
                    		modalInstance.dismiss();
                        	if (doYes && (typeof doYes === "function")) {
                                doYes(value);
                            }
                    	}
                	});
                }
            },
            template: windowTemplate(data)
        });
    };
    
    
    $(document).ready(function() {
  
	 $("#week").addClass("active");
	 $("#amount").addClass("active");
  
    kendo.ui.Tooltip.fn._show = function (show) {
        return function (target) {
            var e = {
                sender: this,
                target: target,
                preventDefault: function () {
                    this.isDefaultPrevented = true;
                }
            };

            if (typeof this.options.beforeShow === "function") {
                this.options.beforeShow.call(this, e);
            }
            if (!e.isDefaultPrevented) {
                show.call(this, target);
            }
        };
    }(kendo.ui.Tooltip.fn._show);
    
    var tooltip = $("#MainTabController").kendoTooltip({
        filter: "button",
        width: 120,
        position: "bottom",
        beforeShow: function (e) {
        	if ($(e.target).data("title") === undefined) {
                e.preventDefault();
            }
        },
        show: function (e) {
        	var position = e.sender.options.position;
            if (position == "bottom") {
            	e.sender.popup.element.css("margin-top", "10px");
            } else if(position == "top") {
            	e.sender.popup.element.css("margin-bottom", "10px");
            }
        }
    }).data("kendoTooltip");
//    Dashboard.init();

 $scope.$watch(function() {
	        
	         return $rootScope.casUser;
	     },  function(casUser){
	    
	    	 if(casUser==null){
	    		 return ;
	    	 }
			  initChar(); 
			});
   
    vm.getCharOneAmount=getCharOneAmount;
    vm.getCharOneTimes=getCharOneTimes;
    vm.getCharTwoWeek=getCharTwoWeek;
    vm.getCharTwoMonth=getCharTwoMonth;
    function initChar(){
    	Constant;
//    	getCharOneAmount();
//    	getCharTwoWeek();
//    	getCharThree();
//    	getCharFour();
    	
    }
    //Biểu đồ KPI
	vm.kpiCheck=false;
function getCharOneTimes(){
		$("#time").addClass("active");
		$("#amount").removeClass("active");
    	CommonService.getCharOneTimes(vm.obj).then(
				function(data) {
					  if(document.getElementById("myChartLine")){
					    	vm.kpiCheck=true;
					        new Chart(document.getElementById("myChartLine"), {
					        	  type: 'line',
					        	  data: {
					        		  labels: data.listStockCode,
					        	    datasets: [{ 
					        	        data: data.listKPIAmount,
					        	        label: CommonService.translate("Số lượng mã hàng"),
					        	        borderColor: "#00b3b5",
										borderWidth: 1,
										backgroundColor:"rgba(57,191,192,0.2)",
										
					        	      }
					        	    ]
					        	  },
					        	  options: {
					        	    title: {
					        	      display: true,
					        	    },
					    		   responsive: true,
					    		       maintainAspectRatio: false,
					    		        scales: {
					    		            yAxes: [{
					    		                ticks: {
					    		                    beginAtZero:true
					    		                }
					    		            }]
					    		   },
					        	  legend: {
					                  display: true,
					                  labels: {
					                      fontColor: 'rgb(57,191,192)'
					                  },
					                  position:'bottom'
					              }
					        	  }
					        	});
					        
					        }
					
				}, function(errResponse) {
					  if(document.getElementById("myChartLine")){
					    	
					        new Chart(document.getElementById("myChartLine"), {
					        	  type: 'line',
					        	  data: {
					        	    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999],
					        	    datasets: [{ 
					        	        data: [282,350,411,502,635,809,947,1402,3700],
					        	        label: CommonService.translate("Số lượng mã hàng"),
					        	        borderColor: "#de4747",
					        	        borderWidth: 1,
					        	        backgroundColor:"#fcecec",
					        	      }
					        	    ]
					        	  },
					        	  options: {
					        	    title: {
					        	      display: true,
					        	    },
					    		   responsive: true,
					    		       maintainAspectRatio: false,
					    		        scales: {
					    		            yAxes: [{
					    		                ticks: {
					    		                    beginAtZero:true
					    		                }
					    		            }]
					    		   },
					        	  legend: {
					                  display: true,
					                  labels: {
					                      fontColor: 'rgb(57,191,192)'
					                  },
					                  position:'bottom'
					              }
					        	  }
					        	});
					        
					        }
			});
  
    }
    function getCharOneAmount(){
	$("#amount").addClass("active");
		$("#time").removeClass("active");
    	CommonService.getCharOneAmount(vm.obj).then(
				function(data) {
					  if(document.getElementById("myChartLine")){
					    	vm.kpiCheck=false;
					        new Chart(document.getElementById("myChartLine"), {
					        	  type: 'line',
					        	  data: {
					        		  labels: data.listStockCode,
					        	    datasets: [{ 
					        	        data: data.listKPIAmount,
					        	        label: CommonService.translate("Số lượng mã hàng"),
					        	        borderColor: "#00b3b5",
										borderWidth: 1,
										backgroundColor:"rgba(57,191,192,0.2)",
					        	      }
					        	    ]
					        	  },
					        	  options: {
					        	    title: {
					        	      display: true,
					        	    },
					    		   responsive: true,
					    		       maintainAspectRatio: false,
					    		        scales: {
					    		            yAxes: [{
					    		                ticks: {
					    		                    beginAtZero:true
					    		                }
					    		            }]
					    		   },
					        	  legend: {
					                  display: true,
					                  labels: {
					                      fontColor: 'rgb(57,191,192)'
					                  },
					                  position:'bottom'
					              }
					        	  }
					        	});
					        
					        }
					
				}, function(errResponse) {
					  if(document.getElementById("myChartLine")){
					    	
					        new Chart(document.getElementById("myChartLine"), {
					        	  type: 'line',
					        	  data: {
					        	    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999],
					        	    datasets: [{ 
					        	        data: [282,350,411,502,635,809,947,1402,3700],
					        	        label: CommonService.translate("Số lượng mã hàng"),
					        	        borderColor: "#de4747",
					        	        borderWidth: 1,
					        	        backgroundColor:"#fcecec",
					        	      }
					        	    ]
					        	  },
					        	  options: {
					        	    title: {
					        	      display: true,
					        	    },
					    		   responsive: true,
					    		       maintainAspectRatio: false,
					    		        scales: {
					    		            yAxes: [{
					    		                ticks: {
					    		                    beginAtZero:true
					    		                }
					    		            }]
					    		   },
					        	  legend: {
					                  display: true,
					                  labels: {
					                      fontColor: 'rgb(255, 99, 132)'
					                  },
					                  position:'bottom'
					              }
					        	  }
					        	});
					        
					        }
			});
  
    }
    vm.exportKpi=function(){
	var obj={};
	         	obj.reportGroup="DASH_BROAD";
	         	obj.reportType="EXCEL";
				if(!vm.kpiCheck){
				obj.reportName="KPI_SoLuong";
				} else {
				obj.reportName="KPI_ThoiGian";
				}
	         	
				
	         	CommonService.exportReport(obj).then(
						function(data) {
						var binarydata= new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
				        kendo.saveAs({dataURI: binarydata, fileName: obj.reportName + '.xlsx'});
					}, function(errResponse) {
						toastr.error("Lỗi không export DOC được!");
					});
	}
    /*END Char ONE*/
    
    
    //Biểu đố giao dịch xuất/nhập kho
	vm.checkWeek=true;
    function getCharTwoWeek(){
	$("#week").addClass("active");
		$("#month").removeClass("active");
    	CommonService.getCharTwoWeek(vm.obj).then(
				function(data) { 
				vm.checkWeek=true;
					if(document.getElementById("myChart")){
				    new Chart(document.getElementById("myChart"), {
				    	  type: 'line',
				    	  data: {
				    	    labels: data.listDay,
				    	    datasets: [{ 
				    	        data: data.listImported,
				    	        label: "Nhập",
								
				    	        borderColor: "#00b3b5",
				    	        borderWidth: 1,
				    	        backgroundColor:"rgba(57,191,192,0.2)",
								
				    	      }, { 
				    	    	  data: data.listExported,
				    	        label: "Xuất",
				    	        borderColor: "#de4747",
				    	        borderWidth: 1,
				    	        backgroundColor:"rgba(252,236,236,0.6)",
								 // backgroundColor:"rgba(229,125,125,0.2)",
				    	      }
				    	    ]
				    	  },
				    	  options: {
				    	    title: {
				    	      display: true,
				    	    },
						   responsive: true,
						       maintainAspectRatio: false,
						        scales: {
						            yAxes: [{
						                ticks: {
						                    beginAtZero:true
						                }
						            }]
						   },
				    	  legend: {
				              display: true,
				              labels: {
				                  fontColor: 'rgb(255, 99, 132)'
				              },
				              position:'bottom'
				          }
				    	  }
				    	});
				    
				    }
					}, function(errResponse) {
					 if(document.getElementById("myChart")){
						    new Chart(document.getElementById("myChart"), {
						    	  type: 'line',
						    	  data: {
						    	    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999],
						    	    datasets: [{ 
						    	        data: [86,114,106,106,107,111,133,221,783],
						    	        label: "Nhập",
						    	        borderColor: "#00b3b5",
						    	        borderWidth: 1,
						    	        backgroundColor:"#cedfdf",
						    	      }, { 
						    	        data: [282,350,411,502,635,809,947,1402,3700],
						    	        label: "Xuất",
						    	        borderColor: "#de4747",
						    	        borderWidth: 1,
						    	        backgroundColor:"#fcecec",
						    	      }
						    	    ]
						    	  },
						    	  options: {
						    	    title: {
						    	      display: true,
						    	    },
								   responsive: true,
								       maintainAspectRatio: false,
								        scales: {
								            yAxes: [{
								                ticks: {
								                    beginAtZero:true
								                }
								            }]
								   },
						    	  legend: {
						              display: true,
						              labels: {
						                  fontColor: 'rgb(255, 99, 132)'
						              },
						              position:'bottom'
						          }
						    	  }
						    	});
						    
						    }			
						});
    }
    
    function getCharTwoMonth(){
	$("#month").addClass("active");
		$("#week").removeClass("active");
    	CommonService.getCharTwoMonth(vm.obj).then(
				function(data) { 
				vm.checkWeek=false;
					if(document.getElementById("myChart")){
				    new Chart(document.getElementById("myChart"), {
				    	  type: 'line',
				    	  data: {
				    	    labels: data.listDay,
				    	    datasets: [{ 
				    	        data: data.listImported,
				    	        label: "Nhập",
				    	        borderColor: "#00b3b5",
				    	        borderWidth: 1,
				    	        backgroundColor:"rgba(57,191,192,0.2)",
				    	      }, { 
				    	    	  data: data.listExported,
				    	        label: "Xuất",
				    	         borderColor: "#de4747",
				    	        borderWidth: 1,
				    	        backgroundColor:"rgba(252,236,236,0.6)",
				    	      }
				    	    ]
				    	  },
				    	  options: {
				    	    title: {
				    	      display: true,
				    	    },
						   responsive: true,
						       maintainAspectRatio: false,
						        scales: {
						            yAxes: [{
						                ticks: {
						                    beginAtZero:true
						                }
						            }]
						   },
				    	  legend: {
				              display: true,
				              labels: {
				                  fontColor: 'rgb(255, 99, 132)'
				              },
				              position:'bottom'
				          }
				    	  }
				    	});
				    
				    }
					}, function(errResponse) {
					 if(document.getElementById("myChart")){
						    new Chart(document.getElementById("myChart"), {
						    	  type: 'line',
						    	  data: {
						    	    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999],
						    	    datasets: [{ 
						    	        data: [86,114,106,106,107,111,133,221,783],
						    	        label: "Nhập",
						    	        borderColor: "#00b3b5",
						    	        borderWidth: 1,
						    	        backgroundColor:"#cedfdf",
						    	      }, { 
						    	        data: [282,350,411,502,635,809,947,1402,3700],
						    	        label: "Xuất",
						    	        borderColor: "#de4747",
						    	        borderWidth: 1,
						    	        backgroundColor:"#fcecec",
						    	      }
						    	    ]
						    	  },
						    	  options: {
						    	    title: {
						    	      display: true,
						    	    },
								   responsive: true,
								       maintainAspectRatio: false,
								        scales: {
								            yAxes: [{
								                ticks: {
								                    beginAtZero:true
								                }
								            }]
								   },
						    	  legend: {
						              display: true,
						              labels: {
						                  fontColor: 'rgb(255, 99, 132)'
						              },
						              position:'bottom'
						          }
						    	  }
						    	});
						    
						    }			});
    }
   
    /*END Char Two*/
     vm.exportCharTwo = function (){
			var obj={};
	         	obj.reportGroup="DASH_BROAD";
	         	obj.reportType="EXCEL";
				obj.reportName="DanhSachGiaoDich";
				if(!vm.checkWeek){
				var date = new Date();
				var y = date.getFullYear();
				var m = date.getMonth();
				var firstDay = new Date(y, m, 1);
				var lastDay = new Date(y, m + 1, 0);
				obj.startDate=firstDay;
				obj.endDate=lastDay;
				} 
	         	
				
	         	CommonService.exportReport(obj).then(
						function(data) {
						var binarydata= new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
				        kendo.saveAs({dataURI: binarydata, fileName: obj.reportName + '.xlsx'});
					}, function(errResponse) {
						toastr.error("Lỗi không export DOC được!");
					});
	}
	
    //Biểu đồ yêu cầu mới
    function getCharThree(){
    	CommonService.getCharThree(vm.obj).then(
				function(data) {
					if(document.getElementById("bar-chart-grouped")){
					    new Chart(document.getElementById("bar-chart-grouped"), {
					        type: 'bar',
					        data: {
					        	labels: data.listStockCode,
					          datasets: [
					            {
					              label: "Nhập",
					                backgroundColor: "#4177b8",
					              data: data.listImStock
					             
					            }, {
					              label: "Xuất",
					            
								  backgroundColor: "#bf4d4a",
					              data: data.listOutStock
					            }
					          ]
					        },
					        options: {
					          title: {
					            display: true,
					          },
					          responsive: true,
					          maintainAspectRatio: false,
					           scales: {
					               yAxes: [{
					                   ticks: {
					                       beginAtZero:true
					                   }
					               }]
					           },
					        legend: {
					            display: true,
					            labels: {
					                  fontColor: 'rgb(255, 99, 132)'
					              },
					            position:'bottom'
					        }
					        }
					    });
					    }
					
				}, function(errResponse) {
					if(document.getElementById("bar-chart-grouped")){
					    new Chart(document.getElementById("bar-chart-grouped"), {
					        type: 'bar',
					        data: {
					        	labels: ["1900", "1950", "1999", "2050"],
					          datasets: [
					            {
					              label: "Nhập",
					              backgroundColor: "#bf4d4a",
					              data: [133,221,783,2478]
					            }, {
					              label: "Xuất",
					              backgroundColor: "#4177b8",
					              data: [408,547,675,734]
					            
					            }
					          ]
					        },
					        options: {
					          title: {
					            display: true,
					          },
					          responsive: true,
					          maintainAspectRatio: false,
					           scales: {
					               yAxes: [{
					                   ticks: {
					                       beginAtZero:true
					                   }
					               }]
					           },
					        legend: {
					            display: true,
					            labels: {
					                  fontColor: 'rgb(255, 99, 132)'
					              },
					            position:'bottom'
					        }
					        }
					    });
					    }
			});
    
    };
	
	vm.exportOrder=function(){
		var obj={};
	         	obj.reportGroup="DASH_BROAD";
	         	obj.reportType="EXCEL";
	         	obj.reportName="Yeucaumoi";
	         	CommonService.exportReport(obj).then(
						function(data) {
						var binarydata= new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
				        kendo.saveAs({dataURI: binarydata, fileName: "Yeucaumoi" + '.xlsx'});
					}, function(errResponse) {
						toastr.error("Lỗi không export DOC được!");
					});
	}
    //Biểu đồ phiếu xuất nhập chưa hoàn thành
   
    function getCharFour(){
    	 if(document.getElementById("progressBarId")){
    		 var obj={};
    		 CommonService.getCharFour(obj).then(
 					function(data) {
 						vm.ImNotReal=data.imNotReal;
 						vm.ImNotSign=data.imNotSign;
 						vm.ExNotSign=data.exNotSign;
 						vm.ExNotReal=data.exNotReal;
 						vm.ExInRoad=data.exInRoad;
 						
 						vm.ImNotRealRate=data.imNotRealRate;
 						vm.ImNotSignRate=data.imNotSignRate;
 						vm.ExNotSignRate=data.exNotSignRate;
 						vm.ExNotRealRate=data.exNotRealRate;
 						vm.ExInRoadRate=data.exInRoadRate;
 						 ImNotRealRateOne();
 						ImNotRealRateTwo();
 						ImNotRealRateThree();
 						ImNotRealRateFour();
 						ImNotRealRateFive();
 					}, function(errResponse) {
 				});
    		
    	 }else{
    		 
    	 }
    };
    function ImNotRealRateOne() {
    	var widthProgress = vm.ImNotSignRate + "%";
        var css = document.getElementById("progressbarOne");
        $(css).css("width", widthProgress);
    }
    function ImNotRealRateTwo() {
    	var widthProgress = vm.ImNotRealRate + "%";
        var css = document.getElementById("progressbarTwo");
        $(css).css("width", widthProgress);
    }
    function ImNotRealRateThree() {
    	var widthProgress = vm.ExNotSignRate + "%";
        var css = document.getElementById("progressbarThree");
        $(css).css("width", widthProgress);
    }
    function ImNotRealRateFour() {
    	var widthProgress = vm.ExNotRealRate + "%";
        var css = document.getElementById("progressbarFour");
        $(css).css("width", widthProgress);
    }
    function ImNotRealRateFive() {
    	var widthProgress = vm.ExInRoadRate + "%";
        var css = document.getElementById("progressbarFive");
        $(css).css("width", widthProgress);
    }
    });
  
    vm.exportCharFour=function(){
		var obj={};
	         
	         	obj.reportType="EXCEL";
	         	obj.reportName="PhieuChuaHoanThanh";
				obj.reportGroup="DASH_BROAD";
	         	CommonService.exportReport(obj).then(
						function(data) {
						var binarydata= new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
				        kendo.saveAs({dataURI: binarydata, fileName: "PhieuChuaHoanThanh" + '.xlsx'});
					}, function(errResponse) {
						toastr.error("Lỗi không export DOC được!");
					});
	}
    
});

})();
