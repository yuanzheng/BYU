/**
* Implements AES encryption
* @class AesSymmetricAlgorithm
*/
var AesSymmetricAlgorithm = new Class({

	Extends: SymmetricAlgorithm,

	/**
	* Constructor
	* @method initialize
	* @param {int} mode Mode of encryption.
	*/
	initialize: function (mode) {
		this.parent(mode);
	},

	/**
	* Encrypts the data.
	* @method encrypt
    * @param {byte[]} key Key to use in encryption.
    * @param {byte[]} iv IV to use in encryption.
	* @param {byte[]} data Array of bytes to encrypt.
	* @return byte[] of cipher
	*/
	encrypt: function (key, iv, data) {
		return slowAES.encrypt(data.clone(), this.mode, key, iv);
	},

	/**
	* Decrypts the data.
    * @param {byte[]} key Key to use in decryption.
    * @param {byte[]} iv IV to use in decryption.
	* @method decrypt
	* @param {byte[]} data Array of bytes to decrypt
	* @return byte[] of plain text
	*/
	decrypt: function (key, iv, data) {


	    return slowAES.decrypt(data.clone(), this.mode, key, iv);
	}

});