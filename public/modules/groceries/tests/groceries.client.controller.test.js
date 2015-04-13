'use strict';

(function() {
	// Groceries Controller Spec
	describe('Groceries Controller Tests', function() {
		// Initialize global variables
		var GroceriesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Groceries controller.
			GroceriesController = $controller('GroceriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Grocery object fetched from XHR', inject(function(Groceries) {
			// Create sample Grocery using the Groceries service
			var sampleGrocery = new Groceries({
				name: 'New Grocery'
			});

			// Create a sample Groceries array that includes the new Grocery
			var sampleGroceries = [sampleGrocery];

			// Set GET response
			$httpBackend.expectGET('groceries').respond(sampleGroceries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.groceries).toEqualData(sampleGroceries);
		}));

		it('$scope.findOne() should create an array with one Grocery object fetched from XHR using a groceryId URL parameter', inject(function(Groceries) {
			// Define a sample Grocery object
			var sampleGrocery = new Groceries({
				name: 'New Grocery'
			});

			// Set the URL parameter
			$stateParams.groceryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/groceries\/([0-9a-fA-F]{24})$/).respond(sampleGrocery);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grocery).toEqualData(sampleGrocery);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Groceries) {
			// Create a sample Grocery object
			var sampleGroceryPostData = new Groceries({
				name: 'New Grocery'
			});

			// Create a sample Grocery response
			var sampleGroceryResponse = new Groceries({
				_id: '525cf20451979dea2c000001',
				name: 'New Grocery'
			});

			// Fixture mock form input values
			scope.name = 'New Grocery';

			// Set POST response
			$httpBackend.expectPOST('groceries', sampleGroceryPostData).respond(sampleGroceryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Grocery was created
			expect($location.path()).toBe('/groceries/' + sampleGroceryResponse._id);
		}));

		it('$scope.update() should update a valid Grocery', inject(function(Groceries) {
			// Define a sample Grocery put data
			var sampleGroceryPutData = new Groceries({
				_id: '525cf20451979dea2c000001',
				name: 'New Grocery'
			});

			// Mock Grocery in scope
			scope.grocery = sampleGroceryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/groceries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/groceries/' + sampleGroceryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid groceryId and remove the Grocery from the scope', inject(function(Groceries) {
			// Create new Grocery object
			var sampleGrocery = new Groceries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Groceries array and include the Grocery
			scope.groceries = [sampleGrocery];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/groceries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGrocery);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.groceries.length).toBe(0);
		}));
	});
}());