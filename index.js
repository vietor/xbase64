'use strict';

function XBase64(table) {
    if(typeof table != 'string')
        throw new Error('table must a string');
    if(table.length != 64)
        throw new Error('talbe must 64 characters');
    if(!/^[\x00-\x7F]+$/.test(table))
        throw new Error('table must ascii characters');

    var encoding = table.split('');
    var decoding = new Buffer(0x7F);

    (function() {
        var pos;
        for(pos = 0; pos < decoding.length; ++pos)
            decoding[pos] = 0xFF;
        for(pos = 0; pos < table.length; ++pos)
            decoding[table.charCodeAt(pos)] = pos;
    }());

    this.encode = function(data) {
        if(typeof data == 'string')
            data = new Buffer(data);
        var output = [];
        var step1 = Math.floor(data.length / 3) * 3;
        var step2 = data.length % 3;
        var pos, code1, code2, code3;
        for(pos = 0; pos < step1; pos += 3) {
            code1 = data[pos];
            code2 = data[pos + 1];
            code3 = data[pos + 2];
            output.push(encoding[code1 >> 2]);
            output.push(encoding[(code1 & 0x3) << 4 | (code2 >> 4)]);
            output.push(encoding[(code2 & 0xF) << 2 | (code3 >> 6)]);
            output.push(encoding[code3 & 0x3F]);
        }
        if(step2 == 2) {
            code1 = data[pos];
            code2 = data[pos + 1];
            output.push(encoding[code1 >> 2]);
            output.push(encoding[(code1 & 0x3) << 4 | (code2 >> 4)]);
            output.push(encoding[(code2 & 0xF) << 2]);
        }
        else if(step2 == 1) {
            code1 = data[pos];
            output.push(encoding[code1 >> 2]);
            output.push(encoding[(code1 & 0x3) << 4]);
        }
        return output.join("");
    };

    this.decode = function(text) {
        var step1 = Math.floor(text.length / 4) * 4;
        var step2 = text.length % 4;
        var output = new Buffer(step1 / 4 * 3 + (step2? (step2 - 1): 0));
        var pos, idx = 0, char1, char2, char3, char4;
        for(pos = 0; pos < step1; pos += 4) {
            char1 = text.charCodeAt(pos);
            char1 = char1 < decoding.length? decoding[char1]: 0;
            char2 = text.charCodeAt(pos + 1);
            char2 = char2 < decoding.length? decoding[char2]: 0;
            char3 = text.charCodeAt(pos + 2);
            char3 = char3 < decoding.length? decoding[char3]: 0;
            char4 = text.charCodeAt(pos + 3);
            char4 = char4 < decoding.length? decoding[char4]: 0;
            output[idx++] = char1 << 2 | char2 >> 4;
            output[idx++] = char2 << 4 | char3 >> 2;
            output[idx++] = char3 << 6 | char4;
        }
        if(step2 == 3) {
            char1 = text.charCodeAt(pos);
            char1 = char1 < decoding.length? decoding[char1]: 0;
            char2 = text.charCodeAt(pos + 1);
            char2 = char2 < decoding.length? decoding[char2]: 0;
            char3 = text.charCodeAt(pos + 2);
            char3 = char3 < decoding.length? decoding[char3]: 0;
            output[idx++] = char1 << 2 | char2 >> 4;
            output[idx++] = char2 << 4 | char3 >> 2;
        }
        else if(step2 == 2) {
            char1 = text.charCodeAt(pos);
            char1 = char1 < decoding.length? decoding[char1]: 0;
            char2 = text.charCodeAt(pos + 1);
            char2 = char2 < decoding.length? decoding[char2]: 0;
            output[idx++] = char1 << 2 | char2 >> 4;
        }
        return output;
    };
}

var base64 = new XBase64("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
var base64url = new XBase64("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_");

module.exports = {
    create: function(table) {
        return new XBase64(table);
    },
    encode: function(data) {
        return base64.encode(data);
    },
    decode: function(text) {
        return base64.decode(text);
    },
    urlencode: function(data) {
        return base64url.encode(data);
    },
    urldecode: function(text) {
        return base64url.decode(text);
    }
};
