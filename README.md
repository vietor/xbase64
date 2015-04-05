# xbase64

A customizable table base64 implementation. Remove the padding character.

## Installation

With [npm](http://npmjs.org) do:

```
npm install xbase64
```

## Usage

Require it within your module:

``` javascript
  var xbase64 = require('xbase64');
```

### .encode(buffer)

Encodes a buffer as a Base64 string.

### .decode(string)

Decodes a Base64 string as a buffer.

---

### .urlencode(buffer)

Encodes a buffer as a URL Safe Base64 string.

### .urldecode(string)

Decodes a URL Safe Base64 string as a buffer.

---

### .create(string)

Create a customize table XBase64 object.

#### XBase64.encode(buffer)

Encodes a buffer as a XBase64 string.

#### XBase64.decode(string)

Decodes a XBase64 string as a buffer.

