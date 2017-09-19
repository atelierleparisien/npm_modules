# csurf with a ignoring routes ability

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Node.js [CSRF](https://en.wikipedia.org/wiki/Cross-site_request_forgery) protection middleware fork based on the csurf module.

Requires either a session middleware or [cookie-parser](https://www.npmjs.com/package/cookie-parser) to be initialized first.

  * If you are setting the ["cookie" option](#cookie) to a non-`false` value,
    then you must use [cookie-parser](https://www.npmjs.com/package/cookie-parser)
    before this module.
  * Otherwise, you must use a session middleware before this module. For example:
    - [express-session](https://www.npmjs.com/package/express-session)
    - [cookie-session](https://www.npmjs.com/package/cookie-session)

If you have questions on how this module is implemented, please read
[Understanding CSRF](https://github.com/pillarjs/understanding-csrf).

## Installation

```sh
$ npm install csurf-noroutes
```

## API

```js
var csurfNoRoutes = require('csurf-noroutes')
```

### csurfNoRoutes([options])

Create a middleware for CSRF token creation and validation. This middleware
adds a `req.csrfToken()` function to make a token which should be added to
requests which mutate state, within a hidden form field, query-string etc.
This token is validated against the visitor's session or csrf cookie.

#### Options

The `csurf-noroutes` function takes an optional `options` object that may contain
any of the csurf legacy keys.

A new option is available

##### ignoreRoutes
an array of routes that you want the module to ignore when looking up for a valid CSRF (typically routes used by the POST method).
This parameter supports the use of regular expressions to define url patterns.

With Strings : 
```js
{ignoreRoutes:['/my/first/route','/mySecond/route','etc..']}
```
With a Regex : 
```js
{ignoreRoutes:[/\/remoteCalls\/(.*)/g]}
```
Both : 
```js
{ignoreRoutes:['/remoteCalls/login',/\/remoteCalls\/(.*)/g]}
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/csurf-noroutes.svg
[npm-url]: https://npmjs.org/package/csurf-noroutes
[downloads-image]: https://img.shields.io/npm/dm/csurf.svg
[downloads-url]: https://npmjs.org/package/csurf-noroutes
