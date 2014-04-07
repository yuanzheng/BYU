
Java Skills

Introduction
        Using a text editor to write Java programs
        Compiling Java programs using the command-line javac compiler
        Running Java programs using the command-line java interpreter
        Using packages to organize Java programs
        Reading and writing text files from a Java program
        Implementing Java interfaces on a class
        Implementing the equals and toString methods on a class
        Using the Comparable interface
        Throwing and catching exceptions

		
PairSet
This project requires you to implement a data structure named PairSet that stores 
a collection of Pair objects. Each Pair object contains two values (appropriately 
named first and second). The pairs in a PairSet might represent locations on the 
Earths surface (latitude, longitude), dimensions of rectangles (width, height), points 
on a plane (x, y), or any other kind of information that is naturally stored as pairs. 
In addition to storing pairs, the PairSetdata structure also supports queries to determine 
which pairs fall in a specified range. The interface for the PairSet data structure 
is shown below:
 
	public interface Pair
	{
		Comparable getFirst();
		Comparable getSecond();
	}
	 
	public interface PairSet
	{
		boolean add(Pair newpair);
		boolean contains(Pair checkpair);
		Pair[] getItemsInInterval(Pair lowerLeft, Pair upperRight);
		int size();
		Pair[] getAllPairs();
		void clear( );
	}
	
The pairs in a PairSet are unique. This means that a given pair is stored at most once no matter 
how many times it is inserted into the PairSet. Two pairs are considered to be equivalent if the 
corresponding values within the pairs are equal (as defined by the equals method). Both elements 
of a Pair must be objects that implement the Comparable interface. This allows the PairSet to search 
for pairs that fall within a specified range. The Pair interface provides methods for retrieving 
both elements of a pair. The PairSet interface provides methods for inserting pairs, asking if a pair 
is in the set, and returning all pairs that fall in a particular range of values. The fully documented 
interface definitions are found in Pair.java and PairSet.java.

Requirement #1
Write two Java classes, one that implements the Pair interface, and one that implements the PairSet 
interface. Each methods behavior should be implemented precisely according to the methods documentation. 
In addition to implementing the Pair interface, your Pair implementation class must also implement the 
Java equals and toString methods. To simplify your PairSet implementation, you may assume that a PairSet 
will never contain more than 2000 pairs.

File I/O 
Once you have implemented the Pair and PairSet interfaces, you will have a generic data structure that 
is capable of storing pairs of anyComparable objects (strings, dates, times, numbers, etc.). Next, you 
will use your PairSet class for a specific application, storing sets of points (integer pairs 
representing x, y coordinates). The file FileIO.java contains the outline for a class that has methods 
for reading and writing files of points.The loadPointFile method reads a file of integer pairs and 
returns a PairSet containing those pairs. The savePointFile method takes aPairSet of points and writes 
them to a text file.

public class FileIO
{
	public static PairSet loadPointFile(String fileName) {
		// read in point file and return a PairSet of points
	}
	public static boolean savePointFile(PairSet points, String fileName) {
		// save the PairSet of points to the specified file
	}
}
 
The format of the point files is demonstrated below. Each line in the file contains a pair of integers 
with the two values being separated by a space.
 
8 -6
-1 8
6 3
0 4
-2 4
0 1
7 -9
4 4
0 0
-3 -5

Requirement #2
Using your Pair and PairSet classes, implement the loadPointFile and savePointFile methods on the 
FileIO class. Each methods behavior should be implemented precisely according to the methods 
documentation. Please note that the elements of a Pair must be objects, so the values read from a 
point file should be represented as Integer objects rather than int primitives.

Testing
The file TestDriver.java contains a test driver program that you may use to test your implementations 
of Pair, PairSet, and FileIO. The test driver is designed to test all of the functionality described 
in the previous sections. However, the test driver should not be viewed as a replacement for doing 
your own testing. The test driver does not test all possible cases, so even if your code passes the 
test driver, it is still possible that it will fail to pass off. It is your responsibility to make 
sure that your code works.


The test and pass off drivers need to instantiate your Pair and PairSet implementation classes in 
order to test them. The problem with this is that the test programs do not know what names you chose 
for your classes, making it impossible to directly instantiate them. Therefore, you will also need to 
write a factory class that knows how to create Pair and PairSet objects and return them to the test 
programs. The file JavaSkillsFactory.javacontains the outline of a factory class that has methods for 
creating Pair and PairSet objects. You must also implement these methods, as shown below:
 
public class JavaSkillsFactory
{
	public static Pair createPair(Comparable first, Comparable second)
	{
		// create one of your Pair objects and return it
	}
	public static PairSet createEmptyPairSet()
	{
		// create one of your PairSet objects and return it
	}
	public static PairSet createPairSet(Pair[] pairdata)
	{
		// create one of your PairSet objects, initialize it,
		// and return it
	}
}
 
The createPair method creates a new Pair object containing the passed-in elements. The 
createEmptyPairSet method creates a new emptyPairSet. The createPairSet method creates a new PairSet 
and populates it with the passed-in array of Pairs. Your implementations of these methods should use 
new to create instances of your implementation classes, perform any required initialization of those 
objects, and then return them.

Requirement #3
Implement the methods on the JavaSkillsFactory class. Each methods behavior should be implemented 
precisely according to the methods documentation.

