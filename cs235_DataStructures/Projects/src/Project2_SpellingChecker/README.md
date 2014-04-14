##Project 2 Spelling Checker##

####Introduction####
A spelling checker reads the words in a document and outputs a list of misspelled words. For each misspelled word, the program outputs the word followed by a list of the line numbers where the word is found in the document.
 
The program decides which words are misspelled by using a dictionary of correct words. The program searches the dictionary for each word in the document. If a word from the document cannot be found in the dictionary, the word is added to the list of misspelled words.

After you read this specification, you might want to check out the [TIPS](http://students.cs.byu.edu/~may109/~cs235/summer2009/projects/tips.php#SPELLING) page.

####Project Files####
The following files are required to complete the project. You should download these files with a web browser. You are not allowed to modify these files in any way except for implementing methods that were intentionally left empty. Specifically, interface definitions may not be modified, and all code must remain in the cs235.spell package.
[spell.zip](http://students.cs.byu.edu/~may109/~cs235/summer2009/projects/spell/spell.zip) 

####Dictionary File Format####
The spelling checker reads one or more dictionaries of correct words. Each dictionary is a text file that contains a list of words, one word per line as shown in this example.

	many
	this
	dogs
	fly
	think

 
Loading dictionaries is additive; if you load 200 dictionaries, all of the (unique) words in all 200 dictionaries will now be in the set of correct words. Loading a new dictionary into the spelling checker should not remove any of the words that were previously in the set of correct words (although new words that are duplicates of old words need not be added).

####Document Files####
The documents to be spell checked are just regular text files (i.e., sequences of characters). The spelling checker reads in the file to be spell checked and extracts all of the words from the file. Each word in the file is checked against the words in the currently loaded dictionaries in order to detect misspelled words. If a word is not found in the currently loaded dictionaries, it is considered to be misspelled. A document file might contain English prose, or it could just be a list of words. The program does the same thing in either case: 1) extracts the words in the file and 2) checks to see if they're in the dictionary.
 
How does the program find the words in the document file? Words are defined as sequences of letters that are separated by characters that are not letters. The characters that you need to check for are numbers, white space (spaces, tabs, new lines, etc.), periods, commas, colons, semi-colons, parentheses, apostrophes, hyphens, equals, pluses, percents, slashes, quotes, asterisks, square braces, curly braces, less than, greater than, question marks, exclamation marks, ampersands, vertical bars and underscores. (Look [here](http://students.cs.byu.edu/~may109/~cs235/summer2009/projects/spell/symbols.html) for a literal list of these non-letter characters/delimiters).

####Output Format####
The output of the spelling checker is a sorted list of words, one word per line. Use a \n character to indicate a new line. Each word is lower case and followed by a colon and a comma-separated list of line numbers where the word is found in the document. Make sure to remember the space after the comma.
 
	short: 1, 2
	this: 1
	very: 2

####Requirement #1: Write a Class that Implements the cs235.spell.SpellingChecker Interface####
The file SpellingChecker.java defines an interface named SpellingChecker. SpellingChecker has two methods. The first method isloadDictionary which loads a dictionary file into the spelling checker. More than one dictionary can be loaded into the spelling checker dictionary. The spelling checker uses the union of all the dictionaries that are loaded. The second method is checkDocument which reads the words from a document and checks them against the loaded dictionaries. When you look for a word in the dictionary, the comparison should not be case-sensitive.
 
You are required to write a class that implements the SpellingChecker interface. You might name your class something likeSpellingCheckerImpl. Put your implementation class in the cs235.spell package.
 
Your spelling checker implementation could use a number of supporting classes such as Dictionary, Document, and Index. You could also use a number of classes from the Java class library such as Set, Map, and List. (NOTE: Set, Map, and List are interfaces. You should use one of the classes that implements them.) A Dictionary object could contain a Set of words. A Document object could have the ability to parse a document into individual words. An Index object could contain a Map of key/value pairs where the key is a word and the value is a List of line numbers. The exact implementation is left up to you.

####Requirement #2: Implement the Method in the cs235.spell.CheckerFactory class####
The file CheckerFactory.java contains a class named CheckerFactory. This class has one method namedcreateSpellingChecker. You must implement this method so that it creates a new instance of your spelling checker class and returns it.

####Requirement #3: Test Your Code####
You are responsible for testing your code and making sure that it works. To assist your testing effort (and to make it more fun), we have provided a program with a graphical user interface that allows you to interactively load dictionaries and documents, and run your spelling checker to highlight the misspelled words.This program is found in SpellCheckGUI.java.


A test driver program is also provided to help you test your code. The test driver is found in TestDriver.java. The files:
words.txt, dict.txt,test.txt, short.txt, empty.txt, one-word.txt, bill-of-rights.txt, emancipation-proclamation.txt,gettysburg-address.txt, monroe-doctrine.txt, preamble.txt 
must be in the current directory when you run the test driver.
 
Using the test driver should help you get your code working and help you determine when it is ready to be passed off. In fact, you are required to make your code work with the test driver before passing it off. When you pass off your program, a program similar (but not identical) to the test driver will be used to test your code.
