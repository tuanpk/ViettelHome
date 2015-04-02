
//function TextView() {
//}
//TextView.prototype.init = function (successCallback, errorCallback, frame)
//{
//    cordova.exec(
//            successCallback,
//            errorCallback,
//            'TextView',
//            'init',
//            [frame]
//            );
//};
//TextView.prototype.setFrame = function (successCallback, errorCallback, frame)
//{
//    cordova.exec(
//            successCallback,
//            errorCallback,
//            'TextView',
//            'setFrame',
//            [frame]
//            );
//};
//TextView.prototype.hidden = function (successCallback, errorCallback)
//{
//    cordova.exec(
//            successCallback,
//            errorCallback,
//            'TextView',
//            'hidden', []
//            );
//};
//TextView.prototype.show = function (successCallback, errorCallback, frame)
//{
//    cordova.exec(
//            successCallback,
//            errorCallback,
//            'TextView',
//            'show', [frame]
//            );
//};
//TextView.prototype.destroy = function (successCallback, errorCallback)
//{
//    cordova.exec(
//            successCallback,
//            errorCallback,
//            'TextView',
//            'destroy', []
//            );
//};
//TextView.prototype.getValueTextView = function (successCallback, errorCallback)
//{
//    cordova.exec(
//            successCallback,
//            errorCallback,
//            'TextView',
//            'getValueTextView', []
//            );
//};
//TextView.prototype.clearText = function (successCallback, errorCallback)
//{
//    cordova.exec(
//            successCallback,
//            errorCallback,
//            'TextView',
//            'clearText', []
//            );
//};

var TextView={
    init:function (successCallback, errorCallback, frame)
    {
        cordova.exec(
                successCallback,
                errorCallback,
                'TextView',
                'init',
                [frame]
                );
    },
    setFrame: function (successCallback, errorCallback,frame)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'TextView',
                            'setFrame',
                            [frame]
                            );
               },
               hidden: function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'TextView',
                            'hidden',[]
                            );
               },
               show: function (successCallback, errorCallback,frame)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'TextView',
                            'show',[frame]
                            );
               },
               destroy: function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'TextView',
                            'destroy',[]
                            );
               },
               getValueTextView: function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'TextView',
                            'getValueTextView',[]
                            );
               },
               clearText: function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'TextView',
                            'clearText',[]
                            );
               }
}

TextView.install = function () {
    if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.textView = TextView;
    return window.plugins.textView;
};

cordova.addConstructor(TextView.install);

//Ko dung dk
//var TextView={
//    init:function (successCallback, errorCallback, frame)
//    {
//        cordova.exec(
//                successCallback,
//                errorCallback,
//                'TextView',
//                'init',
//                [frame]
//                );
//    },
//    setFrame: function (successCallback, errorCallback,frame)
//               {
//               cordova.exec(
//                            successCallback,
//                            errorCallback,
//                            'TextView',
//                            'setFrame',
//                            [frame]
//                            );
//               },
//               hidden: function (successCallback, errorCallback)
//               {
//               cordova.exec(
//                            successCallback,
//                            errorCallback,
//                            'TextView',
//                            'hidden',[]
//                            );
//               },
//               show: function (successCallback, errorCallback,frame)
//               {
//               cordova.exec(
//                            successCallback,
//                            errorCallback,
//                            'TextView',
//                            'show',[frame]
//                            );
//               },
//               destroy: function (successCallback, errorCallback)
//               {
//               cordova.exec(
//                            successCallback,
//                            errorCallback,
//                            'TextView',
//                            'destroy',[]
//                            );
//               },
//               getValueTextView: function (successCallback, errorCallback)
//               {
//               cordova.exec(
//                            successCallback,
//                            errorCallback,
//                            'TextView',
//                            'getValueTextView',[]
//                            );
//               },
//               clearText: function (successCallback, errorCallback)
//               {
//               cordova.exec(
//                            successCallback,
//                            errorCallback,
//                            'TextView',
//                            'clearText',[]
//                            );
//               }
//}
//module.export=TextView;