var mapLocal = {local: ''};
var fbDepartment = {value: ''};
var listDepartment = {};
var listLocation = {};
var attach_type = 0;
//save status show/hidden of text area native --Loinv7 at 27/03
var txvStatus = 0; //0 not init textview 1 show 
module.controller('FeedbackController', function ($scope, $state, $Capture, $Camera, $ionicPopover, $ionicModal, goBackViewWithName, $ionicPopup)
{
    $scope.timeNow = new Date();
    $scope.mediaUrl = [];
    document.getElementById("demo_datetime").value = $scope.timeNow;
    if (window.plugins.VtTextView)
    {
        window.plugins.VtTextView.initWithListID(function () {
            $scope.$apply(function () {
            });

        }, function () {
            $scope.$apply(function () {
            });
        }, {
            listID: ['txtFBTitle', 'txtFBContent'],
            isScroll: 'false'
        });
    }
    $scope.goBack = function ()
    {
        window.plugins.VtTextView.destroy(function () {
        }, function () {
        });
        goBackViewWithName('main');

    }
    $('#demo_datetime').mobiscroll().datetime({
        theme: 'mobiscroll-dark',
        mode: 'mode',
        display: 'bottom',
        lang: 'en-UK',
        minDate: new Date(2010, 01, 01, 00, 00), // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
        maxDate: new Date(2020, 01, 01, 00, 00), // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
        stepMinute: 1  // More info about stepMinute: http://docs.mobiscroll.com/2-14-0/datetime#!opt-stepMinute
    });

    $scope.$on('$locationChangeSuccess', function ()
    {
        if (mapLocal.local) {
            $scope.local = mapLocal.local;
            mapLocal.local = department;
        } else {
            $scope.local = department;
        }
    });
    $scope.showScreen = function (i)
    {
        switch (i) {
            case 0:
                $state.go("feedback_location");
                break;
            case 2:
                $state.go("feedback_department");
                break;
            default:
                alert("NOT FOUND showScreen " + i);
                break;
        }
    };

    $ionicPopover.fromTemplateUrl('templates/admin_img_popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.$on('$destroy', function ()
    {
        $scope.popover.remove();
    });
    $scope.zoomImg = function ($event)
    {

        if ($scope.imgPopover)
        {
            $scope.height = window.innerHeight / 3.5;
            $scope.indexOfImage = 1;
            $scope.popover.show($event);
//            alert(JSON.stringify($scope.mediaUrl));
        }
    };

    $scope.updateEditor = function (elementId, minHeight)
    {
        resizeTextArea(elementId, minHeight);
    };

    $scope.feedbackId = -1;
    $scope.postFeedback = function ()
    {
        if (validText("txtFBTitle", "Tiêu đề", $ionicPopup))
            if (validText("txtFBContent", "Nôi dung phản ánh", $ionicPopup))
            {
                var time = new Date(document.getElementById("demo_datetime").value);
                $.post(PARSE + "postFeedback",
                        {
                            userId: userId,
                            session: session,
                            state: $('input[name=group]:checked').val(),
                            domain: document.getElementById("feedback_field").value,
                            title: document.getElementById('txtTitle').value,
                            content: document.getElementById('txtContent').value,
                            attach_type: attach_type,
                            location: mapLocal.local,
                            time: time.getTime(),
                            department: '1', //fbDepartment.value,
                            attach_count: $scope.mediaUrl.length
                        }
                ).done(function (json) {
                    $scope.feedbackId = json.result[0].feedbackId;
                    if (DEBUG)
                        alert('postFeedback Success feedbackId: ' + $scope.feedbackId + ' ' + JSON.stringify(json));
                    if ($scope.mediaUrl.length > 0) {
                        for (var i = 0; i < $scope.mediaUrl.length; i++) {
                            $scope.mediaUrl[i].key = $scope.feedbackId + "_" + i;
                            $scope.mediaUrl[i].userName = userName;
                            $scope.mediaUrl[i].index = i;
                            $scope.mediaUrl[i].title = document.getElementById('txtTitle').value;
                            $scope.mediaUrl[i].content = document.getElementById('txtContent').value;
                            $scope.mediaUrl[i].feedbackId = $scope.feedbackId;
                        }
                        if (DEBUG)
                            alert('store.batch() ' + $scope.mediaUrl.length);
                        store.batch($scope.mediaUrl, function (json) {
                            if (DEBUG)
                                alert('insert ' + JSON.stringify(json));
                            for (var i = 0; i < json.length; i++) {
                                window.resolveLocalFileSystemURI(json[i].url, readFile, onError);
                                if (DEBUG)
                                    alert('resolveLocalFileSystemURI ' + json[i].url);
                            }
                        });
                    } else {
                        $ionicPopup.show({
                            title: 'Thông Báo',
                            template: "Gửi phản ánh thánh công",
                            buttons: [{text: 'Ok'}]
                        });
                        goBackViewWithName('main');
                    }
                }).fail(function (err) {
                    $scope.feedbackId = -1;
                    $ionicPopup.show({
                        title: 'Thông Báo',
                        template: "Gửi phản ánh thất bại " + JSON.stringify(err),
                        buttons: [{text: 'Ok'}]
                    });
                });
            }
    };

    function readFile(fileEntry) {
        if (DEBUG)
            alert('fileEntry ' + JSON.stringify(fileEntry));
        var index = -1;
        var attach_type = 0;
        var readFilePath;
        if (ionic.Platform.isWindowsPhone()) {
            readFilePath = fileEntry.toURL();
        } else {
            readFilePath = fileEntry.nativeURL;
        }

        for (var i = 0; i < $scope.mediaUrl.length; i++) {
            if ($scope.mediaUrl[i].feedbackId == $scope.feedbackId && $scope.mediaUrl[i].url == readFilePath) {
                if ($scope.mediaUrl[i].status === 2) {
                    index = i;
                    attach_type = $scope.mediaUrl[i].attach_type;
                    break;
                }
            }
        }
        fileEntry.file(function (file) {
            var reader = new FileReader();
            if (DEBUG)
                alert('fileEntry.file ' + JSON.stringify(file));
            reader.onloadend = function (evt) {
//                alert('onloadend ' + sizeof(evt.target.result));
                $.post(PARSE + "uploadFileFeedback",
                        {
                            userId: userId,
                            session: session,
                            attach_type: attach_type,
                            feedbackId: $scope.feedbackId,
                            file_index: index,
                            filename: file.name,
                            stringData: evt.target.result
                        }
                ).done(function (json) {
                    if (DEBUG)
                        alert('uploadFileFeedback Success ' + JSON.stringify(json));
                    store.all(function (json) {
                        for (var i = 0; i < json.length; i++) {
                            if (json[i].feedbackId == $scope.feedbackId && json[i].url == readFilePath) {
                                if (json[i].status === 2) {
                                    json[i].status = 1;
                                    store.save(json[i]);
                                    if (DEBUG)
                                        alert('index ' + index + ' ' + $scope.feedbackId + ' = ' + json[i].feedbackId + ' ' + json[i].url + ' = ' + ' fileEntry ' + readFilePath);
                                    break;
                                }
                            }
                        }
                        goBackViewWithName('main');
                    });

                    var query = new Parse.Query(Parse.Installation);
                    Parse.Push.send({
                        where: query, // Set our Installation query
                        data: {
                            alert: "Đồng chí " + fullName + ' vừa gửi phản ánh : ' + document.getElementById('txtTitle').value
                        }
                    }, {
                        success: function () {
                            console.log('Parse.Push.send Success');
                        },
                        error: function (error) {
                            alert('Parse.Push.send Error' + JSON.stringify(error));
                        }
                    });
                }).fail(function (err) {
                    store.all(function (json) {
                        for (var i = 0; i < json.length; i++) {
                            if (json[i].url == readFilePath) {
                                if (json[i].status == 2) {
                                    json[i].status = 0;
                                    store.save(json[i]);
                                    if (DEBUG)
                                        alert('index ' + index + ' ' + $scope.feedbackId + ' = ' + json[i].feedbackId + ' ' + json[i].url + ' = ' + ' fileEntry ' + readFilePath);
                                    break;
                                }
                            }
                        }
                        goBackViewWithName('main');
                    });
                    $ionicPopup.show({
                        title: 'Thông Báo',
                        template: "Upload File đính kèm thất bại " + JSON.stringify(err),
                        buttons: [{text: 'Ok'}]
                    });
                });
            }
            reader.readAsDataURL(file);
        });
    }

    function onError(error) {
        alert(JSON.stringify(error));
    }

    function gotFile(fileEntry)
    {
        if (DEBUG)
            alert('gotFile ' + fileEntry.toURL() + ' ' + fileEntry.fullPath);
        if (ionic.Platform.isWindowsPhone()) {
            $scope.imgPopover = fileEntry.toURL();
        } else {
            $scope.imgPopover = fileEntry.nativeURL;
        }
        var date = new Date();
        var json = {feedbackId: "", index: $scope.mediaUrl.length, url: $scope.imgPopover, title: "", content: "", attach_type: 1, date: date, status: 2, progess: 0};
        $scope.mediaUrl.push(json);
    }

    $scope.choosePicture = function ()
    {
        attach_type = 1;
        $Camera.getPicture({
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        }).then(function (file_uri) {
            var image = document.getElementById('feedback_image');
            image.src = file_uri;
            window.resolveLocalFileSystemURL(file_uri, gotFile, onError);
        }, onError);
    };

    $scope.takePicture = function () {
        attach_type = 1;
        $Camera.getPicture({
            quality: 100,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: false
        }).then(function (file_uri) {
            var image = document.getElementById('feedback_image');
            image.src = file_uri;
            window.resolveLocalFileSystemURI(file_uri, gotFile, onError);
        }, onError);
    };

    $scope.takeVideo = function () {
        attach_type = 2;
        $Capture.captureVideo({limit: 1, duration: 1}).then(function (files_uri) {
            var date = new Date();
            var json = {feedbackId: "", index: $scope.mediaUrl.length, url: files_uri[0], title: "", content: "", attach_type: 2, date: date, status: 2, progess: 0};
            $scope.mediaUrl.push(json);
        }, onError);
    };


//    function imageSuccess(imageData) {
//        var image = document.getElementById('feedback_image');
//        image.src = "data:image/jpeg;base64," + imageData;
//
//        var file = new Parse.File("feedback_image.jpg", {base64: imageData});
//        file.save().then(function () {
////            alert('imageSuccess  ' + file.url());
//            var obj = new Parse.Object("FeedbackImage");
//            obj.set("file", file);
//
//            obj.save().then(function () {
//                var query = new Parse.Query(Parse.Installation);
//                Parse.Push.send({
//                    where: query, // Set our Installation query
//                    data: {
//                        alert: "Dong chi co phan anh hinh anh moi!"
//                    }
//                }, {
//                    success: function () {
//                        alert('Parse.Push.send Success');
//                    },
//                    error: function (error) {
//                        alert('Parse.Push.send Error ' + JSON.stringify(error));
//                    }
//                });
//            });
//        }, onError);
//    }
});

