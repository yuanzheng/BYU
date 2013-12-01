package com.aes;

/**
 * AES specification (fips-197) indicates that
 * AES-128: Nk=4, Nr=10
 * AES-192: Nk=6, Nr=12
 * AES-256: Nk=8, Nr=14
 * 
 * Nb=4, the number of colums (32-bit words) comprising the State
 * 
 * @author SongYz
 *
 */
public class Cipher extends CryptographicAlgorithm implements CipherInterface {

	private byte[][] state;
	//private byte[][] cipherKey;
	private final int Nb = 4;
	private int Nk;
	private int Nr;
	
	public Cipher()
	{
		Nk = 4;
		Nr = 10;
		state = new byte[4][Nb];
		//cipherKey = new byte[4][Nk];
	}
	/*
	private Cipher(byte[][] in){
	
		state = in;
	}
	*/
	/*[SY] byte to String converting, in finite field, all numbers
	 * are unsigned 8-bits hex
	 */
	
	private void AddRoundKey(byte[] cipherKey, int round, int loop){
		
		int k = round;
		for(int i = 0; i<4; i++)
			for(int j = 0; j<4; j++){
				try{
					if(k > loop)
						throw new Exception();
					
					state[j][i] = ffAdd(state[j][i], cipherKey[k]);
					k++;
				}catch(Exception error){
					System.err.println("Error! " + error);
				}
			}
	}
	
	private void SubBytes(){
		
		int left = 0;
		int right = 0;
		
		for(int i = 0; i<4; i++)
			for(int j = 0; j<4; j++){
				int temp = 0;
				if(state[j][i]<0)
					temp = state[j][i] + 256;
				else
					temp = state[j][i];
				
				right = temp%16;
				left = (temp/16)%16;
				
				state[j][i] = (byte)Sbox[left][right];					
			}
	}
	
	private void ShiftRows(){
		
		byte temp = 0;
		
		for(int i = 0; i<4; i++){
			if(i != 0){  // start from the second row
				for(int loop = i; loop>0; loop--){
					temp = state[i][0];
					for(int column = 1; column<4; column++)
						state[i][column - 1] = state[i][column];
					state[i][3] = temp;
				}
			}
		}
	}
	
	private void MixColumns(){		
		byte[][] temp = new byte[4][4];
		
		for(int i = 0; i<4; i++){    // state column
			for(int j = 0; j<4; j++){
				byte sum = 0;
				
				for(int k = 0; k<4; k++){
					sum = (byte)(sum ^ ffMultiply(state[k][i], a[j][k]));					
				}			
				temp[j][i] = sum;
			}
		}
	
		//replace state by new values
		for(int i = 0; i<4; i++)
			for(int j = 0; j<4; j++)
				state[i][j] = temp[i][j];
		
	}
	
	private byte[] KeyExpansion(byte[][] cipherKey) {
		KeyExpansion genKey = new KeyExpansion(cipherKey, Nb, Nk, Nr);
		
        byte[] generatedKey;
        generatedKey = genKey.getKey();
        
        System.out.println("\ngeneratedKey for each round: ");
        
        for(int x = 0; x<(Nr+1)*Nb*4; x++){
        	if(x%4 == 0)
        		System.out.println();
        	System.out.print(Converting(generatedKey[x]));
        }
        return generatedKey;
	}
	
