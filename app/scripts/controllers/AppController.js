"use strict";

var app = angular.module('myApp');

app.controller('AppController', ['$scope', function ($scope) {
    $scope.welcome = 'We are up and running from a required module!';
}]);

