angular.module('MainCtrl', []).controller('MainController', function(Service, $http, $scope, $location, $mdDialog) {
	
	init();

	$scope.save = function() {
		$location.path('/addevent');
	}

	$scope.delete = function(ev) {
		if ($scope.events.selected.length != 0){
			$mdDialog.show({
				parent: angular.element(document.body),
				targetEvent: ev,
				templateUrl: 'views/delete-dialog.html',
				locals: {
					deleteTypes: $scope.deleteTypes,
					pscope: $scope
				},
				controller: DialogController
			});
		}

		function DialogController($scope, $mdDialog, deleteTypes, pscope) {
			$scope.deleteTypes = deleteTypes;
			$scope.deleteType = 0;

			$scope.closeDialog = function() {
				$mdDialog.hide();
			}

			$scope.deleteItem = function() {
				Service.delete($scope, pscope);
				$mdDialog.cancel();
			}
		}
	}

	$scope.$on('$routeChangeStart', function(next, current) { 
		Service.loadEvents($scope);
		console.log("Caughted!!!");
	});

	function init() {

		Service.loadEvents($scope);

		$scope.deleteTypes = [{
					name: 'Only Instance',
					value: 0
				},
				{
					name: 'All in the Series ',
					value: 1
				}];

		$scope.events = {};
		$scope.events.selected = [];
		$scope.event.deleteType = 0;  //  0: delete reccuring event only
									  //  1: delete reccuring event instance
	}

	
});