var app = angular.module('weatherApp', ['ngRoute', 'ngNotify']);

app.run(function($rootScope, ngNotify) {
    $rootScope.loggedIn = false;
    $rootScope.appTitle = "Time Manager App";
    $rootScope.author = "Balogh László";
    $rootScope.company = "Bajai SZC Türr István Technikum | 5/13. szoftverfejlesztő";
    $rootScope.year = "2023-2024.";
    $rootScope.today = new Date();

    $rootScope.emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    $rootScope.passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    
    $rootScope.serverUrl = 'http://localhost:5000';
    $rootScope.appUrl = 'http://127.0.0.1:5500/index.html';
    
    if(sessionStorage.getItem('access_token')){
        $rootScope.loggedIn = true;
        token = JSON.parse(sessionStorage.getItem('access_token'));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    ngNotify.config({
        theme: 'pure',
        position: 'bottom',
        duration: 3000,
        type: 'info',
        sticky: false,
        button: true,
        html: false
    });

});

app.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'Views/login.html',
            controller: 'loginCtrl',
        })
        .when('/register', {
            templateUrl: 'Views/register.html',
            controller: 'loginCtrl'
        })
        .when('/newdata', {
            templateUrl: 'Views/newdata.html',
            controller: 'taskCtrl',
        })
        .when('/table', {
            templateUrl: 'Views/table.html',
            controller: 'taskCtrl',
        })
        .when('/calendar', {
            templateUrl: 'Views/calendar.html',
            controller: 'taskCtrl',
        })
        .when('/chart', {
            templateUrl: 'Views/chart.html',
            controller: 'taskCtrl',
        })
        .when('/lostpass', {
            templateUrl: 'Views/lostpass.html',
            controller: 'loginCtrl',
        })  
        .when('/restorepass/:email/:secret', {
            templateUrl: 'Views/restorepass.html',
            controller: 'loginCtrl',
        })     
        .otherwise({
            redirectTo: '/login'
        });
    }
);