angular.module('AddEventCtrl', []).controller('AddEventController', function(Service, $http, $scope, $location) {

	init();

	$scope.saveEvent = function() {
		Service.save($scope);
	}

	$scope.cancel = function() {
		$location.path('/home');
	}

	$scope.toggleDay = function (item, days) {
		var idx = days.indexOf(item);
		if (idx > -1) {
			days.splice(idx, 1);
		}
		else {
			days.push(item);
		}
	};

	$scope.exists = function (item, days) {
		return days.indexOf(item) > -1;
	};

	$scope.onTypeChange = function () {
		console.log($scope.event.type);
		if ($scope.event.type == RRule.DAILY)
			$scope.typeUnit = 'days';
		if ($scope.event.type == RRule.WEEKLY)
			$scope.typeUnit = 'weeks';
		if ($scope.event.type == RRule.MONTHLY)
			$scope.typeUnit = 'months';
	};

	function init() {
		var event = {};
						
		$scope.types = [{
							name: 'Daily',
							value: RRule.DAILY
						},
						{
							name: 'Weekly',
							value: RRule.WEEKLY
						},
						{
							name: 'Monthly',
							value: RRule.MONTHLY
						}];						

		$scope.cycles = [];
		for (var i = 1; i < 30; i++)
			$scope.cycles.push(i);

		$scope.days = [{
							name: 'Mon',
							value: RRule.MO
						},
						{
							name: 'Tue',
							value: RRule.TU
						},
						{
							name: 'Wed',
							value: RRule.WE
						},
						{
							name: 'Thu',
							value: RRule.TH
						},
						{
							name: 'Fri',
							value: RRule.FR
						},
						{
							name: 'Sat',
							value: RRule.SA
						},
						{
							name: 'Sun',
							value: RRule.SU
						}];

		event.type = RRule.DAILY;
		event.selectedDays = [RRule.MO];
		event.startdate = new Date();
		event.enddate = new Date();
		event.starttime = new Date();
		event.endtime = new Date();
		event.name = "Appoinment";
		event.description = "Appoinment for something.";
		$scope.typeUnit = 'days';
		event.cycle = 1;
		event.count = 1;
		event.end = 2;
		$scope.event = event;
		
	}
});