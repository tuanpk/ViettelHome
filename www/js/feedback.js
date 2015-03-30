// ****************** QUYNT7   //23/03/15 LoiNV7

// Bien luu tru thong tin vi tri tra ve dua vao vi tri hien tai (lay tu FBMapCtrl)
var mapLocal =
        {
            local: ''
        };
var fbDepartment =
        {
            value: ''
        };
var listDepartment = {};
var listLocation = {};
//save status show/hidden of text area native --Loinv7 at 27/03
module.controller('FeedbackController', function ($scope, $state, $Capture, $Camera, $ionicModal, goBackViewWithName)
{
    $scope.items = [
        {
            title: 'ĐỊA ĐIỂM',
//              label: 'Đã bình chọn',
            desc: 'Địa điểm không chọn được mặc định tại nơi công tác hoặc tự động định vị theo vị trí  hiện tại (Vui lòng bật xác định vị trí trong mục cài đặt)',
//              vote: 1,
            content: 'Anh chỉ mong sao Em có thể nói lên hết những tâm tư bao lâu nay của hai đứa.Nhưng sau hôm nay Em nói xóa mau đi bao nhiêu kí ức Em vội ra đi riêng mình Em. Em có biết rất khó mới tìm thấy nhau, như lúc này Anh xin Em hãy quay trở lại.'
        },
        {
            title: 'THỜI GIAN',
//              label: 'Đã bình chọn',
            desc: 'Thời gian không chọn thì được tự động để mặc định với thời gian hiện tại',
//              vote: 1,
            content: 'Anh chỉ mong sao Em có thể nói lên hết những tâm tư bao lâu nay của hai đứa.Nhưng sau hôm nay Em nói xóa mau đi bao nhiêu kí ức Em vội ra đi riêng mình Em. Em có biết rất khó mới tìm thấy nhau, như lúc này Anh xin Em hãy quay trở lại.'
        }, {
            title: 'LỰA CHỌN CẤP GỬI',
//              label: 'Đã bình chọn',
            desc: 'Cấp gửi không chọn thì được mặc định gửi tới cấp thuộc phòng/ban trung tâm công tác',
//              vote: 0
        }
    ];
    $scope.mediaUrl = [];

    $('#demo_datetime').mobiscroll().datetime({
        theme: 'mobiscroll-dark', // Specify theme like: theme: 'ios' or omit setting to use default 
        mode: 'mode', // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
        display: 'bottom', // Specify display mode like: display: 'bottom' or omit setting to use default 
        lang: 'en-UK', // Specify language like: lang: 'pl' or omit setting to use default
        minDate: new Date(2010, 01, 01, 00, 00), // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
        maxDate: new Date(2020, 01, 01, 00, 00), // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
        stepMinute: 1  // More info about stepMinute: http://docs.mobiscroll.com/2-14-0/datetime#!opt-stepMinute
    });

    $ionicModal.fromTemplateUrl('templates/FBModalTextbox.html', {
        scope: $scope,
        focusFirstInput: true,
        animation: 'slide-in-up'
    }).then(function (modal)
    {
        $scope.modal = modal;
    });
//    var txtActiveIndex = 0;
//    $scope.showModalText = function (index)
//    {
//        txtActiveIndex = index;
//        $scope.modal.show();
//        if (txtActiveIndex === 0)
//            document.getElementById("modalTxtArea").value = document.getElementById("txtTitle").value;
//        else
//            document.getElementById("modalTxtArea").value = document.getElementById("txtContent").value;
//  
//    $scope.submit = function (value)
//    {
//        if (txtActiveIndex === 0)
//            document.getElementById("txtTitle").value = document.getElementById("modalTxtArea").value;
//        else
//            document.getElementById("txtContent").value = document.getElementById("modalTxtArea").value;
//      
//        $scope.modal.hide();
////        $scope.modal=nill;
//    };
    $scope.$on('$destroy', function ()
    {
        $scope.modal.remove();
    });
    $scope.$on('$locationChangeSuccess', function ()
    {
        $scope.local = mapLocal.local;
        $scope.department = fbDepartment.value;
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

    $scope.updateEditor = function (elementId)
    {
        resizeTextArea(elementId);
    };

    $scope.postFeedback = function ()
    {
        if (validText("txtTitle", "Tiêu đề"))
            if (validText("txtContent", "Nôi dung phản ánh"))
            {
                $.post(PARSE + "postFeedback",
                        {
                            userId: userId,
                            session: session,
                            state: '1',
                            domain: '1',
                            title: document.getElementById('txtTitle').value,
                            content: document.getElementById('txtContent').value,
                            attach_type: '0',
                            location: 'Noi trai tim co nang',
                            time: new Date().getTime(),
                            department: '1',
                            attach_count: '0'
                        }
                ).done(function (json) {
                    var feedbackId = json.result[0].feedbackId;
                    alert('postFeedback Success feedbackId: ' + feedbackId + ' ' + JSON.stringify(json));

                    if ($scope.mediaUrl.length > 0) {
                        for (var i = 0; i < $scope.mediaUrl.length; i++) {
                            $scope.mediaUrl[i].title = document.getElementById('txtTitle').value;
//                            $scope.mediaUrl[i].status = i % 3;
                            $scope.mediaUrl[i].feedbackId = feedbackId;
                            window.resolveLocalFileSystemURI($scope.mediaUrl[i].url, readFile, onError);
                        }
                        store.batch($scope.mediaUrl, function (json) {
//                            alert('insert ' + JSON.stringify(json));
                        });
                    }
//                    goBackViewWithName('main');
                }).fail(function (err) {
                    alert("postFeedback Error " + JSON.stringify(err));
                });
            }
    };

    function readFile(fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (evt) {
//                alert('onloadend ' + sizeof(evt.target.result) + ' ' + JSON.stringify(fileEntry.file));

                $.post(PARSE + "uploadFileFeedback",
                        {
                            userId: userId,
                            session: session,
                            attach_type: '1',
                            feedbackId: '83',
                            file_index: '1',
                            filename: 'icon.png',
                            stringData: evt.target.result
                        }
                ).done(function (json) {
                    alert('uploadFileFeedback Success ' + JSON.stringify(json));
                    Parse.Push.send({
                        where: query, // Set our Installation query
                        data: {
                            alert: "Dong chi co phan anh moi : " + document.getElementById('txtTitle').value
                        }
                    }, {
                        success: function () {
                            alert('Parse.Push.send Success');
                        },
                        error: function (error) {
                            alert('Parse.Push.send Error' + JSON.stringify(error));
                        }
                    });
                }).fail(function (err) {
                    alert("uploadFileFeedback Error " + JSON.stringify(err));
                });
            }
            reader.readAsDataURL(file);
        });
    }

    function onError(error) {
        alert('onError ' + JSON.stringify(error));
    }

//    function onSuccess(response) {
//        alert('onSuccess ' + JSON.stringify(response));
//    }


//    function fileUpload(fileURI, fileKey, mimeType) {
//        var options = new FileUploadOptions();
//        options.fileKey = fileKey;
//        options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
//        options.mimeType = mimeType;
//
//        var params = {};
//        params.userId = userId;
//        params.session = session;
//        params.attach_type = 1;
//        params.feedbackId = 154;
//        params.file_index = 1;
//        params.filename = fileURI.substr(fileURI.lastIndexOf('/') + 1);
//        params.byteData = 'data:image/gif;base64,R0lGODlhDwAPAKECAAAAzMzM/////wAAACwAAAAADwAPAAACIISPeQHsrZ5ModrLlN48CXF8m2iQ3YmmKqVlRtW4MLwWACH+H09wdGltaXplZCBieSBVbGVhZCBTbWFydFNhdmVyIQAAOw==';
//
//        options.params = params;
//
//        var ft = new FileTransfer();
//        alert('FileTransfer ' + fileURI);
//        ft.upload(fileURI, encodeURI("http://125.235.4.243:8080/ViettelHomeBackend/uploadFileFeedback"), onSuccess, onError, options);
//        //window.resolveLocalFileSystemURL
//    }

    $scope.choosePicture = function ()
    {
        $Camera.getPicture({
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        }).then(function (file_uri) {
            var date = new Date();
            var json = {feedbackId: "", index: $scope.mediaUrl.length.toString(), url: file_uri, title: "", content: "", type: 1, date: date, status: 2, progess: 0};
            $scope.mediaUrl.push(json);
            var image = document.getElementById('feedback_image');
            image.src = file_uri;
//            alert('choosePicture Success: ' + file_uri);
//            fileUpload(file_uri, 'data', 'image/jpeg');
        }, onError);
    };

    $scope.takePicture = function () {
        $Camera.getPicture({
            quality: 100,
            targetWidth: 320,
            targetHeight: 320,
            saveToPhotoAlbum: false
        }).then(function (file_uri) {
            var date = new Date();
            var json = {feedbackId: "", index: $scope.mediaUrl.length.toString(), url: file_uri, title: "", content: "", type: 1, date: date, status: 2, progess: 0};
            $scope.mediaUrl.push(json);
            var image = document.getElementById('feedback_image');
            image.src = file_uri;
//            alert('takePicture Success: ' + file_uri);
//            fileUpload(file_uri, 'data', 'image/jpeg');
        }, onError);
    };

    $scope.takeVideo = function () {
        $Capture.captureVideo({limit: 1, duration: 1}).then(function (files_uri) {
            var date = new Date();
            var json = {feedbackId: "", index: $scope.mediaUrl.length.toString(), url: files_uri[0], title: "", content: "", type: 2, date: date, status: 2, progess: 0};
            $scope.mediaUrl.push(json);
//            alert('captureVideo Success ' + files_uri[0].fullPath);
        }, onError);
    };

//    function videoSuccess(videoData) {
//        alert('upLoadVideo ' + sizeof(videoData));
//        var file = new Parse.File("feedback_video.mp4", {base64: videoData});
//        file.save().then(function () {
//            alert('videoSuccess  ' + file.url());
//            var obj = new Parse.Object("FeedbackVideo");
//            obj.set("file", file);
//            obj.save().then(function () {
//                var query = new Parse.Query(Parse.Installation);
//                Parse.Push.send({
//                    where: query, // Set our Installation query
//                    data: {
//                        alert: "Dong chi co phan anh video moi!"
//                    }
//                }, {
//                    success: function () {
//                        alert('Parse.Push.send Success');
//                    },
//                    error: function (error) {
//                        alert('Parse.Push.send Error' + JSON.stringify(error));
//                    }
//                });
//            });
//        }, onError);
//    }

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

module.controller('FeedbackLocationController', function ($scope, $state, $ionicPopover, goBackViewWithName)
{
    $scope.fbDataFilter = {};
    $scope.fbTxtOtherLocal = {};
    getDepartments($scope);
//    $scope.items = listDepartment;
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
//        alert($scope.fbTxtOtherLocal);
//        alert($scope.fbDataFilter.query);
        if ($scope.fbTxtOtherLocal.value)
            mapLocal = {
                local: $scope.fbTxtOtherLocal.value
            };
        else
            mapLocal = {
                local: $scope.fbDataFilter.query
            };
//        alert(mapLocal.local);
        goBackViewWithName('feedback');
    };
    $scope.clearSearch = function ()
    {
        $scope.popover.hide();
        $scope.fbDataFilter.query = '';
    };
    $scope.updateEditor = function (elementId)
    {
        resizeTextArea.resize(elementId);
    };
    $scope.showScreen = function (i)
    {
        $state.go("feedback_map");
    };
});
module.controller('FBDepartmentCtr', function ($scope, $ionicPopover, goBackViewWithName)
{
    $scope.fbDataFilter = {};
    $scope.department = {
        value: 'Phòng tổng hợp'
    };
    getDepartments($scope);
    $ionicPopover.fromTemplateUrl('templates/FBPopoverLocation.html', {
        scope: $scope
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
    $scope.sumitDepartment = function ()
    {
        if (document.getElementById('fbCheckDepartment').checked)
            fbDepartment = {
                value: $scope.fbDataFilter.query
            };
        else
            fbDepartment = {
                value: $scope.department.value
            };
//        alert(fbDepartment.value);
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
    getListLocation($scope);
    function initialize()
    {
        navigator.geolocation.getCurrentPosition(function (pos)
        {
            var myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                    mapOptions);

            //Marker + infowindow + angularjs compiled ng-click
            var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
            var compiled = $compile()($scope);

            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'My Position'
            });

            google.maps.event.addListener(marker, 'click', function ()
            {
                infowindow.open(map, marker);
            });
            $scope.$apply(function () {
                $scope.map = map;
            });
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });
    }
    initialize();
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
});

module.factory('$Camera', ['$q', function ($q) {

        return {
            getPicture: function (options) {
                var q = $q.defer();

                navigator.camera.getPicture(function (result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);
//Loi nv 7 at 24/03/15
//Service go multi view
module.service('goBackManyView', function ($ionicHistory) {
    return function (depth) {
        // get the right history stack based on the current view
        var historyId = $ionicHistory.currentHistoryId();
        var history = $ionicHistory.viewHistory().histories[historyId];
        // set the view 'depth' back in the stack as the back view
        var targetViewIndex = history.stack.length - 1 - depth;
        $ionicHistory.backView(history.stack[targetViewIndex]);
        // navigate to it
        $ionicHistory.goBack();
    };
});
//Service go to view with name
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
                    // Do any magic you need
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

//Loinv7 at 25/03/15
function getDepartments($scope)
{
    $.post(PARSE + "onLoadDepartment", {userId: userId, session: session, begin: 0, end: 50})
            .done(function (data)
            {
                $scope.$apply(function ()
                {
                    listDepartment = data.result;
                    $scope.items = listDepartment;
                });
            }).fail(function (err)
    {
        $scope.items = {};
        alert('Xin hãy kiểm tra lại kết nối');
    });
}
//LoiNV7 At 26/03/15
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
//Loinv7 At 30/03/15
function resizeTextArea(elementId)
{
    var element = document.getElementById(elementId);
//    if (element.scrollHeight > element.clientHeight)
//    {
//        if (element.scrollHeight < (window.innerHeight * heightPer / 100))
    element.style.height = element.scrollHeight + "px";
//    }
}
;