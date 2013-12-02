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
public class Cipher extends CryptographicAlgorithm {
	/*
	private byte[][] state;

	private byte[][] cipherKey;
	private final int Nb = 4;
	private int Nk;
	private int Nr;
*/	
	public Cipher()
	{/*
		Nk = 4;
		Nr = 10;
		*/
	}
	/*
	private Cipher(byte[][] in){
	
		state = in;
	}
	*/
	/*[SY] byte to String converting, in finite field, all numbers
	 * are unsigned 8-bits hex
	 */
	/*
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
	*/
	public void SubBytes(){
		
		int left = 0;
		int right = 0;
		
		for(int i = 0; i<4; i++)
			for(int j = 0; j<4; j++){
				int temp = 0;
				if(super.state[j][i]<0)
					temp = super.state[j][i] + 256;
				else
					temp = super.state[j][i];
				
				right = temp%16;
				left = (temp/16)%16;
				
				super.state[j][i] = (byte)Sbox[left][right];					
			}
	}
	
	public void ShiftRows(){
		
		byte temp = 0;
		
		for(int i = 0; i<4; i++){
			if(i != 0){  // start from the second row
				for(int loop = i; loop>0; loop--){
					temp = super.state[i][0];
					for(int column = 1; column<4; column++)
						super.state[i][column - 1] = super.state[i][column];
					super.state[i][3] = temp;
				}
			}
		}
	}
	
	public void MixColumns(){		
		byte[][] temp = new byte[4][4];
		
		for(int i = 0; i<4; i++){    // state column
			for(int j = 0; j<4; j++){
				byte sum = 0;
				
				for(int k = 0; k<4; k++){
					sum = (byte)(sum ^ ffMultiply(super.state[k][i], a[j][k]));					
				}			
				temp[j][i] = sum;
			}
		}
	
		//replace state by new values
		for(int i = 0; i<4; i++)
			for(int j = 0; j<4; j++)
				super.state[i][j] = temp[i][j];
		
	}
	
	
	public byte[] KeyExpansion() {
		KeyExpansion genKey = new KeyExpansion(cipherKey, Nb, Nk, Nr, Mode.ENCRYPTION);
		
        byte[] generatedKey;
        generatedKey = genKey.getKey();
        
        /********* verification and test **********/
        System.out.println("\ngeneratedKey for each round: ");
        
        for(int x = 0; x<(Nr+1)*Nb*4; x++){
        	if(x%4 == 0)
        		System.out.println();
        	System.out.print(Converting(generatedKey[x]));
        }
        return generatedKey;
	}
	
	
	public String Encryption(String input, String key) {
		super.init(input, key);
		byte[] generatedKey = KeyExpansion();
		
		/* ******************************************** Encryption *******************/
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
    	printOut(super.state, Nb);

    	System.out.println("\n");
    	
    	return Output(super.state, Nb);
    	
	}
	
	
	
}
