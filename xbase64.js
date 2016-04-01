(function(root, factory) {
    "use strict";

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define('xbase64', [], factory);
    } else {
        root.xbase64 = factory();
    }
})(typeof window === 'object' ? window : this, function() {
    "use strict";

    var hasBuffer = (typeof Buffer != 'undefined');
    var BASE64_PAD = "=";
    var BASE64_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var BASE64URL_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    function isString(obj) {
        return typeof obj == 'string';
    }

    function isNumberArray(obj) {
        return obj && Object.prototype.toString.call(obj) === '[object Array]' && obj.length > 0 && typeof obj[0] == 'number';
    }

    function mkBaseBuffer(param) {
        if (hasBuffer)
            return new Buffer(param);
        else {
            var i, out = [];
            for (i = param - 1; i > 0; --i)
                out[i - 1] = 0;
            return out;
        }
    }

    function mkByteBuffer(param) {
        if (hasBuffer) {
            if (Buffer.isBuffer(param))
                return param;
            else if (isString(param))
                return new Buffer(param);
        } else if (isString(param)) {
            var out = [];
            for (var i = 0, length = param.length; i < length; ++i)
                out.push(param.charCodeAt(i));
            return out;
        } else if (isNumberArray(param))
            return param;
        else
            throw new Error('cannot convert to byte buffer');
    }

    function mkString(param) {
        if (hasBuffer && Buffer.isBuffer(param))
            return param.toString();
        else if (isNumberArray(param)) {
            var out = [];
            for (var i = 0, length = param.length; i < length; ++i) {
                out.push(String.fromCharCode(param[i]));
            }
            return out.join('');
        } else
            throw new Error("need bytes buffer parameter");
    }

    function validateString(text) {
        if (!isString(text))
            throw new Error('need a string parameter');
    }

    function XBase64(table, padding) {
        if (typeof table != 'string')
            throw new Error('table must a string');
        if (table.length != 64)
            throw new Error('talbe must 64 characters');
        if (!/^[\x00-\x7F]+$/.test(table))
            throw new Error('table must ascii characters');
        if (padding) {
            if (typeof padding != 'string')
                throw new Error('padding must a string');
            if (padding.length != 1)
                throw new Error('padding must 1 characters');
            if (!/^[\x00-\x7F]+$/.test(table))
                throw new Error('padding must ascii characters');
        }

        var encoding = table.split('');
        var decoding = mkBaseBuffer(0x7F);

        (function() {
            var pos;
            for (pos = 0; pos < decoding.length; ++pos)
                decoding[pos] = 0xFF;
            for (pos = 0; pos < table.length; ++pos)
                decoding[table.charCodeAt(pos)] = pos;
        }());

        function encode(data, strip) {
            var output = [];
            var step1 = Math.floor(data.length / 3) * 3;
            var step2 = data.length % 3;
            var pos, code1, code2, code3;
            for (pos = 0; pos < step1; pos += 3) {
                code1 = data[pos];
                code2 = data[pos + 1];
                code3 = data[pos + 2];
                output.push(encoding[code1 >> 2]);
                output.push(encoding[(code1 & 0x3) << 4 | (code2 >> 4)]);
                output.push(encoding[(code2 & 0xF) << 2 | (code3 >> 6)]);
                output.push(encoding[code3 & 0x3F]);
            }
            if (step2 == 2) {
                code1 = data[pos];
                code2 = data[pos + 1];
                output.push(encoding[code1 >> 2]);
                output.push(encoding[(code1 & 0x3) << 4 | (code2 >> 4)]);
                output.push(encoding[(code2 & 0xF) << 2]);
                if (padding && !strip)
                    output.push(padding);
            } else if (step2 == 1) {
                code1 = data[pos];
                output.push(encoding[code1 >> 2]);
                output.push(encoding[(code1 & 0x3) << 4]);
                if (padding && !strip) {
                    output.push(padding);
                    output.push(padding);
                }
            }
            return output.join("");
        }

        function decode(text) {
            var length = text.length;
            if (padding) {
                if (length > 2 && text[length - 1] == padding)
                    --length;
                if (length > 1 && text[length - 1] == padding)
                    --length;
            }

            var step1 = Math.floor(length / 4) * 4;
            var step2 = length % 4;
            if (step2 == 1)
                throw new Error('incorect decode length');

            var output = mkBaseBuffer(step1 / 4 * 3 + (step2 ? (step2 - 1) : 0));
            var pos, idx = 0,
                char1, char2, char3, char4;
            for (pos = 0; pos < step1; pos += 4) {
                char1 = text.charCodeAt(pos);
                char1 = char1 < decoding.length ? decoding[char1] : 0;
                char2 = text.charCodeAt(pos + 1);
                char2 = char2 < decoding.length ? decoding[char2] : 0;
                char3 = text.charCodeAt(pos + 2);
                char3 = char3 < decoding.length ? decoding[char3] : 0;
                char4 = text.charCodeAt(pos + 3);
                char4 = char4 < decoding.length ? decoding[char4] : 0;
                output[idx++] = (char1 << 2 | char2 >> 4) & 0xff;
                output[idx++] = (char2 << 4 | char3 >> 2) & 0xff;
                output[idx++] = (char3 << 6 | char4) & 0xff;
            }
            if (step2 == 3) {
                char1 = text.charCodeAt(pos);
                char1 = char1 < decoding.length ? decoding[char1] : 0;
                char2 = text.charCodeAt(pos + 1);
                char2 = char2 < decoding.length ? decoding[char2] : 0;
                char3 = text.charCodeAt(pos + 2);
                char3 = char3 < decoding.length ? decoding[char3] : 0;
                output[idx++] = (char1 << 2 | char2 >> 4) & 0xff;
                output[idx++] = (char2 << 4 | char3 >> 2) & 0xff;
            } else if (step2 == 2) {
                char1 = text.charCodeAt(pos);
                char1 = char1 < decoding.length ? decoding[char1] : 0;
                char2 = text.charCodeAt(pos + 1);
                char2 = char2 < decoding.length ? decoding[char2] : 0;
                output[idx++] = (char1 << 2 | char2 >> 4) & 0xff;
            }
            return output;
        }

        this.encode = function(data) {
            return encode(mkByteBuffer(data));
        };

        this.decode = function(text) {
            validateString(text);
            return decode(text);
        };

        this.decodeAsText = function(text) {
            validateString(text);
            return mkString(decode(text));
        };
    }

    function randomString(text) {
        var i = 0;
        var out = [];
        var chars = text.split("");
        while (i < chars.length) {
            var pos = Math.floor(Math.random() * chars.length);
            if (chars[pos] != "USED") {
                ++i;
                out.push(chars[pos]);
                chars[pos] = "USED";
            }
        }
        return out.join("");
    }

    var base64 = new XBase64(BASE64_TABLE, BASE64_PAD);
    var base64url = new XBase64(BASE64URL_TABLE, BASE64_PAD);

    function stripPadding(text, padding) {
        return text;
    }

    return {
        create: function(table) {
            return new XBase64(table);
        },
        random: function(text) {
            return randomString(text);
        },
        encode: function(data, strip) {
            return base64.encode(data, strip);
        },
        decode: function(text) {
            return base64.decode(text);
        },
        decodeAsText: function(text) {
            return base64.decodeAsText(text);
        },
        urlencode: function(data, strip) {
            return base64url.encode(data, strip);
        },
        urldecode: function(text) {
            return base64url.decode(text);
        },
        urldecodeAsText: function(text) {
            return base64url.decodeAsText(text);
        }
    };
});
