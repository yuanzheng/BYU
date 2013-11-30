package com.aes;

public class Cipher extends CryptographicAlgorithm implements CipherInterface {

private byte[][] state;
	
	public Cipher(byte[][] in){//
	
		state = in;
	}
	/*[SY] byte to String converting, in finite field, all numbers
	 * are unsigned 8-bits hex
	 */
	
	public void AddRoundKey(byte[] cipherKey, int round, int loop){
		
		int k = round;
		for(int i = 0; i<4; i++)
			for(int j = 0; j<4; j++){
				try{
					if(k > loop)
						throw new Exception();
					
					state[j][i] = ffAdd(state[j][i], cipherKey[k]);
					k++;
				}catch(Exception error){
					System.err.println("Error! Line 48 in class Cipher.");
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
				
				state[j][i] = (byte)Sbox[left][right];					
			}
	}
	
	public void ShiftRows(){
		
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
	
	public void MixColumns(){		
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
	
}
