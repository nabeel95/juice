var http = require('http');
var controller = require('./public/js/controller');
var server = http.createServer(controller);
server.listen(3000);
console.log("server started at port 3000");
