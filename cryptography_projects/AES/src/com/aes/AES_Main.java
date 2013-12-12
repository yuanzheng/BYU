package com.aes;

public class AES_Main {

	public static void main(String[] args) {
		String input = "00112233445566778899aabbccddeeff";
		//AES-128 debug
		//String key = "000102030405060708090a0b0c0d0e0f";
		
		
		//AES-192 debug
		//String key = "000102030405060708090a0b0c0d0e0f1011121314151617";
		
		//AES-256 debug
		String key = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";
		
		Cipher c = new Cipher();
		String ciphertext = c.Encryption(input, key);
		System.out.println(ciphertext + "\n");
		
		InverseCipher t = new InverseCipher();
		String plaintext = t.Decryption(ciphertext, key);
		System.out.println(plaintext + "\n");
	} 
}
