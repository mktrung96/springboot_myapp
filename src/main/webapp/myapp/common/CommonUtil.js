function exportExcel(title, data, filename, sheetname) {
	var workbook = new kendo.ooxml.Workbook({
		  sheets: [
	           {
		      // Column settings (width)
		      columns: [
		        { autoWidth: true },
		        { autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true },
				{ autoWidth: true }
		      ],
		      // Title of the sheet
		      title: sheetname,
		      // Rows of the sheet
		      rows: [
					// Content
		      ]
		    }
		  ]
		});
	
	var rows = workbook.options.sheets[0].rows;
	
	// Title
	var cellContent = [];
	$.each( title, function( index, value ){
		var item = { value: value };
		item.borderBottom= { color: "#000000", size: 1 };
		item.borderTop= { color: "#000000", size: 1 };
		item.borderRight= { color: "#000000", size: 1 };
		item.borderLeft= { color: "#000000", size: 1 };
		item.textAlign= "center";
		item.fontFamily="Times New Roman";
		item.background= "#D8E4BC";
		item.bold= true;
		cellContent.push(item);
	});
	var cellTitle = {
			cells: cellContent
	};
	rows.push(cellTitle);
	
	// Row content
	$.each( data, function( index, value){
		
		
		rows.push(value);
	});
	
	kendo.saveAs({
	    dataURI: workbook.toDataURL(),
	    fileName: filename + ".xlsx"
	});
}

// Edit by hoangvukmt
// Bo sung kha nang next den ban ghi tiep theo khi dang xem chi tiet tren grid
function nextRowBase(grid, message) {
	if (grid.select() == null || grid.select().length == 0) {
		toastr.warning(message.recordRequired);
		return;
	}
	var dataRows = grid.items();
    var rowIndex = dataRows.index(grid.select());
    var nextIndex = rowIndex + 1;
    if (nextIndex >= dataRows.length) {
    	toastr.warning(message.positionLast);
    	return;
    }
    
    var curentRow = grid.select().closest("tr");
    var nextRow = curentRow.next();
    if (nextRow.attr("class").indexOf("k-detail-row") >= 0){
    	nextRow = nextRow.next();
    }
    
    if ($(curentRow).find(".k-hierarchy-cell > a").attr("class").indexOf("k-minus") >= 0){
    	$(curentRow).find(".k-hierarchy-cell > a").click();
    	$(nextRow).find(".k-hierarchy-cell > a").click();
    }
//    grid.clearSelection();
    grid.select(nextRow);
}

//Edit by hoangvukmt
//Bo sung kha nang prev den ban ghi phia tren khi dang xem chi tiet tren grid
function previousRowBase(grid, message) {
	if (grid.select() == null || grid.select().length == 0) {
		toastr.warning(message.recordRequired);
		return;
	}
	var dataRows = grid.items();
    var rowIndex = dataRows.index(grid.select());
    var preIndex = rowIndex - 1;
    if (preIndex < 0) {
    	toastr.warning(message.positionFirst);
    	return;
    }
    
    var curentRow = grid.select().closest("tr");
    var prevRow = curentRow.prev();
    if (prevRow.attr("class").indexOf("k-detail-row") >= 0){
    	prevRow = prevRow.prev();
    }
    
    if ($(curentRow).find(".k-hierarchy-cell > a").attr("class").indexOf("k-minus") >= 0){
    	$(curentRow).find(".k-hierarchy-cell > a").click();
    	$(prevRow).find(".k-hierarchy-cell > a").click();
    }
//    grid.clearSelection();
    grid.select(prevRow);
}

function multiDeleteBase(grid, serviceInstance, toastr, message) {
	var deferred = $.Deferred();
	
	var selectedRow = [];
	
	grid.table.find("tr").each(function(idx, item) {
		var row = $(item);
		var checkbox = $('[name="gridcheckbox"]', row);
		
		if(checkbox.is(':checked')) {
			// Push id into selectedRow
			var tr = grid.select().closest("tr");
        	var dataItem = grid.dataItem(item);
        	console.log('dataItem ----');
        	console.log(dataItem.cstatementId);
        	selectedRow.push(dataItem.cstatementId);
		}
    });
	
	if (selectedRow.length == 0) {
		toastr.warning(message.recordRequired);
		return;
	}
	
	console.log(selectedRow);
	if (confirm('Xác nhận xóa')) {
		for(var i = 0; i < selectedRow.length; i++) {
			serviceInstance.deleteItem(selectedRow[i]).then(function(){
					// 
	            }, function(errResponse){
	            	toastr.error(message.deleteError);
	            }
			);
		}
		
		// Info
		toastr.success(message.deleteSuccess);
	}
	
	return deferred.promise();
}


