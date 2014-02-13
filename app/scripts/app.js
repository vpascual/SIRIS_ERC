'use strict';

angular.module('ercApp', [
  'ngResource',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/scatter', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          data: ['$http', function($http) {
            return $http.get('data/erc_data.csv').then(function(response) {
              // console.log(response.data)
              return d3.csv.parse(response.data);
            })
          }
          ]
        }
      })
      .when('/keywords', {
        templateUrl: 'views/keywords.html',
        controller: 'KeywordsCtrl',
        resolve: {
          data: ['$http', function($http) {
            return $http.get('data/erc_keywords.csv').then(function(response) {
              // console.log(response.data)
              return d3.csv.parse(response.data);
            })
          }
          ]
        }
      })
      .otherwise({
        redirectTo: '/keywords'
      });
  });
