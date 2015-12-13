'use strict';
var EventEmitter = require('events');
var _ = require('lodash');
var request = require('request');
var WebSocket = require('ws');


var exports = module.exports = {};


class ChannelTroll extends EventEmitter {
    constructor(token, channel, responses) {
        super();
        this.url = 'https://slack.com/api/rtm.start';
        this.token = token;
        this.channel = channel;
        this.responses = responses;
        this.responseID = 1;

        this._socket;
        this.on('connected', this.setupSocket);
        this.on('respond', this.respond);
    }

    run() {
        var _this = this;
        var config = {
            url: _this.url,
            method: 'GET',
            qs: {
                token: _this.token
            }
        };
        request(config, function(err, response, body) {
            if (!err && response.statusCode == 200) {
                var data = JSON.parse(body);
                _this._socket = new WebSocket(data.url);
                return _this.emit('connected');
            }
            if (err) {
                return _this.emit('error', new Error('Unable to connect to Slack websocket'));
            }
            if (response.statusCode != 200) {
                return _this.emit('error', new Error('Call to Slack API did not return 200'));
            }
        });
    }

    setupSocket() {
        var _this = this;
        _this._socket.on('error', function () {
            return _this.emit('error', new Error('Slack websocket error occurred'));
        });
        _this._socket.on('message', function (data) {
            var message = JSON.parse(data);
            if (message.type === 'message' && message.channel === _this.channel) {
                return _this.emit('respond');
            }
        });
        return _this.emit('ready');
    }

    respond() {
        var _this = this;
        var message = {
            id: _this.responseID,
            type: 'message',
            channel: _this.channel,
            text: _.shuffle(_this.responses)[0]
        }
        var randomDelay = (Math.floor(Math.random() * 3) + 1) * 1000;
        setTimeout(function () {
            _this._socket.send(JSON.stringify(message));
        }, randomDelay);
        _this.responseID += 1;
    }
}


exports.ChannelTroll = ChannelTroll;
