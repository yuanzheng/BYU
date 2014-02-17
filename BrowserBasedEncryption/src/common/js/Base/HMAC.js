/**
* This class wraps the HMAC functions in sha.js to provide a consistent interface into it
* @class HMAC
*/
var HMAC = new Class({

	key: null,
	variant: null,

	/**
	* Constructor
	* @method initialize
	* @param {String} variant The hashing algorithm to use
	* @param {byte[]} key The key used for HMAC
	*/
	initialize: function (variant, key)
	{
		this.key = key;
		this.variant = variant;
	},

	/**
	* Computes an HMAC from the byte buffer
	* @method computeHash
	* @param {byte[]} buffer Array of bytes (in javascript, a byte is really an integer that is <= 255)
	*/
	computeHash: function (buffer)
	{
		var shaObj = new jsSHA(buffer, "BYTES");
		return shaObj.getHMAC(this.key, "BYTES", this.variant, "BYTES");
	}

});
