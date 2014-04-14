
package cs235.spell;

class TestDriver {

    private static String[] words = {
	"words.txt",
	null,
	"words.txt",
	null,
	"words.txt",
	"dict.txt",
	"dict.txt",
	"dict.txt",
	"dict.txt",
	"dict.txt"
    };

    private static String[] docs = {
	"test.txt",
	"short.txt",
	"empty.txt",
	"one-word.txt",
	"one-word.txt",
	"bill-of-rights.txt",
	"emancipation-proclamation.txt",
	"gettysburg-address.txt",
	"monroe-doctrine.txt",
	"preamble.txt",
    };

    private static String[] results = {
	"do: 3\ndocument: 1\nhow: 2\nis: 1\nreally: 3\nworks: 3\n",
	"a: 1\ndocument: 3\nis: 1\nshort: 2\nthis: 1\nvery: 2\n",
	"",
	"word: 1\n",
	"",
	"be: 4, 6, 6, 9, 10, 29, 33, 34, 39, 40, 42, 43, 47, 50, 51, 51, 52," 
	+ " 52, 54, 61, 62, 69, 70, 75, 80\nby: 3, 6, 9, 34, 41, 59, 61, 69, "
	+ "69, 81, 85, 86\ndefence: 64\ni: 20\nii: 27\niii: 32\niv: 38\nix: 79\n"
	+ "re: 70\nthings: 43\nv: 46\nvi: 57\nvii: 67\nviii: 74\nx: 84\nxxvii: 14\n",

	"abraham: 29, 74\naccomac: 47\nalabama: 44\nanne: 48\narkansas: 41\nas: 8, 30,"
	+ " 33, 37, 46, 50, 53\nbe: 10, 11, 19, 21, 25, 55, 59, 65, 69\nberkeley: 47\n"
	+ "bernard: 41\nby: 5, 18, 22, 30, 52, 70\ncarolina: 45, 45\ncharles: 42\nd: 4,"
	+ " 8, 34\ndefence: 60\nelizabeth: 47\nflorida: 44\ngeorgia: 45\ni: 29, 52, 59, "
	+ "61, 64, 70\njames: 42\njanuary: 8, 17, 34\njefferson: 42\nlafourche: 43\n"
	+ "lincoln: 29, 74\nlouisiana: 41\nmary: 43\nme: 30\nmississippi: 44\n"
	+ "morthhampton: 47\nnd: 4\nnorfolk: 48, 48\norleans: 43, 44\npalquemines:"
	+ " 42\nportsmouth: 49\nseptember: 4\nst: 8, 17, 34, 41, 42, 42, 42, 43,"
	+ " 43\nsupressing: 33\nterrebone: 43\ntexas: 41\nthings: 6\nvirginia: 45," 
	+ " 46\nyork: 47\n",

	"as: 11, 41\nbe: 21, 23, 50\nby: 28, 55\nnicolay: 32\n",

	"america: 41\namerican: 17\nas: 16, 19, 50, 57, 79\natlantic: 33\nbe: 19, 26,"
	+ " 27, 39, 68, 72, 93\nbritain: 8\nby: 5, 8, 10, 14, 17, 20, 38, 43, 44,"
	+ " 57, 70, 81\nde: 79\neurope: 67, 76\neuropean: 20, 33, 51, 57\njudgement:"
	+ " 62\npetersburg: 5\nportugal: 24, 67\nrussian: 2\nshew: 67\nspain: 24, 59,"
	+ " 67, 71, 91\nst: 5\n",

	"america: 9\ndefence: 6\n"
    };

    private static String bogusFile = "bogus-totally-nonexistant.txt";
	
    public static void main(String[] args) {

	SpellingChecker check = CheckerFactory.createSpellingChecker();
		
	System.out.println("Spelling Checker TestDriver v.95, 6/22/2004");
	System.out.print("Loading non-existant files ...\t");
				
	if (check.loadDictionary(bogusFile)) {
	    System.err.println("FAILED\nloadDictionary should have returned "
			       + "false for " + bogusFile);
	    System.exit(1);
	}
	System.out.println("PASSED");
		
	for (int i = 0; i < docs.length; i++ ) {
	    check = CheckerFactory.createSpellingChecker();
	    System.out.println("Performing test case " 
			       + i + " ====================================");
	    System.out.print("Dictionary: " + words[i] + "...");
	    if (words[i] != null)
		if (!check.loadDictionary(words[i]))	{
		    System.err.println("FAILED\nloadDictionary returned false for "
				       + words[i] + ".");
		    System.exit(1);
		}
	    System.out.print("OK"); 
	    System.out.print("    Checking document " + docs[i] + "... ");
	    String bad = check.checkDocument(docs[i]);
	    if (!results[i].equals(bad))	{
		System.err.println("FAILED\ncheckDocument returned a different "+ 
				   "string than the answer key.");
		System.err.println("Student returned: " + bad);
		System.err.println("Answer Key was: " + results[i]);
		System.exit(1);
	    }
	    System.out.println("PASSED");
	}
	System.out.println("Simple tests completed successfully");
		
	// add your own test cases here
		
		
    }
}

