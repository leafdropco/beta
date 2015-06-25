var http = require("http");
var stylus = require("stylus");
var express = require("express");
var bodyparser = require("body-parser");
var path = require("path");
var LeaflyLib = require("./leaf_modules/leafly")
var concat = require("concat-stream");

var leafly = new LeaflyLib("d6d250a0", "cc87746abbf94410b2ca152c03b58af2");
var dispensaries = [];
var strains = [];
var last_strain = {};
var app = express()
.use(stylus.middleware(path.join(__dirname, "/")))
.use(express.static(path.join(__dirname, "/")))
.use(bodyparser.json())
.param("sort", function (req, res, next, sort) {

    req.sort = sort;
    next();
}).param("id", function (req, res, next, id) {

    req.id = id;
    next();
})
.get("/", function (req, res, next) {

    res.json({
        "response": "Welcome To Leaf Drop"
    }).end();
}).get("/dispensary/:id", function (req, res, next) {

    leafly.getDispensary(req.id,
        function (response) {
            response.setEncoding("utf-8");
            response.pipe(concat(function (body) {
                var data = JSON.parse(body);
                res.json(data).end();
            }));
        });

}).get("/strain/:id/photos", function (req, res, next) {
    console.log("retrieving photos");
    leafly.getStrainPhotos(req.id,
        function (response) {
            response.setEncoding("utf-8");
            response.pipe(concat(function (body) {
                try{
                    var data = JSON.parse(body);
                    console.log(data.photos);
                    res.json(data.photos).end();
                }catch(err){
                    res.json([]).end();
                }
                
            }));
        });

}).get("/strain/:id", function (req, res, next) {

    console.log('retrieving strain');
    leafly.getStrain(req.id,
        function (response) {
            response.setEncoding("utf-8");
            response.pipe(concat(function (body) {
                try{
                    var data = JSON.parse(body);
                    last_strain = data;
                    res.json(data).end();
                } catch (err) {
                    res.json(last_strain);
                }                
            }));
        });

}).get("/details", function (req, res) {
    res.set("Content-Type", "application/json");
    http.get({
        host: "localhost",
        port: 5984,
        path: "/drop/_design/dispensary/_view/details"
    }, function (couch_res) {
        couch_res.pipe(res);
    });
}).post("/strain/search/:sort", function (req, res) {
    leafly.searchStrains(
        req.body.search,
        req.body.filters,
        req.sort,
        req.body.page ? req.body.page : 0,
        req.body.take ? req.body.take : 25,
        function (response) {
            response.setEncoding("utf-8");
            response.pipe(concat(function (body) {
                //res.end(body);
                try{
                    var data = JSON.parse(body);
                    strains = data.Strains;
                    res.json(strains).end();
                } catch (err) {
                    res.json(strains).end();
                }
                
            }));
    });
}).post("/dispensary/search", function (req, res) {
    leafly.searchDispensaries(
        47.607,
        -122.333,
        req.body.page ? req.body.page : 0,
        req.body.take ? req.body.take : 10,
        function (response) {
            response.pipe(concat(function (body) {
                try{
                    var data = JSON.parse(body);
                    dispensaries = data.stores;
                    res.json(dispensaries).end();
                } catch (err) {
                    console.log(err);
                    console.log(data);
                    //cheating till we figure out what the problem is!
                    res.json(dispensaries).end();
                }                
            }));
        });
});

http.createServer(app).listen(8080);