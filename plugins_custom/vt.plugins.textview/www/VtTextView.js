var VtTextView={
    init:function (successCallback, errorCallback, frame)
    {
        cordova.exec(
                successCallback,
                errorCallback,
                'VtTextView',
                'init',
                [frame]
                );
    },
    setFrame: function (successCallback, errorCallback,frame)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'VtTextView',
                            'setFrame',
                            [frame]
                            );
               },
               hide: function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'VtTextView',
                            'hide',[]
                            );
               },
               show: function (successCallback, errorCallback,frame)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'VtTextView',
                            'show',[frame]
                            );
               },
               destroy: function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'VtTextView',
                            'destroy',[]
                            );
               },
               getText: function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'VtTextView',
                            'getText',[]
                            );
               },
               setText: function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'VtTextView',
                            'setText',[]
                            );
               }
}

VtTextView.install = function () {
    if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.VtTextView = VtTextView;
    return window.plugins.VtTextView;
};

cordova.addConstructor(VtTextView.install);