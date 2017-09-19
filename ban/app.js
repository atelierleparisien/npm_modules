var ban = require('./index.js');


var options = {
    limit: 100,
    priority: {
        lat: 48.789,
        lon: 2.789
    }
};
ban.geocode('8 bd du port', options, function(res) {
    console.log(res);
});

ban.reverseGeocode({ lat: "48.357", lon: "2.37" }, { type: "street" }, function(res) {
    console.log(res);
});