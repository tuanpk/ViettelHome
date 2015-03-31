var userId = '';
var session = '';
var userName = '';
var fullName = '';
var department = '';
var maxPage = 10;

// var PARSE = "https://api.parse.com/1/functions/";
var PARSE = "http://125.235.4.243:8080/ViettelHomeBackend/";
var Parse_Application_Id = "WsJgVbuQIuDIIU5jddWimWU7Qvgki0cRlASgBQ1Z";
var Parse_JavaScript_Key = "ae5Hamlae6uX6Cst41sKlL1wSxUjisCmstdLfr61";
var Parse_REST_API_Key = "QEHmL7MTKtYvD81DBokbrvxde4mydTApl8SRJNRw";
var Parse_Client_Key = "iLdrDDbY0phsr3tqgVk0N2LmxqG1ffk447cw7L0t";

var TIMEOUT_HTTP = 30000;

var DEBUG = true;

//var module = angular.module('starter.controllers', []);
var dataOpinion = [];

//function alert(message) {
//    if(DEBUG)
//        window.alert(message);
//}

function mapsApiReady() {
//    alert('Google maps api Ready');
}

function addScript(url, callback) {
    var script = document.createElement('script');
    if (callback)
        script.onload = callback;
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
}

function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function validText(idText, name)
{
    var inputText = document.getElementById(idText);
    if (inputText == null || inputText.value == "") {
        $ionicPopup.show({
            title: 'Thông Báo',
            template: name + " chưa được nhập!",
            buttons: [{text: 'Ok'}]
        });
        return false;
    }
    else
        return true;
}

module.controller('AppController', function ($scope, $location, $state) {
});

module.controller('BlankController', function ($scope, $location, $state) {
    if (session != '') {
        console.log("Already logged in. open Main page");
        $state.go('main');
    } else {
        console.log("Not Login. open Login page");
        $state.go('main_login');
    }
});

module.controller('LoginController', function ($scope, $location, $state, $ionicLoading, $ionicPopup)
{
    $scope.login = function () {
        if (!validText("username", "Email")) {
        } else if (!validText("password", "Mật khẩu")) {
        }
        else {
            $ionicLoading.show({
                template: '<i class="icon ion-load-a button-positive" style="font-size: 100%">Đang xác thực đến máy chủ</i>',
                noBackdrop: false,
                duration: TIMEOUT_HTTP
            });

            addScript('http://maps.googleapis.com/maps/api/js?key=AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es&sensor=true&callback=mapsApiReady', function () {
                console.log('addScript onload');
            });
//            if(ionic.Platform.isWindowsPhone()) {
//                loadjscssfile('http://code.ionicframework.com/ionicons/1.4.1/css/ionicons.min.css','css');
//            }
            console.log($location.path());
            userName = document.getElementById("username").value;

            if(userName.indexOf("@viettel.com.vn")<0) userName=userName.concat("@viettel.com.vn");
            
            var password = document.getElementById("password").value;
            $.post(PARSE + "login", {username: userName, password: password}).done(function (json) {
                $ionicLoading.hide();
                userId = json.result[0].userId;
                session = json.result[0].session;
                fullName = json.result[0].fullname;
                department = json.result[0].department;
                $state.go('main');
            }).fail(function (err) {
                $ionicLoading.hide();
                $ionicPopup.show({
                    title: 'Thông Báo',
                    template: "Login Error " + JSON.stringify(err),
                    buttons: [{text: 'Ok'}]
                });
                $state.go('main');
            });
        }
    };
});

