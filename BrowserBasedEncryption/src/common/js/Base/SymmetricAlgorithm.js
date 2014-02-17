/**
* Enumeration of symmetric encryption modes
* @class SymmetricAlgorithmMode
*/
var SymmetricAlgorithmMode = {

	OFB: 0,
	CFB: 1,
	CBC: 2

};


/**
* @class SymmetricAlgorithm
*/
var SymmetricAlgorithm = new Class({

	/**
	* Mode of encryption
	* @property mode
	* @type int
	*/
	mode: null,

	/**
	* Constructor
	* @method initialize
	* @param {byte[]} key Key used for encryption
	* @param {byte[]} iv IV used for certain modes of encryption
	* @param {int} mode Mode of encryption
	*/
	initialize: function (mode)
	{
		this.mode = mode;
	},

    /**
    * Encrypts the data.
    * @method encrypt
    * @param {byte[]} key Key to use in encryption.
    * @param {byte[]} iv IV to use in encryption.
    * @param {byte[]} data Array of bytes to encrypt.
    * @return byte[] of cipher
    */
    encrypt: function (key, iv, data) { },

    /**
    * Decrypts the data.
    * @param {byte[]} key Key to use in decryption.
    * @param {byte[]} iv IV to use in decryption.
    * @method decrypt
    * @param {byte[]} data Array of bytes to decrypt
    * @return byte[] of plain text
    */
    decrypt: function (key, iv, data) { }

});



