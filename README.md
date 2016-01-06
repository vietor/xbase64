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

> *byte buffer* type defined.
>> NodeJS: Buffer, string (input only)
>> Browser: Number Array, string (input only)

### .encode(bytebuffer, [padding])

Encodes *byte buffer* as a Base64 string.

> xbase64.encode("i'm xbase64");
>> output string: aSdtIHhiYXNlNjQ

> xbase64.encode("i'm xbase64", true)
>> output string: aSdtIHhiYXNlNjQ=

### .decode(string)

Decodes a Base64 string as a *byte buffer*.

> xbase64.decode("aSdtIHhiYXNlNjQ")
>> output to *byte buffer*: i'm xbase64

> xbase64.decode("aSdtIHhiYXNlNjQ=")
>> output to *byte buffer*: i'm xbase64


### .decodeAsText(string)

Decodes a Base64 string as a string.

> xbase64.decodeAsText("aSdtIHhiYXNlNjQ")
>> output to string: i'm xbase64

> xbase64.decodeAsText("aSdtIHhiYXNlNjQ=")
>> output to string: i'm xbase64

---

### .urlencode(bytebuffer)

Encodes *byte buffer* as a URL Safe Base64 string.

### .urldecode(string)

Decodes a URL Safe Base64 string as a *byte buffer*.

### .urldecodeAsText(string)

Decodes a URL Safe Base64 string as a string.


---

### .create(string)

Create a customize table XBase64 object.

#### XBase64.encode(buffer)

Encodes a buffer as a XBase64 string.

#### XBase64.decode(string)

Decodes a XBase64 string as a *byte buffer*.

#### XBase64.decodeAsText(string)

Decodes a XBase64 string as a string.


---

### random(string)

Generate new string from parameter string's random order.
