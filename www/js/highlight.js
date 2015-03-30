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
    $scope.items = listImages.link;
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
    if (!listImages)
    {
        listImages = {};
        listImages.rows = [];
        listImages.link =[
                {
                    "name": "tfss-0a1099cc-2a23-4fd2-a0da-d489c22189ca-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-0a1099cc-2a23-4fd2-a0da-d489c22189ca-feedback_image.jpg"
                },
                {
                    "name": "tfss-e23e9388-646f-492f-b98d-7c75f08f8973-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-e23e9388-646f-492f-b98d-7c75f08f8973-feedback_image.jpg"
                },
                {
                    "name": "tfss-8570d638-1870-419e-898a-275d0dbdb3a8-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-8570d638-1870-419e-898a-275d0dbdb3a8-feedback_image.jpg"
                },
                {
                    "name": "tfss-95535d66-155d-408e-b15e-16ec155fc899-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-95535d66-155d-408e-b15e-16ec155fc899-feedback_image.jpg"
                },
                {
                    "name": "tfss-f6ca316f-0f09-421e-9366-533728da7b75-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-f6ca316f-0f09-421e-9366-533728da7b75-feedback_image.jpg"
                },
                {
                    "name": "tfss-0166cb10-7faf-4b47-b4a3-1b0bd9995443-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-0166cb10-7faf-4b47-b4a3-1b0bd9995443-feedback_image.jpg"
                },
                {
                    "name": "tfss-b657051b-89e2-44c6-8642-d3e33253ce49-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-b657051b-89e2-44c6-8642-d3e33253ce49-feedback_image.jpg"
                },
                {
                    "name": "tfss-d9544353-4235-468a-9cfd-10dc5e6e8431-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-d9544353-4235-468a-9cfd-10dc5e6e8431-feedback_image.jpg"
                },
                {
                    "name": "tfss-87bc46f6-90d1-417a-afc8-1cf80d0250d0-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-87bc46f6-90d1-417a-afc8-1cf80d0250d0-feedback_image.jpg"
                },
                {
                    "name": "tfss-b81ade70-4ccf-4529-be15-d6975e88d279-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-b81ade70-4ccf-4529-be15-d6975e88d279-feedback_image.jpg"
                },
                {
                    "__type": "File",
                    "name": "tfss-4c149795-8335-4d50-9b0f-679b17f3f2bc-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-4c149795-8335-4d50-9b0f-679b17f3f2bc-feedback_image.jpg"
                },
                {
                    "name": "tfss-3bf3386a-812c-4941-a0c3-840c11fa7bb0-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-3bf3386a-812c-4941-a0c3-840c11fa7bb0-feedback_image.jpg"
                },
                {
                    "name": "tfss-41c6fd94-0f2b-482c-8152-8d0a6c5a19df-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-41c6fd94-0f2b-482c-8152-8d0a6c5a19df-feedback_image.jpg"
                },
                {
                    "name": "tfss-62b8aef5-4f8d-4586-864b-2d20346e81c8-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-62b8aef5-4f8d-4586-864b-2d20346e81c8-feedback_image.jpg"
                },
                {
                    "name": "tfss-bb225523-802c-4508-97ec-5329993ed222-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-bb225523-802c-4508-97ec-5329993ed222-feedback_image.jpg"
                },
                {
                    "name": "tfss-2375eefd-fde4-4b3f-95be-3014407ff3da-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-2375eefd-fde4-4b3f-95be-3014407ff3da-feedback_image.jpg"
                },
                {
                    "name": "tfss-bef18e63-4a5b-4333-8027-a4f320ff6ddb-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-bef18e63-4a5b-4333-8027-a4f320ff6ddb-feedback_image.jpg"
                },
                {
                    "name": "tfss-3173c0dd-6d24-4e47-9afe-c652ea8639a5-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-3173c0dd-6d24-4e47-9afe-c652ea8639a5-feedback_image.jpg"
                },
                {
                    "name": "tfss-a0ededf7-9f56-48b3-97a1-3a3d837f9572-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-a0ededf7-9f56-48b3-97a1-3a3d837f9572-feedback_image.jpg"
                },
                {
                    "name": "tfss-1aba0b0b-9ae8-4e4d-af45-de4554091d68-feedback_image.jpg",
                    "url": "http://files.parsetfss.com/15723333-8130-4869-8e9e-c359c9a3a944/tfss-1aba0b0b-9ae8-4e4d-af45-de4554091d68-feedback_image.jpg"
                }
            ];
        for (var i = 0; i < listImages.link.length; i++)
        {
            listImages.rows = listImages.rows.concat(
                    [{
                            cells:
                                    [
                                        {
                                            url: listImages.link[i].url
                                        },
                                        {
                                            url: listImages.link[++i].url
                                        }
                                    ]
                        }]);
        }
    }
    $scope.rows = listImages.rows;
}

function getHighlightEvents($scope)
{
    if (!listHighlightEvent)
    {
        listHighlightEvent = {};
        $.post(PARSE + "onLoadHighlightEvent", {userId: userId, session: session, begin: 0, end: 50})
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
    }
    else
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