function chkSelectAllBase(flag, grid) {
	var lockedItem = $("#" + grid._cellId.substring(0, grid._cellId.length - 12) + " > .k-grid-content-locked").find("tr");
	if (lockedItem.length === 0) {
		var rowList = grid.lockedTable == undefined ? grid.table.find("tr") : grid.lockedTable.find("tr");
		rowList.each(function(idx, item) {
			var row = $(item);
			var checkbox = $('[name="gridcheckbox"]', row);
			if(flag) {
				checkbox.prop('checked', true);
			} else {
				checkbox.prop('checked', false);
			}
			
	    });
	} else {
		lockedItem.each(function(idx, item) {
			var row = $(item);
			var checkbox = $('[name="gridcheckbox"]', row);
			if(flag) {
				checkbox.prop('checked', true);
			} else {
				checkbox.prop('checked', false);
			}
			
	    });
	}
}

function stringToDate(_date,_format,_delimiter) {
    var formatLowerCase=_format.toLowerCase();
    var formatItems=formatLowerCase.split(_delimiter);
    var dateItems=_date.split(_delimiter);
    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;
    var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
}

function stringToDate2(_date,_format,_delimiter) {
	var formatLowerCase=_format.toLowerCase();
	var formatItems=formatLowerCase.split(_delimiter);
	var dateItems=_date.split(_delimiter);
	var monthIndex=formatItems.indexOf("mm");
	var dayIndex=formatItems.indexOf("dd");
	var yearIndex=formatItems.indexOf("yyyy");
	var month=parseInt(dateItems[monthIndex]);
	month-=1;
	var day=parseInt(dateItems[dayIndex]);
	day -=1;


	var formatedDate = new Date(dateItems[yearIndex],month,day);
	return formatedDate;
}
function stringToDateKendo(_date){
	return stringToDate(_date,"dd/mm/yyyy","/");
}
function contains(list, obj) {
    var i = list.length;
    while (i--) {
       if (list[i] === obj) {
           return true;
       }
    }
    return false;
}
function trimSpace(){
var allInputs = $(":input"); 
allInputs.each(function() {
        $(this).val($.trim($(this).val()));
    });
}

