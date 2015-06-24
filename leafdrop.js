var http = require("http");
var stylus = require("stylus");
var express = require("express");
var path = require("path");

var app = express()
.use(stylus.middleware(path.join(__dirname,"/")))
.use(express.static(path.join(__dirname,"/")))
.get("/",function(req,res,next){

	res.json({
		"response":"Welcome To Leaf Drop"
	}).end();
})

var port = process.env.PORT || 8080;
var server = app.listen(port, function() {
    console.log('Listening on port %d', port);
});