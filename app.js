'use strict';

var platform = require('./platform'),
    isEmpty = require('lodash.isempty'),
    isArray = require('lodash.isarray'),
    isPlainObject = require('lodash.isplainobject'),
    isNaN = require('lodash.isnan'),
    async = require('async'),
    wunderListClient;

let sendData = (data, cb) => {
    if(isNaN(data.list_id))
        return cb(new Error('Data should contain a list_id field.'));

    if(isEmpty(data.title))
        return cb(new Error('Data should contain a title field.'));

    wunderListClient.http.tasks
        .create({
            list_id: data.list_id,
            title: data.title,
            assignee_id: data.assignee_id,
            completed: data.completed,
            due_date: data.due_date,
            starred: data.starred
        })
        .done((taskData, statusCode) => {
            platform.log(JSON.stringify({
                title: 'Wunderlist task created.',
                data: data
            }));

            cb();
        })
        .fail((response, code) => {
            cb(response);
        });
};

platform.on('data', function (data) {
    if(isPlainObject(data)){
        sendData(data, (error) => {
            if(error) {
                console.error(error);
                platform.handleException(error);
            }
        });
    }
    else if(isArray(data)){
        async.each(data, (datum, done) => {
            sendData(datum, done);
        }, (error) => {
            if(error) {
                console.error(error);
                platform.handleException(error);
            }
        });
    }
    else
        platform.handleException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data));
});

platform.once('close', function () {
    platform.notifyClose();
});

platform.once('ready', function (options) {
    let Sdk = require('wunderlist');

    wunderListClient = new Sdk({
        'accessToken': options.access_token,
        'clientID': options.client_id
    });

    platform.notifyReady();
    platform.log('Connector has been initialized.');
});