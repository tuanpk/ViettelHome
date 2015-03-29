var listHighlightEvent;
var currentHighlightEvent;
var listImages;
module.controller('HLController', function ($scope, $state)
{
    getHighlightEvents($scope);
    $scope.title = 'Sự kiện nổi bật';
    $scope.url = [
        {
            name: 'TruyenThong',
            src: "highlight_text"
        },
        {
            name: 'HinhAnh',
            src: "highlight_listview"
        },
        {
            name: 'Video',
            src: "highlight_video"
        }
    ];
    $scope.icons =
            {
                text: 'ion-document-text',
                image: 'ion-camera',
                video: 'ion-videocamera'
            };
    $scope.doRefresh = function ()
    {
        listHighlightEvent = null;
        getHighlightEvents($scope);

    };
    $scope.pushPage = function (id)
    {
        currentHighlightEvent=getHighlightObjectById(id);
        var status = currentHighlightEvent.highlight_type;
        switch (status)
        {
            case 0:
                $state.go("highlight_text", {title: ''});
                break;
            case 1:
                $state.go("highlight_listview", {title: ''});
                break;
            case 2:
                $state.go("highlight_video", {title: ''});
                break;
            default:
                ;
        }
    };
});

module.controller('HLTruyenThongController', function ($scope)
{
    $scope.title = currentHighlightEvent.title;
});
var indexOfUrl;
module.controller('HLListViewController', function ($scope, $state)
{
    $scope.title = currentHighlightEvent.title;
    getListImageItem($scope);
    $scope.doRefresh = function ()
    {
        getListImageItem($scope);
    };
    $scope.showDetail = function (index, colIndex)
    {
//        alert(colIndex);
//        alert(index+colIndex);
        indexOfUrl = index * 2 + colIndex;

        $state.go('highlight_image', {title: ''});
    };
});
module.controller('HLImageDetailController', function ($scope)
{
    $scope.title = currentHighlightEvent.title;
    $scope.indexOfImage = indexOfUrl;
    $scope.items = currentHighlightEvent.link;
    $scope.width = window.innerWidth;
    $scope.height = window.innerHeight;
});
module.controller('HLVideoController', function ($scope, $location, $state)
{
    $scope.title = currentHighlightEvent.title;
    $scope.videos= currentHighlightEvent.link;
    $scope.loadVideo = function ()
    {
//        loadVideo();
    };
});

// Loinv7 at 25/03/15
//Get list image item by curent index highlight
function getListImageItem($scope)
{
        listImages = {};
        listImages.rows = [];
        for (var i = 0; i < currentHighlightEvent.link.length; i++)
        {
            listImages.rows = listImages.rows.concat(
                    [{
                            cells:
                                    [
                                        {
                                            url: currentHighlightEvent.link[i].url
                                        },
                                        {
                                            url: currentHighlightEvent.link[++i].url
                                        }
                                    ]
                        }]);
        }
        $scope.rows = listImages.rows;
}

function getHighlightEvents($scope)
{
    if (!listHighlightEvent)
    {
        listHighlightEvent = {};
        $.post(PARSE + "onLoadHighlightEvent", {userId: userId, session: session,begin: 0, end:50})
                .done(function (data)
                {
                    $scope.$apply(function ()
                    {
                        $scope.$broadcast('scroll.refreshComplete');
                        listHighlightEvent.items = data.result;
                        $scope.items = listHighlightEvent.items;
                    });
                }).fail(function (err)
        {
            listHighlightEvent.items = {};
            alert('Xin hãy kiểm tra lại kết nối');
        });

//        $.ajax({
//            url: PARSE + "onLoadHighlightEvent",
//            method: "POST",
//            headers: {
//                "X-Parse-Application-Id": Parse_Application_Id,
//                "X-Parse-REST-API-Key": Parse_REST_API_Key,
//                "Content-Type": "application/json"
//            },
//            data: "{}",
//            success: function (data) {
////                $ionicLoading.hide();
////                alert(JSON.stringify(data));
////                $state.go('main');
//                $scope.$apply(function ()
//                {
//                    listEvent.items = data.result;
//                    $scope.items = listEvent.items;
//                    listImages.rows = [];
//                    for (var i = 0; i < data.result[2].link.length; i++)
//                    {
//                        listImages.rows = listImages.rows.concat(
//                                [{
//                                        cells:
//                                                [
//                                                    {
//                                                        url: data.result[2].link[i].url
//                                                    },
//                                                    {
//                                                        url: data.result[2].link[++i].url
//                                                    }
//                                                ]
//                                    }]);
//                    }
//                    if($ionicLoading) $ionicLoading.hide();
//                });
//            },
//            error: function (request, status, error) {
////                $ionicLoading.hide();
//                listEvent.rows = {};
//                alert("error request.responseText:" + request.responseText + "\nrequest.status:" + request.status + "\nstatus:" + status + "\nerror:" + error);
////                $state.go('main');
//            }
//        });
    }
    else
        $scope.items = listHighlightEvent.items;
}
function getHighlightObjectById(id)
{
    for(var i=0;i<listHighlightEvent.items.length;i++)
    {
        if(listHighlightEvent.items[i].highlightId===id) return listHighlightEvent.items[i];
    }
}