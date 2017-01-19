angular.module('LogInCtrl', []).controller('LogInController', function($scope, $window) {
	$window.location.href = '/auth/google'
});