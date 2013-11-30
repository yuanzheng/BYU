package com.aes;

public class InverseCipher extends CryptographicAlgorithm implements CipherInterface {
	private int Nb;
	private byte[][] state;
	
	public InverseCipher(byte[][] in, int Nb){
		
		state = in;
		this.Nb = Nb;
	}

	public void AddRoundKey(byte[] cipherKey, int round, int loop){
		//byte[][] out = new byte[4][4];
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
	
	public void InvShiftRows(){
		
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
	
	public void InvSubBytes(){
		
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
	
	public void InvMixColumns(){		
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
}
