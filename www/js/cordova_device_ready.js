/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var store;

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        console.log("cordova device ready");
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.hide();
        }
        app.database();
        app.pushNotify();
    },
    pushNotify: function () {
        parsePlugin.initialize(Parse_Application_Id, Parse_Client_Key, function () {
//            alert('Push Notify initialize Success');

            parsePlugin.getInstallationId(function (id) {
                console.log('InstallationId ' + id);
//                alert('InstallationId ' + id);
            }, function (e) {
                alert('InstallationId error ' + e);
            });

//            parsePlugin.getSubscriptions(function (subscriptions) {
//                alert('Subscriptions ' + subscriptions);
//            }, function (e) {
//                alert('Subscriptions error ' + e);
//            });
//            
            parsePlugin.subscribe('Android', function () {
                console.log('Subscribe Android');
            }, function (e) {
                alert('error');
            });
            //parsePlugin.unsubscribe('Android', function (msg) {
            //    alert('OK');
            //}, function (e) {
            //    alert('error');
            //});
            Parse.initialize(Parse_Application_Id, Parse_JavaScript_Key);
        }, function (e) {
            alert('Push Notify initialize Error ' + e);
        });
    },
    database: function () {
        //    alert('initSqlite Lawnchair');
//        allow restriction omapf adapter in URL (e.g., ?adapter=ie-userdata)
        var allowed = /adapter=([-\w]+)/.exec(window.location.href),
                adapters = Lawnchair.adapters,
                i;

        if (allowed) {
            for (i = 0; i < adapters.length; ) {
                if (adapters[i].adapter == allowed[1]) {
                    i++;
                } else {
                    adapters.splice(i, 1)
                }
            }

            if (adapters.length == 0) {
                alert("no such adapter: " + allowed[1]);
            }

            if (!adapters[0].valid()) {
                alert("adapter " + allowed[1] + " is not valid in this environment");
            }
        }

        // kickup the chair
        store = new Lawnchair({name: 'ViettelHome'}, function () {
//            // create an object
//            var me = {key: 'pangchiu'};
//            // save it
//            store.save(me);
//
//            // access it later... yes even after a page refresh!
//            store.get('pangchiu', function (me) {
//                alert('database ' + JSON.stringify(me));
//            });
        });
        if (DEBUG)
            alert('initSqlite Lawnchair');
    }
};

app.initialize();