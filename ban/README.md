# BAN : module node pour utilisation de la Base Adresse Nationale

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

La Base Adresse Nationale est une base de données qui a pour but de référencer l'intégralité des adresses du territoire français. [BAN](https://adresse.data.gouv.fr/) 

Ce module permet une utilisation simple de deux de ses WebServices : le géocodage (obtenir les coordonnées GPS à partir d'une adresse) et le géocodage inverse (obtenir une adresse à partir de coordonnées GPS).

L'API de la BAN est dispnible à cette adresse : [https://adresse.data.gouv.fr/api](https://adresse.data.gouv.fr/api)

## Installation

```sh
$ npm install ban
```

## API

```js
var ban = require('ban');
```

### ban.geocode(adresse, options, callback)

Récupère un geojson FeatureCollection.
Exemple :
```js
var options = {};

ban.geocode('8 bd du port', options, function(res) {
    console.log(res);
});
```


#### Options

Les options disponibles sont celles documentées sur le site de la BAN (excepté l'autocomplete), à savoir:
```js
var options = {
    limit: 100,
    postcode:"44380", //Type String pour cas particulier de la Corse
    priority: {
        lat: 48.789,
        lon: 2.789
    },
    type:"street"
};
```



### ban.reverseGeocode(coordinates, options, callback)

Récupère un geojson FeatureCollection.
Exemple :
```js
ban.reverseGeocode({ lat: "48.357", lon: "2.37" }, { type: "street" }, function(res) {
    console.log(res);
});
```

#### Options

Les options disponibles sont celles documentées sur le site de la BAN, à savoir:
```js
var options = {
    type:"street"
};
```



## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/csurf-noroutes.svg
[npm-url]: https://npmjs.org/package/csurf-noroutes
[downloads-image]: https://img.shields.io/npm/dm/csurf.svg
[downloads-url]: https://npmjs.org/package/csurf-noroutes
