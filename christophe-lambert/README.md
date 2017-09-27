# Christophe Lambert : module node pour la conversion de coordonnées Lambert II étendu vers WGS84 et inversement

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]


## Installation

```sh
$ npm install christophe-lambert
```

## API

```js
var christophe = require('christophe-lambert');
```

### christophe.wgs84ToLambertII(latitude,longitude)

Convertit des coordonnées WGS84 (GPS) au format Lambert II étendu
Exemple :
```js
christophe.wgs84ToLambertII(48.8588377, 2.2770206); 
```


### christophe.lambertIIToWgs84(XLambert, YLambert)

Convertit des coordonnées Lambert II étendu au format WGS84 (GPS)
Exemple :
```js
christophe.lambertIIToWgs84(595631.43,2428946.11);
```



## License

[MIT](LICENSE) Pour le code

[npm-image]: https://img.shields.io/npm/v/christophe-lambertsvg
[npm-url]: https://npmjs.org/package/christophe-lambert
[downloads-image]: https://img.shields.io/npm/dmchristophe-lambert.svg
[downloads-url]: https://npmjs.org/package/christophe-lambert