module.controller('MainController', function ($scope, $state, $ionicPopup, $ionicModal, $ionicPopover)
{
    $ionicModal.fromTemplateUrl('templates/main_modal.html', {
        animation: 'slide-in-up',
        scope: $scope,
        backdropClickToClose: true,
        hardwareBackButtonClose: true
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/setting_popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.pop_title = "Cài đặt";

    $.post(PARSE + "onLoadReplyFeedback", {userId: userId, session: session, begin: 0, end: maxPage}).done(function (json) {
        var notify_feedback = 0;
        dataAdminFeedback = json.result;
        for (var i = 0; i < dataAdminFeedback.length; i++) {
            if (dataAdminFeedback[i].status == 2) {
                notify_feedback++;
            }
        }
        $scope.notify_feedback = notify_feedback;
    }).fail(function (er) {
        console.log("Không thể kết nối đến máy chủ" + JSON.stringify(er));
    })
    
    $.post(PARSE + "onLoadVoteEvent", {userId: userId, session: session, begin: 0, end: maxPage}).done(function (json) {
        voteEvent.listEvent = json.result;
        var notify_event = 0;
        for (var i = 0; i < voteEvent.listEvent.length; i++) {
            if (voteEvent.listEvent[i].state == 0) {
                notify_event++;
            }
        }
        $scope.notify_event = notify_event;
    }).fail(function (er) {
        console.log("Không thể kết nối đến máy chủ" + JSON.stringify(er));
    });

    if (store != null) {
        store.all(function (json) {
            $scope.notify_history = json.length;
        });
    }

    $scope.settings = function (i) {
        $scope.popover.hide();
        switch (i) {
            case -1:
                userId = '';
                session = '';
                $state.go('main_login');
                break;
            case 0:
                $ionicPopup.show({
                    title: 'Thông Báo',
                    template: "Nhận thông báo?",
                    buttons: [{text: 'Ok'}]
                });
                break;
            default:
                break;
        }
    };
    $scope.opinion = function () {
        $state.go('admin_feedback');
    };
    $scope.history = function () {
        $state.go('main_history');
    };

    $scope.onLoadSologan = function () {
//        alert("onLoadSologan");
    };

    $scope.showScreen = function (i) {
        switch (i) {
            case 1:
                $state.go('feedback');
                break;
            case 2:
                $state.go('event');
                break;
            case 3:
                $state.go('highlight');
                break;
            default:
                alert("NOT FOUND showScreen " + i);
                break;
        }
    };
});

var isLoadMoreOpinion = false;
var pageOpinion = 0;
module.controller('OpinionController', function ($scope, $state, $ionicModal, $ionicPopup, $ionicPopover) {
    $.post(PARSE + "onLoadReplyFeedback", {userId: userId, session: session, begin: 0, end: maxPage}).done(function (json) {
        $scope.$apply(function () {
            dataOpinion = json.result;
            $scope.dataOpinion = dataOpinion;
            pageOpinion = maxPage;
            isLoadMoreOpinion = true;
        });
    }).fail(function (er) {
        $ionicPopup.show({
            title: 'Thông Báo',
            template: "Không thể kết nối đến máy chủ" + JSON.stringify(er),
            buttons: [{text: 'Ok'}]
        });
    })
    $scope.doRefreshOpinion = function ()
    {
        $.post(PARSE + "onLoadReplyFeedback", {userId: userId, session: session, begin: 0, end: maxPage}).done(function (json) {
            $scope.$apply(function () {
                dataOpinion = json.result;
                $scope.dataOpinion = dataOpinion;
                $scope.$broadcast('scroll.refreshComplete');
                pageOpinion = maxPage;
                isLoadMoreOpinion = true;
            });
        }).fail(function (er) {
            $ionicPopup.show({
                title: 'Thông Báo',
                template: "Không thể kết nối đến máy chủ" + JSON.stringify(er),
                buttons: [{text: 'Ok'}]
            });
        })
    };

    $ionicModal.fromTemplateUrl('templates/main_modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/main_popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.pop_title = "Lọc dữ liệu";

    $scope.filters = [
        {
            id: 1,
            title: 'Tất cả'
        },
        {
            id: 2,
            title: 'Đã trả lời'
        },
        {
            id: 3,
            title: 'Chưa trả lời'
        }
    ];

    $scope.settings = function (i) {
        $scope.popover.hide();
        var id = $scope.filters[i].id;

        var k = dataOpinion.length;
        switch (id) {
            case 1:
                $scope.opinions = dataOpinion;
                $state.go('main_opinion', {}, {reload: true});
                break;
            case 2:
                $scope.opinions = [];
                for (var j = 0; j < k; j++) {
                    if (dataOpinion[j].status == 1)
                        $scope.opinions.push(dataOpinion[j]);
                }
                $state.go('main_opinion', {}, {reload: true});
                break;
            case 3:
                $scope.opinions = [];
                for (var j = 0; j < k; j++) {
                    if (dataOpinion[j].status == 2)
                        $scope.opinions.push(dataOpinion[j]);
                }
                $state.go('main_opinion', {}, {reload: true});
                break;
            default:
                break;
        }
    };

    $scope.opinionReply = function (index) {
        var selectedItem = dataOpinion[index];
        dataOpinion.selectedItem = selectedItem;
        $state.go('main_opinion_reply');
    };
});

module.controller('OpinionReplyController', function ($scope, $state, $ionicPopup) {
    $scope.item = dataOpinion.selectedItem;
    $scope.comments = dataOpinion.selectedItem.comment;

    $scope.finish_OpinionReply = function () {
        var txtOpinionReply = $('textarea#txtOpinionReply').val();
        var time = new Date();
        var timeparse = parseInt(time.getTime() / 1000);
        if (txtOpinionReply) {
            var alertOpinionReply = $ionicPopup.show({
                title: 'Thông Báo',
                template: 'Bạn có chắc chắn muốn gửi ý kiến?',
                buttons: [{text: 'Không'},
                    {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onTap: function () {
                            alertOpinionReply.close();
                            $.post(PARSE + "replyFeedback",
                                    {userId: userId,
                                        session: session,
                                        feedbackId: dataOpinion.selectedItem.feedbackId,
                                        department: dataOpinion.selectedItem.department,
                                        content: txtOpinionReply,
                                        time: timeparse,
                                        patternId: 0
                                    }).done(function (json) {
                                $scope.$apply(function ()
                                {
                                    var comment_new = {
                                        commentId: json.commentId,
                                        content: txtOpinionReply,
                                        time: timeparse};
                                    $scope.$apply(function () {
                                        dataOpinion.selectedItem.comment.push(comment_new);
                                        $state.go('main_opinion_reply', {}, {reload: true});
                                    });
                                });
                            }).fail(function (er) {
                                $ionicPopup.show({
                                    title: 'Thông Báo',
                                    template: "Không thể kết nối đến máy chủ" + JSON.stringify(er),
                                    buttons: [{text: 'Ok'}]
                                });
                            });
                        }
                    }
                ]
            });
        } else {
            $ionicPopup.show({
                title: 'Thông Báo',
                template: 'Bạn chưa nhập ý kiến',
                buttons: [{text: 'Ok'}]
            });
        }
    };

    $scope.showPopup = function () {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: 'Bạn có muốn nội dung hay không?',
            title: 'Thông báo',
//            subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.wifi) {
                            e.preventDefault();
                        } else {
                            return $scope.data.wifi;
                        }
                    }
                },
            ]
        });
        myPopup.then(function (res) {
            console.log('Tapped!', res);
        });
    };

    // A confirm dialog
    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Consume Ice Cream',
            template: 'Are you sure you want to eat this ice cream?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };

    // An alert dialog
    $scope.showAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Don\'t eat that!',
            template: 'It might taste good'
        });
        alertPopup.then(function (res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };
});

