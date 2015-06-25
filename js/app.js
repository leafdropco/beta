"use strict";
var leafdrop = angular.module("leafdrop",['ngMaterial','ngMdIcons','ngAnimate','ngAria','ngRoute','leafservices'])
.controller("main",["$scope","$timeout","$mdSidenav","$mdUtil","$mdComponentRegistry","Strain","Geolocation","$rootScope","Dispensary","$location",
	function($scope, $timeout, $mdSidenav, $mdUtil, $mdComponentRegistry,Strain,Geolocation,$rootScope,Dispensary,$location){

	    if (!$rootScope.coordinates) {
	        Geolocation.getPosition(function (err, position) {
	            if (err) {
	                console.log(err);
	            } else {
	                $timeout(function () {
	                    $rootScope.coordinates = position.coords;
	                });
	            }
	        });
	    }

	    $scope.toggleSidenav = function(menuId) {
	        $mdSidenav(menuId).toggle();
	    };

	    $scope.search = function (query) {
            var results = Strain.search({
                search: query,
                page: 0,
                take:5,
            }, function () {
                console.log(results);
                $scope.results = results;
                $location.path("/orders");
            });
	    }
	}])
.config(['$routeProvider',
  function($routeProvider) {
      $routeProvider.
        when('/orders', {
            templateUrl: 'views/orders.html',
            controller: 'OrdersController'
        }).
        when('/home', {
            templateUrl: 'views/home.html',
            controller: 'main'
        }).
        when('/dispensaries', {
            templateUrl: 'views/dispensaries.html',
            controller: 'DispensariesController'
        }).
        when('/store', {
            templateUrl: 'views/store.html',
            controller: 'StoreController'
        }).
        when('/store/:store', {
            templateUrl: 'views/store.html',
            controller: 'StoreController'
        }).
        when('/product/:product', {
            templateUrl: 'views/product.html',
            controller: 'ProductController'
        }).
        when('/product', {
            templateUrl: 'views/product.html',
            controller: 'ProductController'
        })
  }])
.controller('OrdersController',['$scope', function($scope) {
    $scope.message = 'This is Add new order screen';
    if (!$scope.results) $scope.search("");

}]).controller('DispensariesController',['$scope',"Dispensary","$q", "$rootScope",function($scope,Dispensary,$q,$rootScope) {

    var R = 3958.76;
    Math.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    $scope.getDispensaries = function(coordinates) {
        var deferred = $q.defer();
        var results = Dispensary.search({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            page: 0,
            take: 0
        }, function () {
            deferred.resolve(results);
        },function(err){
            console.log(err);
        });
        return deferred.promise;
    }

    $scope.getDistance = function (lat, lon) {
        
        if ($rootScope.coordinates) {
            var coordinates = $rootScope.coordinates;
            var dlat = Math.radians(coordinates.latitude - lat);
            var dlon = Math.radians(coordinates.longitude - lon);
            var a = Math.pow(Math.sin(dlat)/2, 2) +
                    Math.cos(coordinates.latitude) * Math.cos(lat) *
                    Math.pow(Math.sin(dlon / 2), 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return Math.round(d*10)/10;
        }
        
        //wrong needs to use haversine forumla
        return NaN;
    }
}]).controller('StoreController', ['$scope', "Dispensary","$routeParams", function ($scope, Dispensary,$routeParams) {
    $scope.message = 'This is Add new order screen';
    $scope.storeid = $routeParams.store;
    if ($scope.storeid) {
        var dispensary = Dispensary.get({ id: $scope.storeid }, function () {
            console.log(dispensary);
            $scope.dispensary = dispensary;
        });
    };

}]).controller('ProductController',['$scope', "Strain","$routeParams",function($scope,Strain,$routeParams) {
    $scope.message = 'This is Add new order screen';
    $scope.productid = $routeParams.product;
    if ($scope.productid) {
        var product = Strain.get({ id: $scope.productid }, function () {
            console.log(product);
            $scope.product = product;
            var photos = Strain.photos({ id: $scope.productid }, function () {
                console.log(photos);
                $scope.product.photos = photos;
            });
        });
    };

}]).controller("SearchController", ["$scope", "Strain", function ($scope, Strain) {

}])
.animation('.slide-animation', function () {
        return {
            addClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    TweenMax.to(element, 0.5, {left: -element.parent().width(), onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    TweenMax.set(element, { left: element.parent().width() });
                    TweenMax.to(element, 0.5, {left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    })

//get desp data from json file
.controller('dispCtrl',['$scope', '$http', function($scope, $http) {
	$http.get('js/disp.json', {header : {'Content-Type' : 'application/json'}}).success(function (data) {
		$scope.desp = data;
	})
	$scope.rating = 'miles';
}])
.directive("header",function($timeout, $mdSidenav, $mdUtil, $mdComponentRegistry){

	return {
		restrict:"E",
		scope:true,
		templateUrl: "partials/header.html",
		controller:"SearchController",
		link:function(scope,element,attrs){

			 scope.toggleSidenav = function(menuId) {
			    $mdSidenav('left').toggle()
			  	};
		}
	}
}).directive("sideMenu",function($timeout, $mdSidenav, $log){

	return {
		restrict:"E",
		scope:true,
		templateUrl:"partials/sideMenu.html",
		link:function(scope,element,attrs){
			scope.toggleSidenav = function(menuId) {
			    $mdSidenav('left').toggle()
			  	};
		}
		

    };
}).directive("aroundYou",function($timeout, $mdSidenav, $log,$rootScope){

	return {
		restrict:"E",
		controller:"DispensariesController",
		templateUrl: "partials/aroundYou.html",
        bindToController:true,
		link: function (scope, element, attrs) {

		    if ($rootScope.coordinates) {
		        retrieveDispensaries($rootScope.coordinates);
		    } else {
		        $rootScope.$watch("coordinates", function (coordinates) {
		            if (coordinates) {
		                retrieveDispensaries(coordinates)
		            };
		        });
		    }

		    function retrieveDispensaries(coordinates) {
		        scope.getDispensaries(coordinates)
                    .then(function (dispensaries) {
                        console.log(dispensaries);
                        scope.dispensaries = dispensaries;
		        });
		    }
		}
	};
}).directive("featSlide",function($timeout, $mdSidenav, $log){

	return {
		restrict:"E",
		scope:true,
		templateUrl:"partials/featSlide.html",
		controller:function($scope){
			$scope.slides = [
            {image: 'img/img00.jpg', description: 'Image 00', price: '$12', weight: 'Gram', name: 'OG Kush', delivery: 'Available', pickup: 'Available'},
            {image: 'img/img01.jpg', description: 'Image 01', price: '$10', weight: 'Gram', name: 'Purple Kush', delivery: 'Not Available', pickup: 'Available'},
            {image: 'img/img02.jpg', description: 'Image 02', price: '$14', weight: 'Gram', name: 'Thin Mint', delivery: 'Available', pickup: 'Not Available'},
            {image: 'img/img03.jpg', description: 'Image 03', price: '$11', weight: 'Gram', name: 'Girl Scout', delivery: 'Not Available', pickup: 'Not Available'},
            {image: 'img/img04.jpg', description: 'Image 04', price: '$12', weight: 'Gram', name: 'OG Cheese', delivery: 'Available', pickup: 'Not Available'}
        ];

         $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function () {
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };

		}
		

    };
});
