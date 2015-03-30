
// *********************** NGOCTT 12
//***********chooseEventController*****************
var voteEvent;
var isMoreEvent = true;
function getListEvent($scope) {
    if (!voteEvent)
    {
        voteEvent = {};
        $.post(PARSE + "onLoadVoteEvent", {userId: userId, session: session, begin: 0, end: 50}).done(function (json) {
            $scope.$apply(function ()
            {
                voteEvent.listEvent = json.result;
                $scope.listEvent = voteEvent.listEvent;
//                alert(JSON.stringify(voteEvent.listEvent));
                $scope.$broadcast('scroll.refreshComplete');
                isMoreEvent = false;
            });
        }).fail(function () {
            alert("Vui lòng kết nối mạng và thử lại!");
        });
    }
    else
        $scope.listEvent = voteEvent.listEvent;
}

module.controller('chooseEventController', function ($scope, $state) {
    getListEvent($scope);
    $scope.doRefreshListEvent = function ()
    {
        voteEvent = null;
        getListEvent($scope);
    };

    $scope.reloadRoute = function () {
        $route.reload();
    };
    $scope.des = ["Chưa bình chọn", "Đã bình chọn", "Đã bình chọn"];

    $scope.loadMoreEvent = function () {
        getListEvent($scope);
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.moreEventCanBeLoaded = function () {
        return isMoreEvent;
    };


    $scope.showDetail_even = function (index) {
        var selectedVoteItem = voteEvent.listEvent[index];
        voteEvent.selectedItem = selectedVoteItem;
        if (selectedVoteItem.state == 0) {
            $state.go('event_detail_false', {title: selectedVoteItem.title});
        } else
            $state.go('event_detail_true', {title: selectedVoteItem.title});
    };
});
//***********chooseEventController*****************

//***********eventDetailTrueController*****************
module.controller('eventDetailTrueController', function ($scope, goBackViewWithName) {
    $scope.eventDetail = voteEvent.selectedItem;
    $scope.$on("$locationChangeSuccess", function ()
    {
        var pieData = {};
        var item = voteEvent.selectedItem;
        var a = parseFloat(item.like);
        var b = parseFloat(item.unlike);
        var pieData = [
            {
                value: a,
                color: "#0070c0",
                label: "Đồng ý"
            },
            {
                value: b,
                color: "#c0504d",
                label: "Không đồng ý"
            }
        ];
        $scope.notePie = [parseInt(a * 100 / (a + b)), parseInt(b * 100 / (a + b))];

        Chart.defaults.global.animation = false;
        Chart.defaults.global.responsive = true;
        var ctx = document.getElementById("chart-area").getContext("2d");
        window.myPie = new Chart(ctx).Pie(pieData);
    });
    $scope.back = function () {
        goBackViewWithName('event');
    };
});
//    $scope.showEvent = function () {
//        $state.go('event_detail_false', {});
//    };
//***********eventDetailTrueController*****************

//***********eventDetailFalseController*****************
module.controller('eventDetailFalseController', function ($scope, $ionicPopup, $ionicModal, $state) {
//    $scope.txtVote = {
//        value: ''
//    };
$scope.updateEditor = function (elementId, heightPer)
    {
        $ResizeTextArea.resize(elementId,heightPer);
    };
    $scope.eventDetailFalse = voteEvent.selectedItem;
//    $ionicModal.fromTemplateUrl('templates/FBModalTextbox.html', {
//        scope: $scope,
//        focusFirstInput: true,
//        animation: 'slide-in-up'
//    }).then(function (modal)
//    {
//        $scope.modal = modal;
//    });
//    $scope.$on('$destroy', function ()
//    {
//        $scope.modal.remove();
//    });
//    $scope.popOverText = function ()
//    {
//        $scope.modal.show();
//        document.getElementById("modalTxtArea").value = $scope.txtVote.value;
//    };
//    $scope.submit = function ()
//    {
//        $scope.txtVote.value = document.getElementById("modalTxtArea").value;
//        $scope.modal.hide();
//    };

    $scope.finish_event = function ()
    {
        var valOfRadio = $('input[name=group]:checked').val();
        var textOfTextarea = document.getElementById("txtVote").value;
        alert("$scope.txtVote.value : " + textOfTextarea);
        if (valOfRadio !== voteEvent.selectedItem.state || textOfTextarea) {
            var alertEvent = $ionicPopup.show({
                title: 'Thông Báo',
                template: 'Bạn có muốn lưu bình chọn của mình hay không?',
                scope: $scope,
                buttons: [
                    {text: 'Không'},
                    {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onTap: function () {
                            alertEvent.close();
                            $.post(PARSE + "voteEvent", {userId: userId, session: session, state: valOfRadio, eventId: $scope.eventDetailFalse.eventId, content: textOfTextarea}).done(function (json) {
                                alert(JSON.stringify(json));
                                $scope.$apply(function ()
                                {
                                    if ($scope.eventDetailFalse.eventId == 0) {
                                        if (valOfRadio == 1)
                                            voteEvent.selectedItem.like++;
                                        else
                                            voteEvent.selectedItem.unlike++;
                                    } else if (($scope.eventDetailFalse.eventId == 1) && (valOfRadio == 2)) {
                                        voteEvent.selectedItem.like--;
                                        voteEvent.selectedItem.unlike++;
                                    } else if (($scope.eventDetailFalse.eventId == 2) && (valOfRadio == 1)) {
                                        voteEvent.selectedItem.like++;
                                        voteEvent.selectedItem.unlike--;
                                    }
                                    voteEvent.selectedItem.state = valOfRadio;
                                    $state.go('event_detail_true');
                                });
                            }).fail(function () {
                                alert("Vui lòng kết nối mạng và thử lại!");
                            });
                        }
                    }
                ]
            });
        } else {
            $ionicPopup.show({
                title: 'Thông Báo',
                template: 'Bạn chưa bình chọn,đóng góp ý kiến hoặc không thay đổi nội dung',
                buttons: [{text: 'Ok'}]
            });
        }
    };
});
//***********eventDetailTrueController*****************
// ################### NGOCTT12
//
//
//// *********************** NGOCTT 12
////***********chooseEventController*****************
//var voteEvent = {} ;
//function getListEvent($scope) {
//    if (!voteEvent)
//    {
//        voteEvent = {};
//        $.post(PARSE + "onLoadVoteEvent", {userId: userId, session: session, begin: 0, end: 50}).done(function (json) {
//            $scope.$apply(function ()
//            {
//                voteEvent.listEvent = json.result;
//                $scope.listEvent = voteEvent.listEvent;
////                alert(JSON.stringify(voteEvent.listEvent));
//                $scope.$broadcast('scroll.refreshComplete');
//            });
//        }).fail(function () {
//            alert("Vui lòng kết nối mạng và thử lại!");
//        });
//    }
//    else
//        $scope.listEvent = voteEvent.listEvent;
//}
////        $.ajax({
////            url: PARSE + "onLoadVoteEvent",
////            method: "POST",
////            headers: {
////                "X-Parse-Application-Id": "WsJgVbuQIuDIIU5jddWimWU7Qvgki0cRlASgBQ1Z",
////                "X-Parse-REST-API-Key": "QEHmL7MTKtYvD81DBokbrvxde4mydTApl8SRJNRw",
////                "Content-Type": "application/json"
////            },
////            timeout: TIMEOUT_HTTP,
////            data: "{}",
////            success: function (data) {
////                $scope.$apply(function ()
////                {
////                    voteEvent.listEvent = data.result;
////                    $scope.listEvent = voteEvent.listEvent;
////                });
////            },
////            error: function () {
////                alert("Vui lòng kết nối mạng và thử lại!");
////            }
////        });
//
//module.controller('chooseEventController', function ($scope, $state) {
//    $scope.doRefreshListEvent = function ()
//    {
//        voteEvent = null;
//        getListEvent($scope);
//    };
//
//    $scope.reloadRoute = function () {
//        $route.reload();
//    };
//    $scope.des = ["Đã bình chọn", "Đã bình chọn", "Chưa bình chọn"];
//
//    $scope.isMoreEvent = true;
//    $scope.listEvent = [];
//    $scope.pagess = 1;
//
//
//    $scope.loadMoreEvent = function () {
//        $.post(PARSE + "onLoadVoteEvent", {userId: userId, session: session, begin: 0, end: $scope.pagess}).done(function (json) {
//            $scope.$apply(function ()
//            {
//                voteEvent.listEvent = json.result;
//                $scope.listEvent = voteEvent.listEvent;
//                $scope.$broadcast('scroll.infiniteScrollComplete');
//                $scope.pagess += 2;
//            });
//        }).fail(function () {
//            $scope.isMoreEvent = false;
//            alert("Vui lòng kết nối mạng và thử lại!");
//        });
//    };
//
//////    getListEvent($scope);
////    $scope.$on('$stateChangeSuccess', function () {
////        $scope.loadMore();
////    });
//
//    $scope.showDetail_even = function (index) {
//        var selectedVoteItem = voteEvent.listEvent[index];
//        voteEvent.selectedItem = selectedVoteItem;
//        if (selectedVoteItem.status == 2) {
//            $state.go('event_detail_false', {});
//        } else
//            $state.go('event_detail_true', {});
//    };
//});
////***********chooseEventController*****************
//
////***********eventDetailTrueController*****************
//module.controller('eventDetailTrueController', function ($scope, goBackViewWithName) {
//    $scope.eventDetail = voteEvent.selectedItem;
//    $scope.$on("$locationChangeSuccess", function ()
//    {
//        var pieData = {};
//        var item = voteEvent.selectedItem;
//        var a = parseFloat(item.like);
//        var b = parseFloat(item.unlike);
//        var pieData = [
//            {
//                value: a,
//                color: "#0070c0",
//                label: "Đồng ý"
//            },
//            {
//                value: b,
//                color: "#c0504d",
//                label: "Không đồng ý"
//            }
//        ];
//        $scope.notePie = [parseInt(a * 100 / (a + b)), parseInt(b * 100 / (a + b))];
//
//        Chart.defaults.global.animation = false;
//        Chart.defaults.global.responsive = true;
//        var ctx = document.getElementById("chart-area").getContext("2d");
//        window.myPie = new Chart(ctx).Pie(pieData);
//    });
//    $scope.back = function () {
//        goBackViewWithName('event');
//    };
//});
////    $scope.showEvent = function () {
////        $state.go('event_detail_false', {});
////    };
////***********eventDetailTrueController*****************
//
////***********eventDetailFalseController*****************
//module.controller('eventDetailFalseController', function ($scope, $ionicPopup, $ionicModal, $state) {
//    $scope.txtVote = {
//        value: ''
//    };
//    $scope.eventDetailFalse = voteEvent.selectedItem;
//    $ionicModal.fromTemplateUrl('templates/FBModalTextbox.html', {
//        scope: $scope,
//        focusFirstInput: true,
//        animation: 'slide-in-up'
//    }).then(function (modal)
//    {
//        $scope.modal = modal;
//    });
//    $scope.$on('$destroy', function ()
//    {
//        $scope.modal.remove();
//    });
//    $scope.popOverText = function ()
//    {
//        $scope.modal.show();
//        document.getElementById("modalTxtArea").value = $scope.txtVote.value;
//    };
//    $scope.submit = function ()
//    {
//        $scope.txtVote.value = document.getElementById("modalTxtArea").value;
//        $scope.modal.hide();
//    };
//
//    $scope.finish_event = function ()
//    {
//        var valOfRadio = $('input[name=group]:checked').val();
//        var textOfTextarea = $scope.txtVote.value;
//        if (valOfRadio !== voteEvent.selectedItem.status || textOfTextarea) {
//            var alertEvent = $ionicPopup.show({
//                title: 'Thông Báo',
//                template: 'Bạn có muốn lưu bình chọn của mình hay không?',
//                scope: $scope,
//                buttons: [
//                    {text: 'Không'},
//                    {
//                        text: '<b>OK</b>',
//                        type: 'button-positive',
//                        onTap: function () {
//                            alertEvent.close();
//                            $.post(PARSE + "voteEvent", {userId: userId, session: session, status: valOfRadio, eventId: voteEvent.selectedItem.eventId, content: textOfTextarea}).done(function (json) {
//                                alert(JSON.stringify(json));
//                                $scope.$apply(function ()
//                                {
//                                    if (voteEvent.selectedItem.status == 2) {
//                                        if (valOfRadio == 1)
//                                            voteEvent.selectedItem.like++;
//                                        else
//                                            voteEvent.selectedItem.unlike++;
//                                    } else if ((voteEvent.selectedItem.status == 1) && (valOfRadio == 0)) {
//                                        voteEvent.selectedItem.like--;
//                                        voteEvent.selectedItem.unlike++;
//                                    } else if ((voteEvent.selectedItem.status == 0) && (valOfRadio == 1)) {
//                                        voteEvent.selectedItem.like++;
//                                        voteEvent.selectedItem.unlike--;
//                                    }
//                                    voteEvent.selectedItem.status = valOfRadio;
//                                    $state.go('event_detail_true');
//                                });
//                            }).fail(function () {
//                                alert("Vui lòng kết nối mạng và thử lại!");
//                            });
//                        }
//                    }
//                ]
//            });
//        } else {
//            $ionicPopup.show({
//                title: 'Thông Báo',
//                template: 'Bạn chưa bình chọn,đóng góp ý kiến hoặc không thay đổi nội dung',
//                buttons: [{text: 'Ok'}]
//            });
//        }
//    };
//});
////***********eventDetailTrueController*****************
//// ################### NGOCTT12
//
