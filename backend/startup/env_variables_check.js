const config = require('config');
module.exports = function(){
    checkEnvironmentVariable('jwtPrivateKey');
    checkEnvironmentVariable('dbPassword');
}
const checkEnvironmentVariable = function(variable){
    if (!config.get(variable)) {
        console.log(`FATAL ERROR: ${variable} is not defined.`);
        process.exit(1);
    }
}