function setForcus(){
var allInputs = $(":input"); 
allInputs.each(function() {
		if(!$(this).disabled && !$(this).readOnly){
		$(this).focus();
		 return false;  
		}
        
    });
}



		
function focusElement(obj){
var arr=Object.keys(obj);

document.getElementById(arr[0]).focus();
}		



		function validateDateBase(objMsg,dateFrom,dateTo,validator) {
    	    		var obj={}
    	    		 obj.errMessage = '';
					 obj.errMessage1 = '';
    	    		 var curDate = new Date();
    	            
					if(validator._errors["createFromExState"]){
						 obj.errMessage = '';
						 obj.errMessage1 = '';
						return obj;
					}
					
					if(validator._errors["createToExState"]){
						 obj.errMessage = '';
					     obj.errMessage1 = '';
						return obj;
					}
					
				
					
    	             if(kendo.parseDate(dateFrom,"dd/MM/yyyy") > curDate && kendo.parseDate(dateTo,"dd/MM/yyyy")!=null &&
					  kendo.parseDate(dateFrom,"dd/MM/yyyy") > kendo.parseDate(dateTo,"dd/MM/yyyy")){
    	    	            obj.errMessage1 = objMsg.errMessage1 +' phải nhỏ hơn bằng ngày hiện tại';
						    obj.errMessage = objMsg.errMessage+ ' phải lớn hơn bằng ngày đến';
    	    	           
    	    	            return obj;
						   
    	    	         }
						
					 if(kendo.parseDate(dateFrom,"dd/MM/yyyy") > curDate 
					 && !(kendo.parseDate(dateFrom,"dd/MM/yyyy") > kendo.parseDate(dateTo,"dd/MM/yyyy"))){
						 obj.errMessage1 = objMsg.errMessage1+' phải nhỏ hơn bằng ngày hiện tại';
						    obj.errMessage = '';
    	    	           
    	    	            return obj;
					 }
					  if(kendo.parseDate(dateFrom,"dd/MM/yyyy") > curDate ){
    	    	            obj.errMessage1 = objMsg.errMessage1+' phải nhỏ hơn bằng ngày hiện tại';
							obj.errMessage = '';
    	    	           
    	    	            return obj;
						   
    	    	      }
					 if(kendo.parseDate(dateFrom,"dd/MM/yyyy")==null || kendo.parseDate(dateTo,"dd/MM/yyyy")==null){
    	               obj.errMessage = '';
					 
    	               return obj;
    	             }
					
    	    	      if(kendo.parseDate(dateFrom,"dd/MM/yyyy") > kendo.parseDate(dateTo,"dd/MM/yyyy")){
    	               obj.errMessage1 = objMsg.errMessage1+ ' phải nhỏ hơn bằng ngày đến';
					   obj.errMessage = objMsg.errMessage+ ' phải lớn hơn bằng ngày đến';
    	              
    	               return obj;
    	             }
				
    	         }
				 
			function processSearch(comboId,flag) {
			if(!flag){
	                    var autocomplete = $('#' + comboId).data('kendoAutoComplete');
						if(!autocomplete){
						return true;
						}
					  
					  
	                    if (autocomplete.value() != "") {
	                        if (autocomplete.value().length >= 1) {
	                            autocomplete.search(autocomplete.value());
	                            if (autocomplete.dataItem(0) == undefined) {
	                                return true;
	                            }
	                        }
	                    }
	                                      
	                } 
}		
			var ChuSo=new Array(" không "," một "," hai "," ba "," bốn "," năm "," sáu "," bảy "," tám "," chín ");
			var Tien=new Array( "", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

			//1. Hàm đọc số có ba chữ số;
			function DocSo3ChuSo(baso)
			{
			    var tram;
			    var chuc;
			    var donvi;
			    var KetQua="";
			    tram=parseInt(baso/100);
			    chuc=parseInt((baso%100)/10);
			    donvi=baso%10;
			    if(tram==0 && chuc==0 && donvi==0) return "";
			    if(tram!=0)
			    {
			        KetQua += ChuSo[tram] + " trăm ";
			        if ((chuc == 0) && (donvi != 0)) KetQua += " linh ";
			    }
			    if ((chuc != 0) && (chuc != 1))
			    {
			            KetQua += ChuSo[chuc] + " mươi";
			            if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + " linh ";
			    }
			    if (chuc == 1) KetQua += " mười ";
			    switch (donvi)
			    {
			        case 1:
			            if ((chuc != 0) && (chuc != 1))
			            {
			                KetQua += " mốt ";
			            }
			            else
			            {
			                KetQua += ChuSo[donvi];
			            }
			            break;
			        case 5:
			            if (chuc == 0)
			            {
			                KetQua += ChuSo[donvi];
			            }
			            else
			            {
			                KetQua += " lăm ";
			            }
			            break;
			        default:
			            if (donvi != 0)
			            {
			                KetQua += ChuSo[donvi];
			            }
			            break;
			        }
			    return KetQua;
			}

			//2. Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)

			function DocTienBangChu(SoTien)
			{
			    var lan=0;
			    var i=0;
			    var so=0;
			    var KetQua="";
			    var tmp="";
			    var ViTri = new Array();
			    if(SoTien<0) return "Số tiền âm !";
			    if(SoTien==0) return "Không đồng !";
			    if(SoTien>0)
			    {
			        so=SoTien;
			    }
			    else
			    {
			        so = -SoTien;
			    }
			    if (SoTien > 8999999999999999)
			    {
			        //SoTien = 0;
			        return "Số quá lớn!";
			    }
			    ViTri[5] = Math.floor(so / 1000000000000000);
			    if(isNaN(ViTri[5]))
			        ViTri[5] = "0";
			    so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
			    ViTri[4] = Math.floor(so / 1000000000000);
			     if(isNaN(ViTri[4]))
			        ViTri[4] = "0";
			    so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
			    ViTri[3] = Math.floor(so / 1000000000);
			     if(isNaN(ViTri[3]))
			        ViTri[3] = "0";
			    so = so - parseFloat(ViTri[3].toString()) * 1000000000;
			    ViTri[2] = parseInt(so / 1000000);
			     if(isNaN(ViTri[2]))
			        ViTri[2] = "0";
			    ViTri[1] = parseInt((so % 1000000) / 1000);
			     if(isNaN(ViTri[1]))
			        ViTri[1] = "0";
			    ViTri[0] = parseInt(so % 1000);
			  if(isNaN(ViTri[0]))
			        ViTri[0] = "0";
			    if (ViTri[5] > 0)
			    {
			        lan = 5;
			    }
			    else if (ViTri[4] > 0)
			    {
			        lan = 4;
			    }
			    else if (ViTri[3] > 0)
			    {
			        lan = 3;
			    }
			    else if (ViTri[2] > 0)
			    {
			        lan = 2;
			    }
			    else if (ViTri[1] > 0)
			    {
			        lan = 1;
			    }
			    else
			    {
			        lan = 0;
			    }
			    for (i = lan; i >= 0; i--)
			    {
			       tmp = DocSo3ChuSo(ViTri[i]);
			       KetQua += tmp;
			       if (ViTri[i] > 0) KetQua += Tien[i];
			       if ((i > 0) && (tmp.length > 0)) KetQua += ' ';//&& (!string.IsNullOrEmpty(tmp))
			    }
			   if (KetQua.substring(KetQua.length - 1) == ',')
			   {
			        KetQua = KetQua.substring(0, KetQua.length - 1);
			   }
			   if(SoTien!=null){
				   KetQua = KetQua.substring(1,2).toUpperCase()+ KetQua.substring(2) +" đồng";
			   }else{
				   KetQua = KetQua.substring(1,2).toUpperCase()+ KetQua.substring(2);
			   }
			   return KetQua;//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
			}	
			// getSession.
		function sessionId(){
			return kendo.toString((new Date()).getTime());
		}