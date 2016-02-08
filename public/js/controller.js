var express = require('express');
var fs = require('fs');
var app = express();
var juiceData = fs.readFileSync('./data/juice_orders','utf8');


app.get('/juicedata',function(req,res){
	res.send(juiceData)
})
app.use(express.static('./public'))

module.exports = app;

