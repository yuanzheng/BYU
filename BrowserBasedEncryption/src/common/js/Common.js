/// <reference path="lib/CommonReferences.js" />

/**
* The Kiwi modules handles all Kiwi operations that happen for secure communciation
* within the browser.
* @module Kiwi
* @requires jQuery, MooTools
*/

/**
* String.format from C#
* @method String.format
*/
if (!String.format)
{
	String.format = function (format, arg0, arg1, arg2)
	{
		var s = format;
		for (var i = 0; i < arguments.length - 1; i++)
		{
			var reg = new RegExp("\\{" + i + "\\}", "gm");
			s = s.replace(reg, arguments[i + 1]);
		}
		return s;
	};
}

/**
* String.endsWith from C#
* @method String.format
*/
if (!String.prototype.endsWith)
{
	String.prototype.endsWith = function (suffix)
	{
		return (this.substr(this.length - suffix.length) === suffix);
	};
}

/**
* String.startsWith from C#
* @method String.format
*/
if (!String.prototype.startsWith)
{
	String.prototype.startsWith = function (prefix)
	{
		return (this.substr(0, prefix.length) === prefix);
	};
}

/**
* String.trim from C#
* @method String.trim
*/
if (!String.prototype.trim)
{
	String.prototype.trim = function ()
	{
		return jQuery.trim(this);
	};
}

/**
* Array copyTo function for javascript
* @method Array.copyTo
*/
if (!Array.copyTo)
{
    Array.copyTo = function (sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
        var count = 0;
        var sIndex = sourceIndex;
        var dIndex = destinationIndex;
        while (count < length) {
            destinationArray[dIndex] = sourceArray[sIndex];
            count++; sIndex++; dIndex++;
        }
    };
}

/**
* Method to handle different date time formats in JS.
* @method Date.parseJson
* @return Date
*/
if (!Date.parseJson) {

    var dateTimeRegex;

    Date.parseJson = function (jsonString) {
        // Initialize here to make sure that XRegExp is already loaded.
        if (!dateTimeRegex)
            dateTimeRegex = new XRegExp('^\\/Date\\((?<offset>-?\\d+)(?<timezone>-\\d{4})?\\)\\/$', 'i');

        var results = dateTimeRegex.exec(jsonString);
        if (results != null) {
            var parsedDateTime = new Date(+results.offset);
            //if (results.timezone)
            //    parsedDateTime.setHours(parsedDateTime.getHours() + ((+results.timezone) / 100));
            return parsedDateTime;
        }
        else
            return new Date(jsonString);
    };
}

/**
* Gets a JSON date formatted so that .NET can handle it.
* @method Date.prototype.toMSJson
* @return {String}
*/
if (!Date.prototype.toMSJson) {
    Date.prototype.toMSJson = function (date) {
        return date = '/Date(' + this.getTime() + ')/'; 
    };
}

/**
* Gets an array of random bytes of the given order.
* @method Math.getBytes
* @return [byte]
*/
if (!Math.getRandomBytes) {
    Math.getRandomBytes = function (size) {
        if (size == 0)
            return null;

        var temp = [];
        for (var i = 0; i < size; i++) {
            temp.push(Math.floor(Math.random() * 256));
        }
        return temp;
    };
}