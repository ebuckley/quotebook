(function (window, angular) {
	'use strict';
	angular.module('quoteBook', ['lbServices', 'ngRoute'])
	.controller('mainCtrl', function ($scope, User) {

		$scope.pendingLogin = false;
		$scope.credentials = {};
		$scope.quotes = [];

		if (User.isAuthenticated()) {
			User.get({id: User.getCurrentId()}
			, function (success) {
				$scope.user = success;
			}, function (err) {
				console.log("fatal error, couldn't get user from backend", err);
			});
		} else {
			$scope.user = false;
		}


		$scope.logout = function () {
			
			User.logout({},
			function  (success) {
				console.log('successful logout', success);
				$scope.user = false;
			}, function  (err) {
				console.log('fail logout', err);
			})
		}

		$scope.login = function () {
			User.login($scope.credentials,
			function (success) {
				$scope.user = success.user;
				console.log('we logged in woot!', success);
			}, function  (err) {
				$scope.pendingLogin = false;
				console.log('error logging in', err);
			})
		};

		$scope.$watch('user', function (newTok, old) {
			if (newTok) {
				User.quotes({ id: $scope.user.id },
				function (success) {
					console.log('got quotes', success);
					$scope.quotes = success;
				}, function (err) {
					console.log('error getting quotes', err);
				});
			}
		});
	});
})(window, angular)