var fs = require('fs');


var exports = module.exports = {};
exports.fromFile = fromFile;


function fromFile(path) {
    var config = JSON.parse(fs.readFileSync(path));
    if (!config.token) {
        console.log("Config file is missing 'token' property");
        process.exit(2);
    }

    if (!config.channel) {
        console.log("Config file is missing 'channel' property");
        process.exit(3);
    }

    if (!config.responses || config.responses.length === 0) {
        console.log("Config file is missing 'responses' property");
        process.exit(4);
    }
    return config;
}
