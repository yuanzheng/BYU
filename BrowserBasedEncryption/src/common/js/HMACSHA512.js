
/**
* This class wraps the functions in sha.js into SHA-512
* @class HMACSHA512
*/
var HMACSHA512 = new Class({

	Extends: HMAC,

	/**
	* Constructor
	* @method initialize
	* @param {byte[]} key Array of bytes representing the key
	*/
	initialize: function (key)
	{
		this.parent("SHA-512", key);
	}

});