module.controller('FeedbackLocationController', function ($scope, $ionicPopup, $state, $ionicPopover, goBackViewWithName)
{
    $scope.fbDataFilter = {};
    $scope.fbTxtOtherLocal = {};
    getDepartments($scope, $ionicPopup);
    if (window.plugins.VtTextView)
    {
        window.plugins.VtTextView.initWithListID(function () {
            $scope.$apply(function () {
            });

        }, function () {
            $scope.$apply(function () {
            });
        }, {
            listID: ['txtFBLocation'],
            isScroll: 'false'
        });
    }
    $scope.goBack = function ()
    {
        window.plugins.VtTextView.show(function () {
        }, function () {
        }, ['txtFBTitle', 'txtFBContent']);
        goBackViewWithName('feedback');

    }

    $ionicPopover.fromTemplateUrl('templates/FBPopoverLocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
    $scope.selectLocation = function (value)
    {
        $scope.fbDataFilter.query = value;
        $scope.popover.hide();
    };
    $scope.sumitLocal = function ()
    {
        if ($scope.fbTxtOtherLocal.value)
            mapLocal = {
                local: $scope.fbTxtOtherLocal.value
            };
        else
            mapLocal = {
                local: $scope.fbDataFilter.query
            };
        goBackViewWithName('feedback');
    };
    $scope.clearSearch = function ()
    {
        $scope.popover.hide();
        $scope.fbDataFilter.query = '';
    };
    $scope.updateEditor = function (elementId, minHeight)
    {
        resizeTextArea(elementId);
    };
    $scope.showScreen = function ()
    {
        window.plugins.VtTextView.hide(function () {
            $scope.$apply(function () {
            });

        }, function () {
            $scope.$apply(function () {
            });
        }, [
            'txtFBLocation'
        ]);
        $state.go("feedback_map");
    };
});
module.controller('FBDepartmentCtr', function ($scope, $ionicPopup, $ionicPopover, goBackViewWithName)
{
    $scope.fbDataFilter = {};
    $scope.fbdepartment = {
        value: department
    };
    getDepartments($scope, $ionicPopup);
    $ionicPopover.fromTemplateUrl('templates/FBPopoverLocation.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
    $scope.selectLocation = function (value, departID)
    {
        $scope.fbDataFilter.query = value;
        $scope.departmentID = departID;
        $scope.popover.hide();
    };
    $scope.sumitDepartment = function ()
    {
        if (document.getElementById('fbCheckDepartment').checked)
            fbDepartment = {
                value: $scope.fbdepartment.value
            };
        else
            fbDepartment = {
                value: $scope.departmentID
            };
        goBackViewWithName('feedback');
    };
    $scope.clearSearch = function ()
    {
        $scope.popover.hide();
        $scope.fbDataFilter.query = '';
    };
});

module.controller('FBMapCtrl', function ($scope, goBackViewWithName)
{
    $scope.isLoadedMap = false;
    mapsApiReady();
    getListLocation($scope);
    $scope.local = {
        loc: ''
    };
    $scope.sumitLocal = function ()
    {
        mapLocal = {
            local: $scope.local.loc
        };
        goBackViewWithName('feedback');
    };
    $scope.goBack = function ()
    {
        window.plugins.VtTextView.show(function () {
            $scope.$apply(function () {
            });

        }, function () {
            $scope.$apply(function () {
            });
        }, [
            'txtFBLocation'
        ]);
        goBackViewWithName('feedback_location');
    }
});

module.factory('$Camera', ['$q', function ($q) {

        return {
            getPicture: function (options) {
                var q = $q.defer();

                navigator.camera.getPicture(function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);

module.service('goBackManyView', function ($ionicHistory) {
    return function (depth) {
        var historyId = $ionicHistory.currentHistoryId();
        var history = $ionicHistory.viewHistory().histories[historyId];
        var targetViewIndex = history.stack.length - 1 - depth;
        $ionicHistory.backView(history.stack[targetViewIndex]);
        $ionicHistory.goBack();
    };
});

module.service('goBackViewWithName', function ($ionicHistory) {
    return function (stateName) {
        var historyId = $ionicHistory.currentHistoryId();
        var history = $ionicHistory.viewHistory().histories[historyId];
        for (var i = history.stack.length - 1; i >= 0; i--)
        {
            if (history.stack[i].stateName == stateName)
            {
                $ionicHistory.backView(history.stack[i]);
                $ionicHistory.goBack();
            }
        }
    };
});
module.factory('$Capture', ['$q', function ($q) {

        return {
            captureVideo: function (options) {
                var q = $q.defer();

                navigator.device.capture.captureVideo(function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);

function sizeof(_1) {
    var _2 = [_1];
    var _3 = 0;
    for (var _4 = 0; _4 < _2.length; _4++) {
        switch (typeof _2[_4]) {
            case "boolean":
                _3 += 4;
                break;
            case "number":
                _3 += 8;
                break;
            case "string":
                _3 += 2 * _2[_4].length;
                break;
            case "object":
                if (Object.prototype.toString.call(_2[_4]) != "[object Array]") {
                    for (var _5 in _2[_4]) {
                        _3 += 2 * _5.length;
                    }
                }
                for (var _5 in _2[_4]) {
                    var _6 = false;
                    for (var _7 = 0; _7 < _2.length; _7++) {
                        if (_2[_7] === _2[_4][_5]) {
                            _6 = true;
                            break;
                        }
                    }
                    if (!_6) {
                        _2.push(_2[_4][_5]);
                    }
                }
        }
    }
    return _3;
}

function getDepartments($scope, $ionicPopup) {
    if (!listDepartment)
    {
        listDepartment = {};
        $.post(PARSE + "onLoadDepartment", {userId: userId, session: session, begin: 0, end: 100}).done(function (json) {
            $scope.$apply(function () {
                listDepartment = json.result;
                $scope.department = listDepartment;
            });
        }).fail(function (er) {
            $ionicPopup.show({
                title: 'Thông Báo',
                template: "Không thể kết nối đến máy chủ" + JSON.stringify(er),
                buttons: [{text: 'Ok'}]
            });
        });
    } else {
        $scope.department = listDepartment;
    }
}
;
function getListLocation($scope)
{
    $.post(PARSE + "onSuggestDepartment", {userId: userId, session: session, begin: 0, end: 50})
            .done(function (data)
            {
                $scope.$apply(function ()
                {
                    listLocation = data.result;
                    $scope.items = listLocation;
                });
            }).fail(function (err)
    {
        $scope.items = {};
        alert('Xin hãy kiểm tra lại kết nối');
    });
}
function resizeTextArea(elementId, minHeight)
{
    var element = document.getElementById(elementId);
    if (element.scrollHeight < minHeight)
        element.style.height = minHeight + "px";
    else {
        if (element.scrollHeight < 170) {
            element.style.height = element.scrollHeight + "px";
        }
    }
}
;

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
}