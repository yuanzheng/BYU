package com.aes;

public abstract class CryptographicAlgorithm implements CipherInterface {

	protected byte[][] state;
	protected byte[][] cipherKey;
	protected final int Nb = 4;
	protected int Nk;
	protected int Nr;
	
	public CryptographicAlgorithm() {
		Nk = 4;
		Nr = 10;
	}
		
	//XOR
	private byte ffAdd(byte a, byte b){
		
		return (byte)(a^b);
		
	}
	
	//[SY] testing xtime
	private static byte xtime(byte a){
		byte out = (byte)(a<<1);
		
		if(a<0)
			return (byte)(out^((byte)0x1b));
		else
			return out;
			
	}
	
	protected byte ffMultiply(byte xL, byte yR){
		
		byte result = xL;
		//byte a = 0;
		byte b = 0;
		
		for(int i=0; i<8; i++)
		{
			if((yR & 1) == 1)  // check if the first bit is 1
			{
				b = (byte)(b ^ result);
			}
			
			result = xtime(result);
			yR = (byte)(yR>>1);
		}
		
		return b;
	}
	
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
					System.err.println("Error! " + error);
				}
			}
	}
	
	
	// initialize input and key into state blocks
	public void init(String input, String key) {
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
		cipherKey = getState(key, Nk);
		//print them out, check them
		System.out.println("message state: ");
		printOut(state, Nb);
		System.out.println("cipherKey: ");
		printOut(cipherKey, Nk);
	}
	
	
	public abstract void SubBytes();
	public abstract void ShiftRows();
	public abstract void MixColumns();
	
	
	
	
	//print result in matrix
	protected void printOut(byte[][] state, int Columns){
		
		for(int i = 0; i<4; i++){
			for(int j = 0; j<Columns; j++)
				System.out.print(Converting(state[i][j]) + " ");
			System.out.println();
		}
	}
	
	protected String Output(byte[][] state, int Columns) {
		StringBuilder st = new StringBuilder("");
		for(int i = 0; i<Columns; i++){
			for(int j = 0; j<4; j++)
				st.append(Converting(state[j][i]));
		}
		return st.toString();
	}
	//converting hex number to string
	protected String Converting(byte in){
		int _unsigned_Num = 0;
		String output = "";
		
		_unsigned_Num = (in+ 256)%256;
		
		if((in >= 0) && (in < 16))
			output += "0";
		
		output += Integer.toString(_unsigned_Num,16);

		//output += " ";

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
	
	private byte[][] getState(String input, int Nk)
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
