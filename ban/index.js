'use strict'

var curl = require('curl');

module.exports = {
    geocode: function(adresse, options, callback) {
        if (adresse != "") {
            var url = "https://api-adresse.data.gouv.fr/search/?q=" + adresse;
            if (typeof options.limit != "undefined") {
                url += "&limit=" + options.limit;
            }
            if (typeof options.postcode != "undefined") {
                url += "&postcode=" + options.postcode;
            }
            if (typeof options.type != "undefined") {
                url += "&type=" + options.type;
            }
            if (typeof options.priority != "undefined" && options.priority.lat != "undefined" && options.priority.lon != "undefined") {
                url += "&lat=" + options.priority.lat + "&lon=" + options.priority.lon;
            }
            curl.getJSON(url, {}, function(err, response, data) {
                if (err != null) {
                    callback(err);
                } else {
                    callback(data);
                }

            });
        }
    },
    reverseGeocode: function(coordinates, options, callback) {
        if (typeof coordinates.lat != "undefined" && typeof coordinates.lon != "undefined") {
            var url = "https://api-adresse.data.gouv.fr/reverse/?lon=" + coordinates.lon + "&lat=" + coordinates.lat;
            if (typeof options.type != "undefined") {
                url += "&type=" + options.type;
            }
            curl.getJSON(url, {}, function(err, response, data) {
                if (err != null) {
                    callback(err);
                } else {
                    callback(data);
                }
            });
        }
    }
}