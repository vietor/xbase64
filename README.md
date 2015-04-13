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

---

### .encode(buffer, [padding])

Encodes a buffer as a Base64 string.
> xbase64.encode("i'm xbase64");
>> output: aSdtIHhiYXNlNjQ
> xbase64.encode("i'm xbase64", true)
>> output: aSdtIHhiYXNlNjQ=

### .decode(string)

Decodes a Base64 string as a buffer.
> xbase64.decode("aSdtIHhiYXNlNjQ")
>> output: i'm xbase64
> xbase64.decode("aSdtIHhiYXNlNjQ=")
>> output: i'm xbase64

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

---

### random(string)

Generate new string from parameter string's random order.
