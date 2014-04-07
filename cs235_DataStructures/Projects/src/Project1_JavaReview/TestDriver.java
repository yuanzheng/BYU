package Project1_JavaReview;

import java.util.Random;
import java.util.List;
import java.util.ArrayList;

public class TestDriver
{
	private static String[] testFiles = {	"test1.txt", "test2.txt", "test3.txt", "test4.txt"	};
	private static Random rng;

	public static void main(String[] args)
	{
		final long defaultRandomSeed = 10;
		long randomseed = defaultRandomSeed;
		if (args.length > 0)
			randomseed = Long.parseLong(args[0]);

		rng = new Random(randomseed);

		System.out.println("JavaSkills TestDriver, v1.0 : Using random number seed " + randomseed);
		System.out.println("Testing Pair implementation ----------------------------");
		testPairExceptions();
		testPairEquals();
							
		System.out.println("\nTesting PairSet implementation -------------------------");
		testPairSetAddContains();
		testPairSetInterval();
		testPairSetExceptions();
		testPairSetIO();

		System.out.println("Tests Completed Successfully.");		
		
	}

	static void testPairExceptions() {
		System.out.print("\tTesting proper exception throwing ...\t");
		boolean goodflag;
		goodflag = true;
		try	{
			Pair t = JavaSkillsFactory.createPair(null, null);
			goodflag = false;
		} catch (IllegalArgumentException e)	{}
		try	{
			Pair t = JavaSkillsFactory.createPair("", null);
			goodflag = false;
		} catch (IllegalArgumentException e)	{}
		try	{
			Pair t = JavaSkillsFactory.createPair(null, "");
			goodflag = false;
		} catch (IllegalArgumentException e)	{}
		try	{
		                         // note that this won't throw an exception!
			Pair t = JavaSkillsFactory.createPair("", "");
		} catch (IllegalArgumentException e)	{ goodflag = false; }
		if (!goodflag) {
			System.out.println("FAILED");
			System.exit(0);
		}
		System.out.println("PASSED");
	}

	static void testPairEquals() {
		System.out.print("\tPerforming equals tests ...\t\t");
		final int testCount = 50;
		final int maxValue = 200;
		for (int i=0; i < testCount; i++)
		{	
			Integer s1;
			Integer s2;
			Pair p1;
			Pair p2;
			s1 = new Integer(rng.nextInt(maxValue));
			s2 = new Integer(rng.nextInt(maxValue));
			p1 = JavaSkillsFactory.createPair(s1,s2);
			p2 = JavaSkillsFactory.createPair(s1,s2);
			if (!p1.equals(p2) || !p2.equals(p1))	{
				System.out.println("FAILED\n");
				System.out.println(
				    "Pair.equals returned false when testing [" + s1 + "," + s2 + "]");
				System.exit(0);
			}
		}
		System.out.println("PASSED");
	}

	static void testPairSetAddContains() {
		System.out.print("\tDoing basic add and contains tests ...\t");
		PairSet p = JavaSkillsFactory.createEmptyPairSet();
		final int pairCount = 50;
		final int firstValue = 100;
		final int maxValue = 200;
		try	{
			int startLoc = rng.nextInt(firstValue);
			for (int i=0; i < pairCount; i++)
			{	
				Integer s1;
				Integer s2;
				s1 = new Integer(startLoc+i);
				s2 = new Integer(rng.nextInt(maxValue));
				if (!p.add(JavaSkillsFactory.createPair(s1,s2)))	// simple add
					throw new IllegalStateException(
					    "Failed to add a unique pair [" + s1 + "," + s2 + "]");	
				if (p.add(JavaSkillsFactory.createPair(s1,s2)))		// duplicate pair test
					throw new IllegalStateException(
					    "Added a duplicate pair [" + s1 + "," + s2 + "]");
				if (!p.contains(JavaSkillsFactory.createPair(s1,s2)))
				                                 // should contain the one we added
					throw new IllegalStateException(
					    "Contains failed for pair [" + s1 + "," + s2 + "]");
			}		
			if (p.size() != pairCount)
				throw new IllegalStateException(
				    "Size is incorrect. ACTUAL: " + p.size() + "  EXPECTED: 50");
		}	catch (IllegalStateException e)	{
			System.out.println("FAILED");
			e.printStackTrace();
			System.exit(0);
		}
		System.out.println("PASSED");

		System.out.print("\tTesting clear functionality ...\t\t");
		p.clear();
		if (p.size() != 0)	{
			System.out.println("FAILED");
			System.exit(0);
		}
		System.out.println("PASSED");
	}

