
package Project1_JavaReview;

import java.util.Random;

/** PointFileGenerator.java - Generates random point files.
*
*   syntax: java PointFileGenerator filename.txt #points
*   	where
*		#points = 	number of random points to generate.
*		filename.txt =	the file to save these points into.
*/

public class PointFileGenerator	{
	
	public static void main(String[] args)
	{
		if (args.length != 2)	{
			System.out.println("syntax: java PointFileGenerator filename.txt #points");
			System.exit(0);
		}
		
		Random rng = new Random(System.currentTimeMillis());
		int num = Integer.parseInt(args[1]);
		Integer i1;
		Integer i2;
		PairSet p = JavaSkillsFactory.createEmptyPairSet();
		
		while (p.size() < num)	{
			i1 = new Integer(rng.nextInt(num));
			i2 = new Integer(rng.nextInt(num));
			p.add(JavaSkillsFactory.createPair(i1, i2));
		}
		FileIO.savePointFile(p,args[0]);
	}
}

