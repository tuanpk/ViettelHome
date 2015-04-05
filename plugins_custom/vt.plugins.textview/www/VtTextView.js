var VtTextView = {
    initWithListID: function (successCallback, errorCallback, options)
    {
        cordova.exec(
                successCallback,
                errorCallback,
                'VtTextView',
                'initWithListID',
                [options] //Op tion include id, with ,height
                );
    },
    show: function (successCallback, errorCallback, options) //option: list id se hien ['idname','idname']
    {
        cordova.exec(
                successCallback,
                errorCallback,
                'VtTextView',
                'show', [options]
                );
    },
    hide: function (successCallback, errorCallback, options) //option: list id se an ['idname','idname']
    {
        cordova.exec(
                successCallback,
                errorCallback,
                'VtTextView',
                'hide', [options]
                );
    },
    destroy: function (successCallback, errorCallback)
    {
        cordova.exec(
                successCallback,
                errorCallback,
                'VtTextView',
                'destroy', []
                );
    },
    getText: function (successCallback, errorCallback)
    {
        cordova.exec(
                successCallback,
                errorCallback,
                'VtTextView',
                'getText', []
                );
    },
    setText: function (successCallback, errorCallback, value)
    {
        cordova.exec(
                successCallback,
                errorCallback,
                'VtTextView',
                'setText', [value]
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