	static void testPairSetInterval() {
		System.out.print("\tDoing basic getItemsInInterval tests...\t");
		final int pairCount = 50;
		final int maxValue = 200;
		final int getCount = 5;
		PairSet p = JavaSkillsFactory.createEmptyPairSet();
		Pair[] data = new Pair[pairCount];
		for (int i=0; i < pairCount; i++)	{
			Integer s1;
			Integer s2;
			s1 = new Integer(i);
			s2 = new Integer(rng.nextInt(maxValue));
			if (!p.add(JavaSkillsFactory.createPair(s1, s2)))	{
				System.out.println("FAILED\nFailed to add a unique pair to the PairSet.");
				System.exit(0);
			}
			data[i] = JavaSkillsFactory.createPair(s1,s2);
		}
		//printPairs("Data: ", data);
		for (int i=0; i < getCount; i++)	{
			Pair[] temp;
			temp = generateRange(data);
			Pair p1;
			Pair p2;
			p1 = temp[0];	p2 = temp[1];
			Pair[] student;
			student = p.getItemsInInterval(p1,p2);
			if (!validatePairs(p1,p2,data,student))	{
				System.out.println("FAILED");
				System.exit(0);
			}
		}
		System.out.println("PASSED");
	}

	static void testPairSetExceptions() {							
		System.out.print("\tTesting proper exception throwing ...\t");
		PairSet p = JavaSkillsFactory.createEmptyPairSet();
		boolean goodflag;
		goodflag = true;
		try	{	
			p.add(null);
			goodflag = false;
		} catch (IllegalArgumentException e)	{}
		try	{	
			p.contains(null);
			goodflag = false;
		} catch (IllegalArgumentException e)	{}			
		try	{	
			p.getItemsInInterval(null,null);
			goodflag = false;
		} catch (IllegalArgumentException e)	{}
		if (!goodflag)	{
			System.out.println("FAILED");
			System.exit(0);
		}
		System.out.println("PASSED");
	}

	static void testPairSetIO() {		
		System.out.println("\nTesting File I/O Capabilities --------------------------");
		System.out.print("\tLoading a non-existant file ...\t\t");
		PairSet p;
		p = FileIO.loadPointFile("waybogus.nonexistant.txt");
		if (p!=null)	{
			System.out.println("FAILED");
			System.exit(0);
		}
		System.out.println("PASSED");
			
		System.out.println("\tLoading files, saving Pair data from getItemsInInterval, loading in");
		System.out.println("\tsaved files and validating those against the original files.");
		try	{
			for (int i=0; i<testFiles.length; i++)	{
			    testFile(i);
			}
		}
		catch (IllegalStateException e)
		{
			System.out.println("FAILED\n");
			e.printStackTrace();
			System.exit(0);
		}
	}

	static void testFile(int i) {
		System.out.print("\t\t" + testFiles[i] + " : \t\t\t");
		PairSet p = FileIO.loadPointFile(testFiles[i]);
		if (p == null)
			throw new IllegalStateException(
			    "loadPointFile returned null when opening " + testFiles[i] + "!");

		Pair[] data;
		data = p.getAllPairs();		// retrieves all the pair objects
		Pair[] temp;
		temp = generateRange(data);	// generates a range for getItemsInInterval
		Pair p1;
		Pair p2;
		p1 = temp[0];	p2 = temp[1];

		Pair[] original_data;
		original_data = p.getItemsInInterval(p1,p2);	// get Pairs in interval
		PairSet original_set;
		                                         // construct a PairSet out of these Pairs
		original_set = JavaSkillsFactory.createPairSet(original_data);
		//printPairs("orig_data: ", p1);

		if (!validatePairs(p1,p2,data,original_data))
		                            // getItemsInInterval returned incorrect pairs.
			throw new IllegalStateException("ValidatePairs failed.");
		if (!FileIO.savePointFile(original_set, "save" + (i+1) + ".txt"))
			throw new IllegalStateException(
			    "savePointFile returned false when saving to save" + (i+1) + ".txt");
		PairSet loaded_set;
		loaded_set = FileIO.loadPointFile("save" + (i+1) + ".txt");	// load it back
		if (loaded_set == null)
			throw new IllegalStateException(
			    "loadPointFile returned null when trying to load saved file, save" +
			    (i+1) + ".txt!");
		Pair[] loaded_data;
		loaded_data = loaded_set.getAllPairs();	// retrive all pairs from loaded set

		if (!validatePairs(p1,p2,data,loaded_data))
			throw new IllegalStateException("ValidatePairs Failed.");
		System.out.println("PASSED");
	}

