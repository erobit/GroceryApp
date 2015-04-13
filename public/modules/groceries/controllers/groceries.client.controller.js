'use strict';

// Groceries controller
angular.module('groceries').controller('GroceriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groceries',
	function($scope, $stateParams, $location, Authentication, Groceries) {
		$scope.authentication = Authentication;

		// Create new Grocery
		$scope.create = function() {
			// Create new Grocery object
			var grocery = new Groceries ({
				name: this.name
			});

			// Redirect after save
			grocery.$save(function(response) {
				$location.path('groceries/' + response._id);

				// Clear form fields
				$scope.name = '';
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
				$location.path('groceries/' + grocery._id);
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