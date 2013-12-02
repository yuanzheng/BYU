package com.aes;


public class InverseCipher extends CryptographicAlgorithm {
		
	public InverseCipher(){
		
	}

	public void ShiftRows(){
		
		byte temp = 0;
		
		for(int i = 0; i<4; i++){
			if(i != 0){
				for(int loop = i; loop>0; loop--){
					temp = state[i][Nb-1];
					for(int column = Nb-1; column>0; column--)
						state[i][column] = state[i][column - 1];
					state[i][0] = temp;
				}
			}
		}
	}
	
	public void SubBytes(){
		
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
				
				state[j][i] = (byte)InvSbox[left][right];					
			}
	}
	
	public void MixColumns(){		
		byte[][] temp = new byte[4][4];
		
		for(int i = 0; i<4; i++){
			for(int j = 0; j<4; j++){
				byte sum = 0;
				
				for(int k = 0; k<4; k++){
					sum = (byte)(sum ^ ffMultiply(state[k][i], b[j][k]));					
				}			
				temp[j][i] = sum;
			}
		}
		//replace state by new values
		for(int i = 0; i<4; i++)
			for(int j = 0; j<4; j++)
				state[i][j] = temp[i][j];
	}
	
	public byte[] KeyExpansion() {
		KeyExpansion genKey = new KeyExpansion(cipherKey, Nb, Nk, Nr, Mode.DECRYPTION);
		
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
	
	
	public String Decryption(String cipher, String key) {
		super.init(cipher, key);
		byte[] dKey = KeyExpansion();
		
    	AddRoundKey(dKey, Nr*Nb*4, (Nr+1)*Nb*4 -1);
    	
    	System.out.println("Decryption:***************");
    	for(int round = Nr-1; round>0; round--){
    		SubBytes();
    		ShiftRows();
    		MixColumns();
    		AddRoundKey(dKey, round*Nb*4, (round+1)*Nb*4 -1);
    	}
    	
    	SubBytes();
    	ShiftRows();
    	AddRoundKey(dKey, 0, Nb*4-1);
    	System.out.println("text: ");
    	printOut(state, Nb);
    	
    	return Output(super.state, Nb);
	}
	
	
}
