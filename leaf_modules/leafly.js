var http = require("http")
var querystring = require("querystring");

module.exports = function(app_id,app_key){

    var options = {
        hostname: "data.leafly.com",
        host: "data.leafly.com",
        headers: {
            APP_ID: app_id,
            APP_KEY: app_key,
            "Content-Type": "application/json"
        },
        method: "POST"
    };

    this.searchStrains = function (search,filters,sort,page,take,callback) {
    
        var strain_options = new Object(options);
        strain_options.path = "/strains";
        var params = JSON.stringify({
            search: search,
            page: page,
            take: take,
            filters: filters,
            sort:sort
        });
        http.request(strain_options, function (response) {

            response.setEncoding("utf-8");
            response.on("error", function (err) {
                console.log(err);
            });
            callback(response);

        }).on("error", function (err) {
            console.log(err);
        }).end(params);
    };

    this.searchDispensaries = function (latitude,longitude, page, take, callback) {

        var dispensary_options = new Object(options);
        dispensary_options.path = "/locations";
        var params = JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            take: take,
            page: page,
        });
        http.request(options, function (response) {
            response.setEncoding("utf-8");
            response.on("error", function (err) {
                console.log(err);
            });
            callback(response);

        }).on("error", function (err) {
            console.log(err);
        }).end(params);
    };

    this.getDispensary = function (dispensary, callback) {
        var dispensary_options = new Object(options);
        dispensary_options.path = "/locations/"+dispensary;
        dispensary_options.method = "GET";
        http.get(options, function (response) {
            response.setEncoding("utf-8");
            response.on("error", function (err) {
                console.log(err);
            });
            callback(response);

        }).on("error", function (err) {
            console.log(err);
        });
    }

    this.getStrain = function (strain, callback) {
        var dispensary_options = new Object(options);
        dispensary_options.path = "/strains/" + strain;
        dispensary_options.method = "GET";
        http.get(options, function (response) {
            response.setEncoding("utf-8");
            response.on("error", function (err) {
                console.log(err);
            });
            callback(response);

        }).on("error", function (err) {
            console.log(err);
        });
    }

    this.getStrainPhotos = function (strain, callback) {
        var dispensary_options = new Object(options);
        dispensary_options.path = "/strains/" + strain + "/photos?" + querystring.stringify({
            take: 5,
            page: 0
        });
        dispensary_options.method = "GET";
        http.request(options, function (response) {
            response.setEncoding("utf-8");
            response.on("error", function (err) {
                console.log(err);
            });
            callback(response);
        }).on("error", function (err) {
            console.log(err);
        }).end();
    }
}
