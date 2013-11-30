package com.aes;

public class CryptographicAlgorithm {

	//XOR
	public byte ffAdd(byte a, byte b){
		
		return (byte)(a^b);
		
	}
	
	//[SY] testing xtime
	private byte xtime(byte a){
		byte out = (byte)(a<<1);
		
		if(a<0)
			return (byte)(out^((byte)0x1b));
		else
			return out;
			
	}
	
	public byte ffMultiply(byte xL, byte yR){
		
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
}
