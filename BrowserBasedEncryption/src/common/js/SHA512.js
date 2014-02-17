/**
* This class wraps the functions in sha.js into SHA-512
* @class SHA512
*/
var SHA512 = new Class({

	Extends: SHA,

	/**
	* Constructor
	* @method initialize
	* @param {byte[]} key Array of bytes representing the key
	*/
	initialize: function ()
	{
		this.parent("SHA-512");
	}

});