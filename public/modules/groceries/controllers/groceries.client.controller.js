'use strict';

// Groceries controller
angular.module('groceries').controller('GroceriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groceries',
	function($scope, $stateParams, $location, Authentication, Groceries) {
		$scope.authentication = Authentication;

		var user = $scope.authentication.user;
		$scope.isAuthenticated = user;

		// Create new Grocery
		$scope.create = function() {
			// Create new Grocery object
			var grocery = new Groceries ({
				item: this.item,
				quantity: this.quantity
			});

			grocery.$save(function(response) {
				// add grocery item to list
				$scope.groceries.unshift(grocery);

				// Clear form fields
				$scope.item = '';
				$scope.quantity = '';
				$scope.form.$setPristine();

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Grocery
		$scope.remove = function(grocery) {
			if ( grocery ) { 
				grocery.$remove();

				for (var i in $scope.groceries) {
					if ($scope.groceries [i] === grocery) {
						$scope.groceries.splice(i, 1);
					}
				}
			} else {
				$scope.grocery.$remove(function() {
					$location.path('groceries');
				});
			}
		};

		// Update existing Grocery
		$scope.update = function() {
			var grocery = $scope.grocery;

			grocery.$update(function() {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Groceries
		$scope.find = function() {
			$scope.groceries = Groceries.query();
		};

		// Find existing Grocery
		$scope.findOne = function() {
			$scope.grocery = Groceries.get({ 
				groceryId: $stateParams.groceryId
			});
		};
	}
]);