	public void Encryption(String input, String key) {
		
		Nk = key.length()/8;  //the number of 32bits-word
		//int Nr = 10;//set the default value
		//System.out.println("Nk: " + Nk);
		
		if(key.length()==32)
			Nr = 10;
		else if(key.length()==48)
			Nr = 12;
		else if(key.length()==64)
			Nr = 14;
		else
			System.err.println("Error, supported key length, 128, 192, 0r 256 bits! ");
		
		//byte[][] state = new byte[4][Nb];
		//byte[][] cipherKey = new byte[4][Nk];
		
		//[SY] converting input and key string to byte Matrix formation
		state = ArrayConvertor(input, Nk);
		//state = getState(key, Nb);
		//cipherKey = ArrayConvertor(key, Nk);
		//testing
		byte[][] cipherKey = getState(key, Nk);
		//print them out, check them
		System.out.println("message state: ");
		printOut(state, Nb);
		System.out.println("cipherKey: ");
		printOut(cipherKey, Nk);
		
		/* ******************************************** Encryption *******************
		 * Starting, read key and plaintext
		 * Generating Keys, totally 11 keys for encrption loops
		 */
		
		byte[] generatedKey = KeyExpansion(cipherKey);
        
        System.out.println("\n\n\nStart encryption*******************:");
        
        /*
         * set breakpoint for debug
         */
        AddRoundKey(generatedKey, 0, Nb*4);
        //printOut(state,Nb);
        //System.out.println();
        //Start the encrypting loop, 9 round
        for(int round = 1; round<Nr; round++){
        	
        	SubBytes();
        	//printOut(state, Nb);
        	ShiftRows();
        	//printOut(state, Nb);
        	MixColumns();
        	//printOut(state, Nb);
        	AddRoundKey(generatedKey, round*Nb*4, (round+1)*Nb*4 -1);
        	//printOut(state, Nb);
        
        }
        //the 10th encrypting process
    	
        SubBytes();
        //printOut(state, Nb);
    	ShiftRows();
    	//printOut(state, Nb);
    	AddRoundKey(generatedKey, Nr*Nb*4, (Nr+1)*Nb*4 -1);
    	//print the cipher text generated.
    	System.out.println("\n\nFinal, the Ciphertext: ");
    	printOut(state, Nb);

    	System.out.println("\n");
    	
	}
	
	public static void main(String[] args) {
		String input = "00112233445566778899aabbccddeeff";
		//AES-128 debug
		//String key = "000102030405060708090a0b0c0d0e0f";
		
		
		//AES-192 debug
		//String key = "000102030405060708090a0b0c0d0e0f1011121314151617";
		
		//AES-256 debug
		String key = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";
		
		Cipher c = new Cipher();
		c.Encryption(input, key);
	}
	
	public void Decryption() {
		
	}
	
	//print result in matrix
	public void printOut(byte[][] state, int Columns){
		
		for(int i = 0; i<4; i++){
			for(int j = 0; j<Columns; j++)
				System.out.print(Converting(state[i][j]) + " ");
			System.out.println();
		}
	}
	//converting hex number to string
	private String Converting(byte in){
		int _unsigned_Num = 0;
		String output = "";
		
		_unsigned_Num = (in+ 256)%256;
		
		if((in >= 0) && (in < 16))
			output += "0";
		
		output += Integer.toString(_unsigned_Num,16);

		output += " ";

		return output;
	}
	// an alternative way to convert input into state format
	private byte[][] ArrayConvertor(String inOrkey,int Nk){
		
		byte[][] array = new byte[4][Nk];
		
		//convert plain text and key to hex from string type
		//if(Nk == 4)
		for(int j = 0; j<Nk; j++){
			int i = j*4*2;
			for(int k = 0; k<4; k++){
				int in=0; //the number of each character in hex
				if(i<inOrkey.length()) {
					//System.out.println(inOrkey.substring(i, i+2));
					in = Integer.parseInt(inOrkey.substring(i, i+2), 16); 
					//[SY] 16 is hex, convert all two char String into signed hex
					//System.out.println(in);
				}
				
				array[k][j] = (byte)in;
	
				i = i+2;
			}
		}
		//else //for the key length bigger than 32(192 or 256 bits key)
			
		
		return array;
	}
	
	public byte[][] getState(String input, int Nk)
	{
		char[] test = input.toCharArray();
		String[] in = new String[test.length/2];
		int counter = 0;
		for(int i=0; i<test.length; i++)
		{
			char a = test[i];
			char b = test[++i];
			in[counter++] = "" + a + b;
		}
		byte[][] output= new byte[4][Nk];
		
		counter = 0;
		for(int c=0; c<Nk; c++)
		{
			for(int r=0; r<4; r++)
			{
				output[r][c] = (byte)Integer.parseInt(in[counter++],16);
			}
		}
		return output;
	}
}
