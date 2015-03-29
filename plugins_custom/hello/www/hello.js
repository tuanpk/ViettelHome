/*global cordova, module*/

module.exports = {
    login: function (name, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "Hello", "login", [name]);
    }
};

function TextArea() {
}
TextArea.prototype.init= function (successCallback, errorCallback, frame)
    {
        cordova.exec(
                successCallback,
                errorCallback,
                'Hello',
                'init',
                [frame]
                );
    };
               TextArea.prototype.setFrame= function (successCallback, errorCallback,frame)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'Hello',
                            'setFrame',
                            [frame]
                            );
               };
               TextArea.prototype.hidden= function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'Hello',
                            'hidden',[]
                            );
               };
               TextArea.prototype.show= function (successCallback, errorCallback,frame)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'Hello',
                            'show',[frame]
                            );
               };
               TextArea.prototype.destroy= function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'Hello',
                            'destroy',[]
                            );
               };
               TextArea.prototype.getValueTextView= function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'Hello',
                            'getValueTextView',[]
                            );
               };
               TextArea.prototype.clearText= function (successCallback, errorCallback)
               {
               cordova.exec(
                            successCallback,
                            errorCallback,
                            'Hello',
                            'clearText',[]
                            );
               };
               
TextArea.install = function () {
	if (!window.plugins) {
		window.plugins = {};
	}
	window.plugins.textArea = new TextArea();
	return window.plugins.textArea;
};

cordova.addConstructor(TextArea.install);
});

