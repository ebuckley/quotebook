(function (window, angular) {
	'use strict';
	angular.module('quoteBook', ['lbServices', 'ui.router'])
	.config(function ($stateProvider) {
		$stateProvider.state('login', {
			url:'/login',
			controller: 'loginCtrl',
			templateUrl: '/views/login.html'
		});

		$stateProvider.state('list', {
			url:'/list',
			templateUrl: '/views/list.html',
			controller: 'listCtrl'
		});

		$stateProvider.state('register', {
			url:'/register',
			templateUrl: '/views/register.html',
			controller: 'registerCtrl'
		});
	})
	.controller('loginCtrl', function ($scope, User, $state) {
		if (User.isAuthenticated()) {
			$state.go('list');
		}

		$scope.credentials = {};

			$scope.login = function () {
				User.login($scope.credentials,
					function (success) {
						$scope.user = success.user;
						$state.go('list');
					}, function  (err) {
						$scope.pendingLogin = false;
						console.log('error logging in', err);
					});
			};
	})
	.controller('registerCtrl', function  ($scope, User, $state) {

		if (User.isAuthenticated()) {
			$state.go('list');
		}

		$scope.doRegister = function  () {
			$scope.pending = true;

			User.create($scope.credentials)
			.$promise.then(function  (success) {
				return User.login($scope.credentials).$promise;
			})
			.then(function  () {
					$scope.pending = false;
					$state.go('list')
			}, function (err) {
					$scope.pending = false;
			});

		};
	})
	.controller('listCtrl', function ($scope, User, $state) {

		if (!User.isAuthenticated()) {
			$state.go('login');
		}

		User.quotes({ id: User.getCurrentId() },
			function (success) {
				console.log('got quotes', success);
				$scope.quotes = success;
			}, function (err) {
				console.log('error getting quotes', err);
			});
	})
	.controller('mainCtrl', function ($scope, User, $state) {

		if (User.isAuthenticated()) {
			$state.go('list')
		} else {
			$state.go('login');
		}

		$scope.pendingLogin = false;
		$scope.credentials = {};
		$scope.quotes = [];

		$scope.$watch(function  () {
			return User.isAuthenticated()
		}, function (isAuthed) {
			if (isAuthed) {
				User.get({id: User.getCurrentId()}
				, function (success) {
					$scope.user = success;
				}, function (err) {
					console.log("fatal error, couldn't get user from backend", err);
				});
			} else {
				$scope.user = false;
				$state.go('login');
			}
		});

		$scope.logout = function () {
			User.logout({},
				function  (success) {
					$scope.user = false;
					$state.go('login');
				}, function  (err) {
					console.log('fail logout', err);
				})
		}
	});
})(window, angular)