var isMoreHistory = true;
//history*************
module.controller('HistoryCtr', function ($scope, $ionicModal, $ionicPopover) {
    $ionicModal.fromTemplateUrl('templates/main_modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/main_popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.pop_title = "Lọc dữ liệu";

    $scope.filters = [
        {
            id: 1,
            title: 'Tất cả'
        },
        {
            id: 2,
            title: 'Đã gửi'
        },
        {
            id: 3,
            title: 'Đang gửi'
        },
        {
            id: 4,
            title: 'Gửi lỗi'
        }
    ];

    $scope.settings = function (i) {
        $scope.modal.hide();
        alert($scope.filters[i].title);
    };

    if (store != null) {
        store.all(function (json) {
            $scope.historys = json;
            $scope.$apply();
        });
    }

    $scope.historys = [];
    $scope.statusText = ['Có lỗi xảy ra!', 'Đã gửi thành công', 'Đang gửi...'];
    $scope.statusIcon = ['ion-information-circled', 'ion-checkmark-round', 'ion-paper-airplane'];
    $scope.fileIcon = ['ion-document-text', 'ion-images', 'ion-videocamera'];

    $scope.refreshHistory = function () {
        if (store != null) {
            store.all(function (json) {
                $scope.historys = json;
                $scope.$broadcast('scroll.refreshComplete');
                if ($scope.historys.length >= 5) {
                    isMoreHistory = false;
                } else if ($scope.historys.length === 0) {
                    isMoreHistory = false;
                }
            });
        }
    };
    $scope.loadMoreHistory = function () {
        if (store != null) {
            store.all(function (json) {
                $scope.historys = json;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if ($scope.historys.length >= 5) {
                    isMoreHistory = false;
                } else if ($scope.historys.length === 0) {
                    isMoreHistory = false;
//                    alert('Bạn chưa gửi phản ánh nào');
                }
            });
        }
    };
//    $scope.$on('$stateChangeSuccess', function () {
//        $scope.loadMoreHistory();
//    });
    $scope.moreHistoryCanBeLoaded = function () {
        return isMoreHistory;// $scope.historys.length < 5;
        // isMoreHistory = false when finish load Ajax
    };
});
//history*************