"use strict";
var leafdrop = angular.module("leafdrop",['ngMaterial','ngMdIcons','ngAnimate','ngAria','ngRoute'])
.controller("main",["$scope","$timeout","$mdSidenav","$mdUtil","$mdComponentRegistry",
	function($scope, $timeout, $mdSidenav, $mdUtil, $mdComponentRegistry){

	// mainHeader toggle
	$scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

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
    })
}])
.controller('OrdersController',['$scope', function($scope) {
	$scope.message = 'This is Add new order screen';
}]).controller('DispensariesController',['$scope', function($scope) {
	$scope.message = 'This is Add new order screen';
}]).controller('StoreController',['$scope', function($scope) {
	$scope.message = 'This is Add new order screen';
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
		templateUrl:"partials/header.html",
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
}).directive("aroundYou",function($timeout, $mdSidenav, $log){

	return {
		restrict:"E",
		scope:true,
		templateUrl:"partials/aroundYou.html",
		link:function(scope,element,attrs){

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
