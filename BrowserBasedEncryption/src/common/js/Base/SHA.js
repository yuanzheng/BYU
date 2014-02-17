/**
* This class wraps the SHA functions in sha.js to provide a consistent interface into it
* @class SHA
*/
var SHA = new Class({

	variant: null,

	/**
	* Constructor
	* @method initialize
	* @param {String} variant The hashing algorithm to use
	*/
	initialize: function (variant)
	{
		this.variant = variant;
	},

	/**
	* Computes a hash from the byte buffer
	* @method computeHash
	* @param {byte[]} buffer Array of bytes (in javascript, a byte is really an integer that is <= 255)
	*/
	computeHash: function (buffer)
	{
		var shaObj = new jsSHA(buffer, "BYTES");
		return shaObj.getHash(this.variant, "BYTES");
	}

});