	private static boolean validatePairs(Pair p1, Pair p2, Pair[] data, Pair[] student)
	{
		List a = new ArrayList();
		List b = new ArrayList();
		for (int i=0; i<data.length; i++)	{
			if (fallsBetween(data[i], p1, p2))	{
				if (!containsPoint(student, data[i]))
					a.add(data[i]);
				b.add(data[i]);
			}
		}
		if (b.size() != student.length)
		{
			System.out.println("\nStudent answer's length did not equal answer key's length.");
			// uncomment the following lines if more output is desired.
			System.out.print(" for the interval: [" +
					 p1.getFirst() + "," + p1.getSecond() +
					 "] to [" +
					 p2.getFirst() + "," + p2.getSecond() +
					 "]\n");
			printPairs("Data: ", data);
			printPairs("Student Answer: ", student);
			printPairs("TestDriver Answer: ", (Pair[])b.toArray(new Pair[0]));
			return false;
		} 
		if (!a.isEmpty())
		{
			printPairs("\nStudent answer did not contain the following pairs: ",
				   (Pair[])a.toArray(new Pair[0]));
			// uncomment the following lines if more output is desired.
			System.out.print(" for the interval: [" +
					 p1.getFirst() + "," + p1.getSecond() +
					 "] to [" +
					 p2.getFirst() + "," + p2.getSecond() +
					 "]\n");
			printPairs("Data: ", data);
			printPairs("Student Answer: ", student);
			printPairs("TestDriver Answer: ", (Pair[])b.toArray(new Pair[0]));
			return false;
		}
		
		return true;	
	}
	
	private static boolean containsPoint(Pair[] arr, Pair test)
	{
		for (int i=0; i<arr.length; i++)
			if (arr[i].equals(test))
				return true;
		return false;
	}
	
	private static boolean fallsBetween(Pair c, Pair p1, Pair p2)
	{
	    return 
		(c.getFirst().compareTo(p1.getFirst()) >= 0) &&
		(c.getFirst().compareTo(p2.getFirst()) <= 0) &&
		(c.getSecond().compareTo(p1.getSecond()) >= 0) &&
		(c.getSecond().compareTo(p2.getSecond()) <= 0);
	}		
	
	private static void printPairs(String prefix, Pair[] p)
	{
		System.out.print(prefix);
		if (p==null)
			System.out.println("null");
		else	{
			for (int i=0; i<p.length; i++)
				System.out.print("[" + p[i].getFirst() + "," + p[i].getSecond() + "] ");
			System.out.println();
		}
	}	
	
	private static void printPairs(String prefix, Pair p)
	{
		System.out.print(prefix);
		if (p==null)	System.out.println("null");
		else	{
			System.out.println("[" + p.getFirst() + "," + p.getSecond() + "] ");
		}
	}
	
	private static Pair[] generateRange(Pair[] data)
	{
		Comparable smallestFirst;
		Comparable smallestSec;
		Comparable largestFirst;
		Comparable largestSec;
		Pair[] retp = new Pair[2];
		int indx1;
		int indx2;
		indx1 = rng.nextInt(data.length);
		indx2 = rng.nextInt(data.length);
		if (data[indx1].getFirst().compareTo(data[indx2].getFirst()) > 0)	{
			smallestFirst = data[indx2].getFirst();
			largestFirst = data[indx1].getFirst();
		} else	{
			smallestFirst = data[indx1].getFirst();
			largestFirst = data[indx2].getFirst();
		}
		if (data[indx1].getSecond().compareTo(data[indx2].getSecond()) > 0)	{
			smallestSec = data[indx2].getSecond();
			largestSec = data[indx1].getSecond();
		} else	{
			smallestSec = data[indx1].getSecond();
			largestSec = data[indx2].getSecond();
		}
		                                  // note these are passed by reference
		retp[0] = JavaSkillsFactory.createPair(smallestFirst, smallestSec);
		retp[1] = JavaSkillsFactory.createPair(largestFirst, largestSec);
		return retp;
	}
	
	
}
		
