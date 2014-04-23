package Project2_SpellingChecker;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Collection;
import java.util.HashSet;
import java.util.Scanner;

public class SpellingChecker_Imp implements SpellingChecker {

	private Collection<String> myDictionary;
	
	public SpellingChecker_Imp() {
		myDictionary = new HashSet<String>();
	}
	
	@Override
	public boolean loadDictionary(String filename) {

		if(filename == null) {
			throw new IllegalArgumentException("file name is null!");
		}
		
		try {
			// one word per line
			Scanner dictsScan = new Scanner(new File(filename));
			
			while (dictsScan.hasNext())
			{	
				myDictionary.add(new String(dictsScan.next().toLowerCase()));
			}
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return false;
		}
		
		return true; 
	}

	@Override
	public String checkDocument(String filename) {


		if (filename == null)
			throw new IllegalArgumentException();
		
		
		return null;
	}

}
