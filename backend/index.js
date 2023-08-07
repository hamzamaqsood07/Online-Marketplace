const express = require('express'); //importing express
const app = express();              //creating express application

require('./startup/env_variables_check')(); //chek for environment variables
require('./startup/routes')(app);   //importing routes and calling it
require('./startup/db')();      //connecting to database


const port = process.env.PORT || 5000;  //defining port

//running server on specified port
const server = app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

module.exports = server;    //exporting module