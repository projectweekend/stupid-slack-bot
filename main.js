var _ = require('lodash');
var async = require('async');
var argv = require('minimist')(process.argv.slice(2));
var config = require('./app/config');
var ChannelTroll = require('./app/slack').ChannelTroll;


if (require.main === module) {
    main();
}


function main() {
    var configFilePath = argv.c;
    if (!configFilePath) {
        console.log("Config file path must be provided with the -c argument");
        process.exit(1);
    }

    var appConfig = config.fromFile(configFilePath);

    var bot = new ChannelTroll(appConfig.token, appConfig.channel, appConfig.responses);

    bot.on('error', function (err) {
        console.log('Bot error!');
        console.log(err);
        process.exit(5);
    });

    bot.on('ready', function () {
        console.log("Bot connected!");
    });

    bot.run();
}
