'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngRoute', 'myApp.map'])

.run(['$route', function ($route) {
        addToHomescreen();
    }])

.config(function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/map'});
});

