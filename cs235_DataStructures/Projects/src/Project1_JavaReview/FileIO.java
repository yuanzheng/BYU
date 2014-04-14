
package Project1_JavaReview;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.StringTokenizer;

public class FileIO
{
	/**
	* Loads a set of Pair objects stored in the specified file and returns them as a PairSet object.
	* 
	* @param fileName The name of the file to be loaded
	* @return a reference to a PairSet object, which has the points that were read in from the file.
	*      If the file cannot be opened or the contents of the file are invalid, null is returned
	* @throws IllegalArgumentException if fileName is null
	*/
	public static PairSet loadPointFile(String fileName) throws IllegalArgumentException
	{
		PairSet set = new PositionSet();
		Pair newpair;
		BufferedReader in = null;
		
		if(fileName == null)
			throw new IllegalArgumentException("You pass a null as parameter of loadPointFile!");
		
		try {

			in = new BufferedReader(new FileReader("P1_testing/"+fileName));

		} catch (FileNotFoundException e1) {
			
			//e1.printStackTrace();
			return null;
		}
		
        String line;
        try {
			while ((line = in.readLine()) != null) {
				
				if (line.length() == 0)
					break;
				StringTokenizer st = new StringTokenizer(line);
			
				String s1 = st.nextToken();
				String s2 = st.nextToken();
				
				/*
				 * the elements of a Pair must be objects, so the values read from a point file should 
				 * be represented as Integer objects rather than int primitives.
				 */
			    Integer x = Integer.parseInt(s1);
			    Integer y = Integer.parseInt(s2);
   
			    newpair = new Position(x,y);
			    
			    if (!set.add(newpair)) {
			    	throw new IllegalStateException(
						    "Failed to add a unique pair [" + x + "," + y + "]");	
			    }
			}
    
		} catch (IOException e) {
			//e.printStackTrace();
			return null;
		}  
        finally {
        	try {
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
        }
		
		return set;
	}

	/**
	* Saves a PairSet to a file, in the form specified in the lab write-up.
	* 
	* @param points The PairSet object containing the Pair objects to be saved to fileName.
	* @param fileName the name of the file to be saved
	* @return true if the Pair objects were successfully written to the file,
	*         or false if an error occurred
	* @throws IllegalArgumentException if points and/or fileName is null
	*/
	public static boolean savePointFile(PairSet points, String fileName) throws IllegalArgumentException
	{
		if( points == null || fileName == null) {
			throw new IllegalArgumentException("Either points or fileName is null!");
		}
		
		PrintWriter out = null;
		
		try {
<<<<<<< HEAD
<<<<<<< HEAD
			out = new PrintWriter(new FileWriter("P1_testing/"+fileName));
=======
			out = new PrintWriter(new FileWriter(fileName));
>>>>>>> working
=======
			out = new PrintWriter(new FileWriter(fileName));
>>>>>>> working
			
			for(Pair p : points.getAllPairs()) {
				int x = (Integer)p.getFirst();
                int y = (Integer)p.getSecond();
                
                out.println(x + " " + y);
			}
			
		} catch (IOException e) {
			
			//e.printStackTrace();
			return false;
		}
		finally {
			out.close();
		}
		
		
		return true;
	}
}

