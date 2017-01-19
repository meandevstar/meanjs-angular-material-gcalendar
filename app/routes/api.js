var path = require('path');
var express = require('express');
var gcal = require('google-calendar');
var google = require('googleapis');
var configAuth = require('../../config/auth');
var User = require('../../app/models/user');
var refresh = require('passport-oauth2-refresh');

var router = express.Router();


router.get('/events', function(req, res) {  

    var auth = getO2AuthClient(req.user.token, req.user.refreshToken);

    var calendar = google.calendar('v3');
    var params = {
                    auth: auth,
                    calendarId: 'primary',
                    // timeMin: (new Date()).toISOString(),
                    // maxResults: 10,
                    singleEvents: true,
                    orderBy: 'startTime'
                 };

    calendar.events.list(params, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            checkCredentias(req, res, err, function(access_token, refresh_token) {
                params= {
                            auth: getO2AuthClient(access_token, refresh_token),
                            calendarId: 'primary',
                            singleEvents: true,
                            orderBy: 'startTime'
                        };
                calendar.events.list(params, function(err, response) {
                    res.json(response.items);
                });
            });
            return;
        }
        res.json(response.items);        
    });
});

router.get('/event/save', function(req, res) {

    var auth = getO2AuthClient(req.user.token, req.user.refreshToken);
    var event = JSON.parse(req.query.event);
    var calendar = google.calendar('v3');

    console.log(event);

    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
    }, function(err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ');

            console.log(err);
            return;
        }
        console.log('Event created: %s', event.htmlLink);
    });

    res.end();
});

router.get('/event/delete', function(req, res) {

    var auth = getO2AuthClient(req.user.token, req.user.refreshToken);
    var calendar = google.calendar('v3');
    var eventId = req.query.eventId;

    var params = {
        auth: auth,
        calendarId: 'primary',
        eventId: eventId,
    };

    calendar.events.delete(params, function(err) {
        if (err) {
            console.log('The API returned an error: ' + err);
            res.json('failed');
            return;
        }
        console.log('Event deleted.');
        res.json('success')
    });

});

router.get('/instance/delete', function(req, res) {

    var auth = getO2AuthClient(req.user.token, req.user.refreshToken);
    var calendar = google.calendar('v3');
    var eventId = req.query.eventId;

    var params = {
        auth: auth,
        calendarId: 'primary',
        eventId: eventId,
    };

    calendar.events.delete(params, function(err) {
        if (err) {
            console.log('The API returned an error: ' + err);
            res.json('failed');
            return;
        }
        console.log('Event deleted.');
        res.json('success')
    });

});

function getO2AuthClient(accessToken, refreshToken) {
    var oauth2Client = new google.auth.OAuth2(
                                        configAuth.googleAuth.clientID, 
                                        configAuth.googleAuth.clientSecret,
                                        configAuth.googleAuth.redirectUrl
                                        );

    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)
    });

    return oauth2Client;
}

function checkCredentias(req, res, err, callback) {
    var auth = {};
    if (err.code == "401") {
        refresh.requestNewAccessToken('google', req.user.refreshToken, function(err, token, refreshToken) {
            if (err) {
                res.json('renew access_token failed...');
                console.log('Failed to retrieve access token from refresh token.');
                console.log(err);
                return;
            }
            req.user.token = token;
            User.update({'email': req.user.email}, { $set: { 'token': token} }, function (err, user) {
                if (err)
                    console.log('No User Found.');
                console.log('Successfully update token.');
            });
            callback(token, req.user.refreshToken);
        });
    } else {
        res.json('fail');
        console.log('Failed to retrieve access token from refresh token.');
        return auth;
    }
}

module.exports = router;
