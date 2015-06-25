var leaf_services = angular.module("leafservices", ["ngResource"])
.service("Strain", function ($resource) {

    return $resource("/strain/:id", {id:"@id"},{
        search: { method: "POST", url: "/strain/search/rating", isArray: true },
        photos: {method: "GET", url:"/strain/:id/photos",isArray:true}
    });
}).service("Dispensary", function ($resource) {

        return $resource("/dispensary/:id", {id:"@id"}, {
            search: { method: "POST", url: "/dispensary/search", isArray: true }
        });
}).service("Geolocation", function () {
  
    this.getPosition = function (callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                callback(null, position);
            });
        } else {
            callback("Browser Doesn't Support Geolocation");
        }
    };
});