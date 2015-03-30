
// *********************** NGOCTT 12
//***********chooseEventController*****************
var voteEvent = [];
var isMoreEvent = false;
var pageVoteEvent = 0;

module.controller('chooseEventController', function ($scope, $state, $ionicPopup) {
    $scope.des = ["Chưa bình chọn", "Đã bình chọn", "Đã bình chọn"];
    $.post(PARSE + "onLoadVoteEvent", {userId: userId, session: session, begin: 0, end: maxPage}).done(function (json) {
        $scope.$apply(function ()
        {
            voteEvent.listEvent = json.result;
            $scope.listEvent = voteEvent.listEvent;
            pageVoteEvent = maxPage;
            isMoreEvent = true;
        });
    }).fail(function (er) {
        $ionicPopup.show({
            title: 'Thông Báo',
            template: "Không thể kết nối đến máy chủ" + JSON.stringify(er),
            buttons: [{text: 'Ok'}]
        });
    });

    $scope.doRefreshListEvent = function ()
    {
        $.post(PARSE + "onLoadVoteEvent", {userId: userId, session: session, begin: 0, end: maxPage}).done(function (json) {
            $scope.$apply(function ()
            {
                voteEvent.listEvent = json.result;
                $scope.listEvent = voteEvent.listEvent;
                $scope.$broadcast('scroll.refreshComplete');
                pageVoteEvent = maxPage;
                isMoreEvent = true;
            });
        }).fail(function (er) {
            $ionicPopup.show({
                title: 'Thông Báo',
                template: "Không thể kết nối đến máy chủ" + JSON.stringify(er),
                buttons: [{text: 'Ok'}]
            });
        });
    };

    $scope.loadMoreEvent = function () {
        $.post(PARSE + "onLoadVoteEvent", {userId: userId, session: session, begin: pageVoteEvent, end: pageVoteEvent + maxPage}).done(function (json) {
            $scope.$apply(function ()
            {
                if (json.result.length > 0) {
                    voteEvent.listEvent = voteEvent.listEvent.concat(json.result);
                    $scope.listEvent = voteEvent.listEvent;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    pageVoteEvent += maxPage;
                } else {
                    isMoreEvent = false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            });
        }).fail(function (er) {
            $ionicPopup.show({
                title: 'Thông Báo',
                template: "Không thể kết nối đến máy chủ" + JSON.stringify(er),
                buttons: [{text: 'Ok'}]
            });
        });
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
//***********eventDetailTrueController*****************

//***********eventDetailFalseController*****************
module.controller('eventDetailFalseController', function ($scope, $ionicPopup, $ionicModal, $state) {
    $scope.updateEditor = function (elementId)
    {
        resizeTextArea(elementId);
    };
    $scope.eventDetailFalse = voteEvent.selectedItem;

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
