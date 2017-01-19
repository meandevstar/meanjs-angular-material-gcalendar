angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/addevent', {
			templateUrl: 'views/addevent.html',
			controller: 'AddEventController'
		})

		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'LogInController'	
		})

		.otherwise({
			redirectTo: '/'
		});

	// $locationProvider.html5Mode(true);

}]);