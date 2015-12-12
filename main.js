var async = require('async');
var request = require('request');
var WebSocket = require('ws');


if (require.main === module) {
    main();
}


function main() {
    var tasks = [getSocketURL, connectToSocket];
    async.waterfall(tasks, function (err, socket) {
        if (err) {
            return console.log(err);
        }
        socket.on("open", function () {
            console.log("socket connected");
        });
        socket.on("message", function (data, flags) {
            console.log(data);
        });
    });
}


function getSocketURL(done) {
    var token = process.env.SLACK_TOKEN;
    if (!token) {
        return done(new Error("Environment variable SLACK_TOKEN is undefined"));
    }
    var config = {
        url: "https://slack.com/api/rtm.start",
        method: "GET",
        qs: {
            token: token
        }
    };
    request(config, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            return done(null, data.url);
        }
        if (err) {
            return done(err);
        }
        if (response.statusCode != 200) {
            return done(new Error("Slack API call did not return a 200"));
        }
    });
}


function connectToSocket(socketUrl, done) {
    return done(null, new WebSocket(socketUrl));
}
