/***
 GLobal Directives
 ***/
SalaryApp.directive('onChangeFile', ['$rootScope', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.onChangeFile);
            element.bind('change', onChangeFunc);
        }
    };
}]);
// Route State Load Spinner(used on page or content load)
SalaryApp.directive('ngSpinnerBar', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                //element.addClass('hide'); // hide spinner bar by default
                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function () {
                    //HANHLS1 -su dung de bo viec load
                    if ($rootScope.authenticatedUser != null) {
                        element.removeClass('hide'); // show spinner bar
                    }
                });
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function () {
                    element.addClass('hide'); // hide spinner bar
                    //if($rootScope.authenticatedUser!=null){// giữ nguyên button load nếu chưa đăng nhập                		
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    //}
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });
                // handle errors
                $rootScope.$on('$stateNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                });
                // handle errors
                $rootScope.$on('$stateChangeError', function () {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])
// Handle global LINK click
SalaryApp.directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});
//ng-enter
SalaryApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});
// Handle Dropdown Hover Plugin Integration
SalaryApp.directive('dropdownMenuHover', function () {
    return {
        link: function (scope, elem) {
            elem.dropdownHover();
        }
    };
});
SalaryApp.directive('format', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        scope: {
            ngModel: "@"
        },
        link: function ($scope, elem, attrs, ctrl) {
            var symbol = "";
            var fractionSize = 0;
            if (!ctrl) return;
            ctrl.$formatters.unshift(function (a) {
                if (attrs.symbol) {
                    symbol = attrs.symbol;
                }
                if (attrs.fractionSize) {
                    fractionSize = attrs.fractionSize;
                }
                return $filter(attrs.format)(ctrl.$modelValue, symbol, fractionSize);
            });
            elem.bind('blur', function (event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber, symbol, fractionSize));
            });
        }
    };
}]);
SalaryApp.directive('vtCurrency', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        restrict: 'AE',
        link: function ($scope, elem, attrs, ctrl) {
            var symbol = "";
            var fractionSize = 0;
            if (!ctrl) return;
            ctrl.$formatters.unshift(function (a) {
                if (attrs.symbol) {
                    symbol = attrs.symbol;
                }
                if (attrs.fractionSize) {
                    fractionSize = attrs.fractionSize;
                }
                if (ctrl.$modelValue == null) {
                    return "";
                }
                return $filter('currency')(ctrl.$modelValue, '', fractionSize) + symbol;
            });

            var thouSep = ",";  // your separator for thousands
            var deciSep = ".";  // your separator for decimals
            var fractionSize = 3; // how many numbers after the comma

            var thouReg = new RegExp(thouSep, "g");
            var deciReg = new RegExp(deciSep, "g");

            function spaceCaretPos(val, cPos) {
                /// get the right caret position without the spaces
                if (cPos > 0 && val.substring((cPos - 1), cPos) == thouSep)
                    cPos = cPos - 1;
                if (val.substring(0, cPos).indexOf(thouSep) >= 0) {
                    cPos = cPos - val.substring(0, cPos).match(thouReg).length;
                }
                return cPos;
            }

            function spaceFormat(val, pos) {
                /// add spaces for thousands
                if (val.indexOf(deciSep) >= 0) {
                    var comPos = val.indexOf(deciSep);
                    var int = val.substring(0, comPos);
                    var dec = val.substring(comPos);
                } else {
                    var int = val;
                    var dec = "";
                }
                var ret = [val, pos];

                if (int.length > 3) {
                    var newInt = "";
                    var spaceIndex = int.length;
                    while (spaceIndex > 3) {
                        spaceIndex = spaceIndex - 3;
                        newInt = thouSep + int.substring(spaceIndex, spaceIndex + 3) + newInt;
                        if (pos > spaceIndex) pos++;
                    }
                    ret = [int.substring(0, spaceIndex) + newInt + dec, pos];
                }
                return ret;
            }

            elem.bind('keydown', function (e) {

                /*Version 1 - change
                 var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                 if (plainNumber) {
                 elem.val($filter('currency')(plainNumber,symbol,fractionSize));
                 }*/

                /* Version 2.1 - keyup
                 function Comma(nStr) {
                 nStr = nStr.replace(/,/g, '');
                 nStr += '';
                 var x = nStr.split('.');
                 var x1 = x[0];
                 var x2 = x.length > 1 ? '.' + x[1] : '';
                 var rgx = /(\d+)(\d{3})/;
                 while (rgx.test(x1))
                 x1 = x1.replace(rgx, '$1' + ',' + '$2');
                 return x1 + x2;
                 }

                 var currentPos = this.selectionStart;
                 var oldVal = elem.val();
                 var newVal;
                 var plainNumber = oldVal.replace(/[^\d|\-+|\.+]/g, '');
                 if (plainNumber) {
                 if (event.keyCode != 8 && event.keyCode != 46) {
                 elem.val(Comma(plainNumber));
                 newVal = elem.val();
                 if (checkKey(event)) {
                 if (oldVal.length == newVal.length - 1) {
                 elem[0].setSelectionRange(currentPos + 1, currentPos + 1);
                 } else if (oldVal.length - 1 == newVal.length) {
                 elem[0].setSelectionRange(currentPos - 1, currentPos - 1);
                 } else {
                 elem[0].setSelectionRange(currentPos, currentPos);
                 }
                 }
                 }
                 }
                 */

                /*Version 3 - keydown*/
                if (this.selectionStart || this.selectionStart == 0) {
                    var key = e.which;
                    var prevDefault = true;
                    if ((e.ctrlKey && (key == 65 || key == 67 || key == 86 || key == 88 || key == 89 || key == 90)) ||
                        (e.shiftKey && key == 9)) // You don't want to disable your shortcuts!
                        prevDefault = false;

                    if ((key < 37 || key > 40) && key != 8 && key != 9 && key != 46 && prevDefault) {
                        e.preventDefault();

                        if (!e.altKey && !e.shiftKey && !e.ctrlKey) {
                            var value = elem.val();
                            if ((key > 95 && key < 106) || (key > 47 && key < 58) ||
                                (fractionSize > 0 && (key == 110 || key == 188 || key == 190))) {
                                var keys = { // reformat the keyCode
                                    48: 0, 49: 1, 50: 2, 51: 3, 52: 4, 53: 5, 54: 6, 55: 7, 56: 8, 57: 9,
                                    96: 0, 97: 1, 98: 2, 99: 3, 100: 4, 101: 5, 102: 6, 103: 7, 104: 8, 105: 9,
                                    110: deciSep, 188: deciSep, 190: deciSep
                                };

                                var caretPos = this.selectionStart;
                                var caretEnd = this.selectionEnd;

                                if (caretPos != caretEnd) // remove selected text
                                    value = value.substring(0, caretPos) + value.substring(caretEnd);

                                caretPos = spaceCaretPos(value, caretPos);

                                value = value.replace(thouReg, '');

                                var before = value.substring(0, caretPos);
                                var after = value.substring(caretPos);
                                var newPos = caretPos + 1;
                                var newValue;

                                if (keys[key] == deciSep && value.indexOf(deciSep) > -1) {
                                    //if (before.indexOf(deciSep) > -1) {
                                        newPos--;
                                    //}
                                    //before = before.replace(deciReg, '');
                                    //after = after.replace(deciReg, '');
                                    newValue = value;
                                }else {
                                    newValue = before + keys[key] + after;
                                }
                                var arrValue = newValue.split(deciSep);
                                if (arrValue[1]) {
                                    if (arrValue[1].length > 3) {
                                        newValue = value;
                                        newPos--;
                                    }
                                }

                                if (newValue.substring(0, 1) == deciSep) {
                                    newValue = "0" + newValue;
                                    newPos++;
                                }

                                while (newValue.length > 1 &&
                                newValue.substring(0, 1) == "0" && newValue.substring(1, 2) != deciSep) {
                                    newValue = newValue.substring(1);
                                    newPos--;
                                }

                                if (newValue.indexOf(deciSep) >= 0) {
                                    var newLength = newValue.indexOf(deciSep) + fractionSize + 1;
                                    if (newValue.length > newLength) {
                                        newValue = newValue.substring(0, newLength);
                                    }
                                }

                                newValues = spaceFormat(newValue, newPos);
                                if (newValues[0].length <= 18) {
                                    elem.val(newValues[0]);
                                    this.selectionStart = newValues[1];
                                    this.selectionEnd = newValues[1];
                                } else if (newValues[0].length >= 19 && newValues[0].length <= 22) {
                                    if (newValues[0].indexOf(deciSep) > 0 && newValues[0].indexOf(deciSep) <= 18) {
                                        elem.val(newValues[0]);
                                        this.selectionStart = newValues[1];
                                        this.selectionEnd = newValues[1];
                                    }
                                }
                            }
                        }
                    }
                }
            });
            elem.bind('keyup', function (ev) {
                if (this.selectionStart || this.selectionStart == 0) {
                    if (ev.which == 8 || ev.which == 46) {
                        // reformat the thousands after backspace keyup
                        var value = elem.val();
                        var caretPos = this.selectionStart;
                        var caretPosOrg = caretPos;
                        caretPos = spaceCaretPos(value, caretPos);
                        value = value.replace(thouReg, '');
                        var newValues = spaceFormat(value, caretPos);
                        if (newValues[0].length > 18 && newValues[0].length <= 22 && newValues[0].indexOf(deciSep) < 0) {
                            elem.val(newValues[0].substring(0, caretPosOrg));
                            this.selectionStart = newValues[1];
                            this.selectionEnd = newValues[1];
                        } else {
                            elem.val(newValues[0]);
                            this.selectionStart = newValues[1];
                            this.selectionEnd = newValues[1];
                        }
                    }
                }
            });
            elem.bind('blur', function (e) {
                if (fractionSize > 0) {
                    var value = elem.val();
                    var noDec = '';
                    for (var i = 0; i < fractionSize; i++)
                        noDec += '0';
                    if (value == "0" + deciSep + noDec)
                        elem.val(''); //<-- put your default value here
                    else if (value.length > 0) {
                        if (value.indexOf(deciSep) >= 0) {
                            var newLength = Number(value.indexOf(deciSep)) + Number(fractionSize) + Number(1);
                            if (value.length < newLength) {
                                while (value.length < newLength) {
                                    value = value + '0';
                                }
                                elem.val(value.substring(0, newLength));
                            }
                        }
                        else elem.val(value + deciSep + noDec);
                    }
                }
                $scope.$apply(function () {
                    $scope.valueModel = elem.val();
                    ctrl.$setViewValue(elem.val());
                    ctrl.$render();
                });
            });
        }
    };
}]);
SalaryApp.directive('parsecurrency', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            valueModel: '='
        },
        link: function (scope, element, attr, ngModelCtrl) {
            var pattern = /[^.0-9+-]/g;
            element.on('blur', function (e) {
                scope.$apply(fromUser(ngModelCtrl.$viewValue));
            });
            function fromUser(text) {
                if (angular.isNumber(kendo.parseFloat(text))) {
                    scope.valueModel = kendo.parseFloat(text);
                    transformedInput = kendo.toString(kendo.parseFloat(text), "n2")
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                } else {
                    scope.valueModel = null;
                    ngModelCtrl.$setViewValue(null);
                    ngModelCtrl.$render();
                }
            }
        }
    };
}]);
SalaryApp.directive('parsecurrency3', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            valueModel: '='
        },
        link: function (scope, element, attr, ngModelCtrl) {
            var pattern = /[^.0-9+-]/g;
            element.on('blur', function (e) {
                scope.$apply(fromUser(ngModelCtrl.$viewValue));
            });
            function fromUser(text) {
                if (angular.isNumber(kendo.parseFloat(text))) {
                    scope.valueModel = text;
                    transformedInput = kendo.toString(text, "n3");
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                } else {
                    scope.valueModel = null;
                    ngModelCtrl.$setViewValue(null);
                    ngModelCtrl.$render();
                }
            }
        }
    };
}]);
SalaryApp.directive('filterMenu', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        restrict: 'AE',
        scope: {
            parentMenu: '@'
        },
        link: function ($scope, elem, attrs, ctrl) {
            return "";
        }
    }
}]);
SalaryApp.directive('simpleUploadFile', function (Constant, Restangular, $timeout) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        require: '^?ngModel',
        scope: {
            list: '=',
            attachName: '=',
            item: '=',
            multiple: '=',
            readonly: '='
        },
        template: '<div><div class="input-group input-group-file">'
        + '<input type="file"  accept=".doc, .xls, .pdf"  style="display: none;" />'
        + '<input type="text" class="form-control att file" placeholder="Chọn file..." ng-model="attachName" readonly/>'
        + '<span class="input-group-btn">'
        + '<button class="btn btn-default btn-sm" type="button" style="padding-bottom: 3px; padding-top: 2px;" onclick="angular.element(this).scope().btnClickChangeFile(this)">Browser</button>'
        + '</span>'
            //+'<a href="downloadFile" ng-click="downloadFile" />{{attachName}}</>'
        + '</div>'
        + '<div class="list-attach-files" ng-if="listFiles.length>0" > <div class="item-attach-item" ng-repeat="item in listFiles">'
        + ' <i class=" ace-icon fa fa-file"></i>'
        + ' <a href="javascript:;" ng-click="downloadFile($index)" title="{{item.fileName}}">{{item.fileName}}</a>'
        + '<button type="button" class="btn btn-link" ng-click="removeFile($index)" title="Xóa file" ng-if="!readonly"><i class="fa fa-remove red"></i></button>'
        + '</div></div></div>',
        link: function (scope, element, attrs, ngModel) {
            scope.listFiles = [];
            /*if(scope.multiple == undefined){
             scope.multiple=true;
             }else{*/
            scope.multiple = false;//Hiện tại loại file hỗ trợ là not multiple
            //}
            if (scope.list == undefined) {
                scope.list = [];
            } else if (scope.list.length == 0) {
                scope.list = [];
            }
            scope.loadFiles = function () {
                if (!scope.multiple) {
                    if (scope.item) {
                        if (scope.item.fileName) {
                            scope.listFiles.push({
                                'fileName': scope.item.fileName,
                                'fileNameEncrypt': scope.item.attachIdEncrypted,
                                'type': 2//Loại trả về fileNameEncrypt
                            })
                        }
                        ;
                    }
                } else {
                    angular.forEach(scope.list, function (item) {
                        //scope.listId.push(v.endcodeAttachId);
                        scope.listFiles.push({
                            'fileName': item.fileName,
                            'fileNameEncrypt': item.fileNameEncrypt,
                            'type': 2//Loại trả về fileNameEncrypt
                        });
                    });
                }
            }
            scope.downloadFile = function (index) {
                var url = Constant.DOWNLOAD_SERVICE + scope.list[index].fileNameEncrypt;
                downloadFileWithUrl(url);
            }
            scope.removeFile = function (index) {
                if (scope.listFiles) {
                    scope.listFiles.splice(index, 1);
                }
            }
            scope.changeFile = function (e) {
                //scope.changeAttachFile();
                var fileName = event.target.files[0].name;
                var formData = new FormData();
                var assetUpload = event.target.files[0];
                formData.append('assetUpload', assetUpload);
                var fileSize = ((assetUpload.size / 1024) / 1024).toFixed(4);
                if (fileSize < 20) {
                }
                Restangular.one(Constant.UPLOAD_RS_SERVICE).withHttpConfig(
                    {
                        transformRequest: angular.identity
                    }).customPOST(formData, '', undefined, {
                        'Content-Type': 'multipart/form-data'
                    }).then(function (successResponse) {
                        if (successResponse.length > 0) {
//						 //scope.$apply(function () {
                            if (!scope.multiple) {
                                var object = {
                                    'fileName': fileName,
                                    'fileNameEncrypt': successResponse[0],
                                    'fileSize': fileSize,
                                    'type': 1//Loại trả về fileNameEncrypt
                                }
                                scope.list = [];
                                scope.list.push(object);
                                ngModel.$setViewValue(successResponse[0]);
                                scope.attachName = fileName;
                            }
                            //}
                            //});
                        }
                    });
            }
            scope.btnClickChangeFile = function (element) {
                angular.element(element).parent().prev().prev().bind('change', scope.changeFile);
                angular.element(element).parent().prev().prev().click();
            }
            scope.changeAttachFile = function (event) {
            }
            $timeout(function () {
                scope.loadFiles();
            }, 0);
        }
    };
});
SalaryApp.directive('uploadFile', function ($timeout, $compile) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        require: '^?ngModel',
        scope: {
            list: '=',
            saveUrl: '='
            /*only: '@',
             maxFiles: '@',
             maxSize: '@',
             maxSizeText: '@',
             fileType: '@'*/
        },
        template: '<input name="files"'
        + 'type="file"    kendo-upload="uploader" k-select="onSelect" k-options="options" k-upload="onUpload" k-progress="onProgress" '
            //+' k-async="{ saveUrl: {{saveUrl}},  autoUpload: true }" '
            /* +' '
             +' k-upload="onUpload"'
             +' k-success="onSucess"'+
             +' k-template="listFileTemplate"'   */
        + '/>',
        link: function (scope, element, attrs, ngModel) {
            // scope.saveUrl="/ktts-service/fileservice/uploadATTT";
            if (scope.saveUrl == undefined) {
                scope.saveUrl = '/ktts-service/fileservice/uploadATTT';
            }
            scope.onSelect = function (e) {
                var message = $.map(e.files, function (file) {
                    return file.name;
                }).join(", ");
            }
            scope.options = {
                async: {saveUrl: scope.saveUrl, removeUrl: 'remove', autoUpload: true},
                progress: scope.onProgress,
                template: "<span class='k-progress'>{{getPercen(files[0])}}</span>"
                + '<div><span class="k-filename">#=name#</span>'
                    //+"<h4 class='file-heading file-name-heading'>Name: #=name#</h4>"
                    //+"<h4 class='file-heading file-size-heading'>Size: #=size# bytes</h4>" +
//                      		+"<strong class='k-upload-status'>" +
//                      				+"</strong>"
                + "</div>"
                //""
            };
            //vm.listFiles=[{"name":"test.jpg"}];
            //scope.listFileTemplate=$scope.getTemplateBySelector("#fileTemplate");
            scope.onSucess = function (e) {
                for (var i = 0; i < e.files.length; i++) {
                    scope.$apply(function () {
                            vm.listFiles.push(e.files[i]);
                        }
                    );
                }
                //  $scope.setValueToModel();
            }
            scope.getPercen = function (file) {
                if (file.percentComplete != undefined) {
                    return file.percentComplete;
                }
                return 1;
                //return file.percentComplete;
            }
            scope.onProgress = function (ev) {
                var progress = ev.percentComplete;
                for (var i = 0; i < ev.files.length; i++) {
                    ev.files[0].percentComplete = ev.percentComplete;
                    scope.$apply(function () {
                            ev.files[0].percentComplete;
                        }
                    );
                }
            }
            scope.onUpload = function (e) {
                var xhr = e.XMLHttpRequest;
                xhr.addEventListener("readystatechange", function (e) {
                    if (xhr.readyState == 1 /* OPENED */) {
                        xhr.setRequestHeader('X-CSRF-TOKEN', readCookie('XSRF-TOKEN'));
                    }
                });
            };
        }
    }
});


SalaryApp.directive("myRule", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.myRule = function (modelValue) {
                return modelValue.getUTCFullYear() - new Date().getUTCFullYear() < 10;
            }
        }
    }
});
SalaryApp.directive("odd", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.odd = function (modelValue) {
                return modelValue % 2 === 1;
            }
        }
    };
});
