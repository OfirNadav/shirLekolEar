'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngRoute', 'myApp.map'])

.config(function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/map'});
})

.run(['$route', function () {
        addToHomescreen();
    }]);
