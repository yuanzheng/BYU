package com.aes;

public class KeyExpansion extends CryptographicAlgorithm  {

	private final int Nb;
	private final int Nk;
	private final int Nr;
	private byte[] Key;
	private Mode operation;
	private byte[] dKey; //for the equivalent inverse cipher
	
	public KeyExpansion(byte[][] cipherKey, int Nb, int Nk, int Nr, Mode operation){
		this.Nb = Nb;
		this.Nk = Nk;
		this.Nr = Nr;
		this.operation = operation;
		
		Key = new byte[4*Nb*(Nr+1)];
		dKey = new byte[4*Nb*(Nr+1)];
		keySwitch(cipherKey);
	}
	
	private void keySwitch(byte[][] cipherKey){
		int i = 0;
		
		while(i < Nk){ //Nk is the numbers of 32 bit words
			for(int row = 0; row<4; row++)
				Key[i*4 + row] = cipherKey[row][i];	
			
			i++;
		}
	}
	
	private byte[] RotWord(byte[] w){
		byte temp = w[0];
		for(int loop = 1; loop<4; loop++){
			w[loop - 1] = w[loop];
			
			if(loop == 3)
				w[loop] = temp;
		}
		
		return w;
	}
	
	private byte[] SubWord(byte[] w){
		int left = 0;
		int right = 0;
		
		for(int i = 0; i<4; i++){
			
			int temp = 0;
			if(w[i]<0)
				temp = w[i] + 256;
			else
				temp = w[i];
			
			right = temp%16;
			left = (temp/16)%16;
			
			w[i] = (byte)Sbox[left][right];	
		}
		return w;
		
	}
	
	private void GenerateEncryptKey(){
		
		byte[] temp = new byte[4];
		int i = Nk;
		
		while(i < Nb * (Nr + 1)){
			
			for(int j =0; j < 4; j++){
				temp[j] = Key[(i - 1) * 4 + j];
			}
			
			if(i % Nk == 0){

				RotWord(temp);
				SubWord(temp);
				temp[0] = (byte)(temp[0] ^ (byte)(Rcon[i / Nk]));
				
			}else if((Nk>6) & (i%Nk==4))
				SubWord(temp);
			
			int p = i * 4;
			for(int j =0; j < 4; j++){
				Key[p] = (byte)(Key[p - Nk*4] ^ temp[j]);
				p++;
			}
			
			
			i++;			
		}
	}
	
	private void GenerateDecryptKey(){
		
		byte[] temp = new byte[4];
		int i = Nk;
		
		while(i < Nb * (Nr + 1)){
			
			for(int j =0; j < 4; j++){
				temp[j] = Key[(i - 1) * 4 + j];
			}
			
			if(i % Nk == 0){

				RotWord(temp);
				SubWord(temp);
				temp[0] = (byte)(temp[0] ^ (byte)(Rcon[i / Nk]));
				
			}else if((Nk>6) & (i%Nk==4))
				SubWord(temp);
			
			int p = i * 4;
			for(int j =0; j < 4; j++){
				Key[p] = (byte)(Key[p - Nk*4] ^ temp[j]);
				p++;
			}
			
			/*
			 * [SY] for the equivalent inverse Cipher, creating a decryption key expansion
			 *     which is as same as cryption key.
			 */
			
			for(int k=0; k<(Nr + 1)*Nb*4; k++)
				dKey[k] = Key[k];
			
			for(int round = 1; round<Nr; round++)
				MixColumns(dKey, round);
	
			i++;			
		}
	}
	
	private void MixColumns(byte[] dKey, int round){		
		byte[][] key_seq = new byte[4][4];
		
		int x = round * 16;
		
		//retrieval the partial key in 16byte matrix
		for(int i = 0; i<4; i++){
			for(int j = 0; j<4; j++){
				key_seq[j][i] = dKey[x];
				x++;
			}
		}
			
		int y = round * 16;
		for(int i = 0; i<4; i++){
			for(int j = 0; j<4; j++){
				byte sum = 0;
				
				for(int k = 0; k<4; k++){
					sum = (byte)(sum ^ ffMultiply(key_seq[k][i], b[j][k]));					
				}
				dKey[y] = sum;
				y++;
			}
		}
	}
	
	public byte[] getKey(){
		GenerateEncryptKey();
		
		return Key;
					
	}
	
	public byte[] getDKey(){
		GenerateDecryptKey();
		return dKey;
	}


	public void SubBytes() {
		
	}
	public void ShiftRows() {
		
	}
	public void MixColumns() {
		
	}
}
