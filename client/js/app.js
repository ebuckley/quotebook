(function (window, angular) {
	'use strict';
	angular.module('quoteBook', ['lbServices', 'ui.router', 'ui.bootstrap'])
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
	.factory('QuoteStore', function ($rootScope, Quote, User) {

		var listeners = {};

		var state = {
			quotes: []
		};

		function getQuotes() {
			return User.quotes({ id: User.getCurrentId() },
				function (success) {
					console.log('got quotes', success);
					state.quotes = success;
					$rootScope.$broadcast('quotes.update', success)
				}, function (err) {
					console.log('error getting quotes', err);
				});
		}

		getQuotes();

		return {

			add: function  (quoteModel) {
				quoteModel.userId = User.getCurrentId();
				quoteModel.createdAt = (new Date()).toISOString();
				quoteModel.isDeleted = false;

				if (!quoteModel.content) throw new Error('quote should have content');

				return Quote.create(quoteModel).$promise.then(function (success) {
					getQuotes(); // update quotes model
					return success;
				}, function  (err) {
					console.log('error creating quote', err);
				});
			},
			getAll: function () {
				return state.quotes;
			}
		}
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
	.controller('listCtrl', function ($scope, QuoteStore, User, $state) {

		if (!User.isAuthenticated()) {
			$state.go('login');
		}

		$scope.model = {};
		$scope.model.quotes = QuoteStore.getAll();

		var quoteUpdater = $scope.$on('quotes.update', function (evt, quotes) {
			$scope.model.quotes = quotes;
		});

		$scope.$on('$destroy', function  () {
			quoteUpdater(); //deregister the quote updater after controller scope is destroyed
		})

	})
	.controller('mainCtrl', function ($scope, User, $state, $uibModal) {

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

		$scope.add = function  () {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: '/views/add-modal.html',
				controller: function ($scope, $modalInstance, QuoteStore) {
					$scope.ok = function  () {
						QuoteStore.add({
							content: $scope.content.text
						})
						.then(function  () {
							$modalInstance.close();
						}, function (err) {
							console.log('error creating quote');
						});
					};
					$scope.cancel = function  () {
						$modalInstance.dismiss();
					};
				},
				size: 'lg',
				resolve: {}
			});
		};

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