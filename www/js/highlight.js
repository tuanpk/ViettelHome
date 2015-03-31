var listHighlightEvent;
var currentHighlightEvent;
var listImages;
module.controller('HLController', function ($scope, $state)
{
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
    $scope.statusLoadmore = true;
    var curIndexLoaded = 0;
    var init = false;
    $scope.loadMore = function ()
    {
        var curLengthEvents = 0;
        if (listHighlightEvent)
            curLengthEvents = listHighlightEvent.length;
        getHighlightEvents($scope, curIndexLoaded, curIndexLoaded + 5);
        curIndexLoaded += 5;
        if (curLengthEvents < listHighlightEvent.length)
            $scope.statusLoadmore = true;
        else
            $scope.statusLoadmore = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.resize');
    }
    $scope.doRefresh = function ()
    {
        curIndexLoaded = 0;
        listHighlightEvent = null;
        $scope.loadMore();
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.pushPage = function (id)
    {
        currentHighlightEvent = getHighlightObjectById(id);
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
    var loadedImage = false;
    $scope.statusLoadmore = true;
    var curIndexLoaded = 2;
    $scope.title = currentHighlightEvent.title;

    $scope.loadMoreImages = function ()
    {
        if (!loadedImage)
        {
            getListImageItem($scope);
            loadedImage = true;
        }
        if (currentHighlightEvent.rows[curIndexLoaded])
        {
            $scope.rows.push(currentHighlightEvent.rows[curIndexLoaded++]);
            $scope.statusLoadmore = true;
        }
        else
            $scope.statusLoadmore = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.resize');
    };
    $scope.doRefresh = function ()
    {
        loadedImage = false;
        curIndexLoaded = 2;
        $scope.loadMoreImages();
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.showDetail = function (index, colIndex)
    {
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
    $scope.videos = currentHighlightEvent.link;
    $scope.loadVideo = function ()
    {
//        loadVideo();
    };
});

// Loinv7 at 25/03/15
//Get list image item by curent index highlight
function getListImageItem($scope)
{
    $scope.rows = [];
    currentHighlightEvent.rows = [];
    var j = 0;
    for (var i = 0; i < currentHighlightEvent.link.length; i++)
    {
        currentHighlightEvent.rows.push(
                {
                    cells:
                            [
                                {
                                    url: currentHighlightEvent.link[i].url
                                },
                                {
                                    url: currentHighlightEvent.link[++i].url
                                }
                            ]
                });
        if (j < 2 && currentHighlightEvent.rows[j])
        {
            $scope.rows.push(currentHighlightEvent.rows[j++]);
        }
    }
}

function getHighlightEvents($scope, begin, end)
{
    if (!listHighlightEvent)
    {
        listHighlightEvent = {};
        listHighlightEvent.items = [];
        $scope.items = [];
    }
    $.post(PARSE + "onLoadHighlightEvent", {userId: userId, session: session, begin: begin, end: end})
            .done(function (data)
            {
                if (data.result.length > 0)
                {
                    $scope.$apply(function ()
                    {
                        listHighlightEvent.items = listHighlightEvent.items.concat(data.result);
                        $scope.items = $scope.items.concat(data.result);
                    });
                }
            }).fail(function (err)
    {
        alert('Xin hãy kiểm tra lại kết nối');
    });
    $scope.items = listHighlightEvent.items;
}
function getHighlightObjectById(id)
{
    for (var i = 0; i < listHighlightEvent.items.length; i++)
    {
        if (listHighlightEvent.items[i].highlightId === id)
            return listHighlightEvent.items[i];
    }
}