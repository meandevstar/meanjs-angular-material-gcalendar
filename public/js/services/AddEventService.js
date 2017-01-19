angular.module('AddEventService', []).factory('Service', function($http, $location) {

	return {
        save: function ($scope) {
                    var config = { params: { event : getCalendarConfigString($scope) }};
                    console.log(getCalendarConfigString($scope));

                    isLoggedIn(function () {
                        $http.get('api/event/save', config).then(function(response) {
                                                alert("Event has successfully saved!");
                                            });
                    });
                },

        loadEvents: function ($scope) {
            isLoggedIn(function() {
                $http.get('api/events').then(function (response) {
                    $scope.events.data = response.data;
                    }, function (response) {
                });
            });
        },

        delete: function ($scope, pscope) {
            var eventdata = pscope.events.selected;
            var deleteType = $scope.deleteType;

            if (eventdata.length === 0)
                alert('Select at least one item to delete.');

            if (eventdata.length > 1 || deleteType == 0) {
                angular.forEach(eventdata, function(value, key){
                    console.log(value);
                    var config = { params: { eventId: value.id }};

                    $http.get('/api/event/delete', config).then(function(response) {
                        if (response.data === 'success') {
                            alert('Deletion successed!');
                        }
                        // else
                        //     alert('Deletion failed!')
                    }, function(response) {

                    });
            });
            } else {
                var eventId = '';
                if (eventdata[0].recurringEventId !== undefined) {
                    eventId = eventdata[0].recurringEventId;
                } else {
                    // alert('Deletion Failed!');
                    return;
                }

                var config = { params: { eventId: eventId }};
                console.log(config);

                $http.get('/api/event/delete', config).then(function(response) {
                    if (response.data === 'success') {
                        alert('Deletion successed!');
                    } else {
                        // alert('Deletion failed!')
                    }
                }, function(response) {

                });
            }

            setTimeout(function () {
                $http.get('api/events').then(function (response) {
                            pscope.events.data = response.data;
                            }, function (response) {

                        });
                }, eventdata.length * 800);
        }
    }

    function isLoggedIn(callback) {
        $http.get('isloggedin').then(function (response) {
                    if (response.data === 'success')
                        callback();
                    else
                        $location.path('/');
                }, function (response) {
                    $location.path('/');
            });
    }

    function getCalendarConfigString($scope) {
		var event = $scope.event;

        event.startdate.setHours(event.starttime.getHours(), event.starttime.getMinutes());
        event.enddate.setHours(event.endtime.getHours(), event.endtime.getMinutes());

        if (event.startdate > event.enddate)
            event.enddate = event.startdate;

		var eventConfig = {
							'summary': event.name,
							'location': 'Somewhere',
							'description': event.description,
							'start': { 'dateTime': event.startdate.toISOString(),
									'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone },
							'end': 	 { 'dateTime': event.enddate.toISOString(),
									'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone },
							'reminders': { 'useDefault': true }
							}

		var ruleObj = {};
		
		if (event.type == RRule.WEEKLY)  // set byweekday in Weekly mode
			ruleObj.byweekday = event.selectedDays;

		if (event.end == 0)   // set interval if Ends is set to 'After'
            ruleObj.count = event.count;

        if (event.end == 1)   // set end date if Ends is set to 'On'
            ruleObj.until = event.enddate;
		
	    // set freq and interval

		ruleObj.freq = event.type; 
        ruleObj.interval = event.cycle;       

		var rule = new RRule(ruleObj);
		eventConfig.recurrence = ['RRULE:' + rule.toString()];

		var eventConfigStr = JSON.stringify(eventConfig);

		return eventConfigStr;
	}

});