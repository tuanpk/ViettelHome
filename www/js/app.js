// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var module = angular.module('starter', ['ionic', 'pascalprecht.translate']);


module.config(function ($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider, $translateProvider)
{
    $ionicConfigProvider.views.maxCache(30);
    $ionicConfigProvider.templates.maxPrefetch(30);
    $ionicConfigProvider.views.transition("none");
//    $ionicConfigProvider.views.forwardCache(true);
//    alert('angular ionic ready');
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    /// Change language

//        $translateProvider.fallbackLanguage("en");
    $translateProvider.useStaticFilesLoader({
        prefix: 'lang/lang-',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage("vi");
    $stateProvider
            // singin
            .state('main_login', {
                url: '/main_login',
                templateUrl: 'templates/main_login.html',
                controller: 'LoginController'
            })
            // the pet tab has its own child nav-view and history
            .state('main', {
                url: '/main',
                templateUrl: 'templates/main.html',
                controller: 'MainController'
            })
            .state('main_opinion', {
                url: '/main-opinion',
                templateUrl: 'templates/main_opinion.html',
                controller: 'OpinionController'
            })
            .state('main_opinion_reply', {
                url: '/main_opinion_reply',
                templateUrl: 'templates/main_opinion_reply.html',
                controller: 'OpinionReplyController'
            })
            .state('main_history', {
                url: '/main_history',
                templateUrl: 'templates/main_history.html',
                controller: 'HistoryCtr'
            })
            //Event
            .state('event', {
                url: '/event',
                templateUrl: 'templates/event.html',
                controller: 'chooseEventController'
            })
            .state('event_detail_false', {
                url: '/event_detail_false',
                templateUrl: 'templates/event_detail_false.html',
                controller: 'eventDetailFalseController'
            })
            .state('event_detail_true', {
                url: '/event_detail_true',
                templateUrl: 'templates/event_detail_true.html',
                controller: 'eventDetailTrueController'
            })
            //FeedBack Event
            .state('feedback', {
                url: '/feedback',
                templateUrl: 'templates/feedback.html',
                controller: 'FeedbackController'
            })
            .state('feedback_department', {
                url: '/feedback_department',
                templateUrl: 'templates/feedback_department.html',
                controller: 'FBDepartmentCtr'
            })
            .state('feedback_location', {
                url: '/feedback_location',
                templateUrl: 'templates/feedback_location.html',
                controller: 'FeedbackLocationController'
            })
            .state('feedback_map', {
                url: '/feedback_map',
                templateUrl: 'templates/feedback_map.html',
                controller: 'FBMapCtrl'
            })
            //HighLight Event
            .state('highlight', {
                url: '/highlight',
                templateUrl: 'templates/highlight.html',
                controller: 'HLController'
            })
            .state('highlight_listview', {
                url: '/highlight_listview',
                templateUrl: 'templates/highlight_listview.html',
                controller: 'HLListViewController'
            })
            .state('highlight_image', {
                url: '/highlight_image',
                templateUrl: 'templates/highlight_image.html',
                controller: 'HLImageDetailController'
            })
            .state('highlight_text', {
                url: '/highlight_text',
                templateUrl: 'templates/highlight_text.html',
                controller: 'HLTruyenThongController'
            })
            .state('highlight_video', {
                url: '/highlight_video',
                templateUrl: 'templates/highlight_video.html',
                controller: 'HLVideoController'
            })
            //feedback_admin
            .state('admin_feedback', {
                url: '/admin_feedback',
                templateUrl: 'templates/admin_feedback.html',
                controller: 'AdminFeedBackCtr'
            })
            .state('admin_feedback_department', {
                url: '/admin_feedback_department',
                templateUrl: 'templates/admin_feedback_department.html',
                controller: 'AdminFeedBackDepartmentCtr'
            })
            .state('admin_feedback_forward', {
                url: '/admin_feedback_forward',
                templateUrl: 'templates/admin_feedback_forward.html',
                controller: 'AdminFeedBackForwardCtr'
            })
            .state('admin_feedback_reply', {
                url: '/admin_feedback_reply',
                templateUrl: 'templates/admin_feedback_reply.html',
                controller: 'AdminFeedBackReplyCtr'
            })
            .state('admin_feedback_comment', {
                url: '/admin_feedback_comment',
                templateUrl: 'templates/admin_feedback_comment.html',
                controller: 'AdminFeedBackComment'
            });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/main_login');

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
    // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
});

