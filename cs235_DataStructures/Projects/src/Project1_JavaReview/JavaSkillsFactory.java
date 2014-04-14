
package Project1_JavaReview;

	/** Note to students:
	*  JavaSkillsFactory is a class that will return the implementations of the
	*  interfaces that are required for the project. Since we have this "factory" class, you are
	*  free to name the implementation classes whatever you choose, just so long as you specify it 
	*  here in the factory. 	
	*/

public class JavaSkillsFactory	{
		
	/**
	* Creates, initializes, and returns a new object that implements the PairSet interface
	*    from the given Pair objects.
	* 
	* @param pairdata An array of Pair objects that will be added into the PairSet object.
	* @return a reference to the new PairSet object
	* @throws IllegalArgumentException if any pair in pairdata or it's members is invalid. 
	*/ 
	public static PairSet createPairSet(Pair[] pairdata) throws IllegalArgumentException
	{	
		PairSet set;
		
		for (Pair p:pairdata)
		{
			if(p.getFirst() == null || p.getSecond() == null)
				throw new IllegalArgumentException("One of newpair members is null!");
		}
		
		set = new PositionSet(pairdata);
		
		return set;
	}
	
	/**
	* Creates new object that implements the PairSet interface.
	* 
	* @return a reference to the object that implements the PairSet interface.
	*/ 
	public static PairSet createEmptyPairSet()
	{
		PairSet set = new PositionSet();
		return set;
	}
	
	/**
	* Creates a new instance of the class that implements the Pair interface.
	* @param first Value to be placed as the 1st element of the new Pair object.
	* @param second Value be placed as the 2nd element of the new Pair object. 
	* @return a new instance of the class that implements the Pair interface.
	* @throws IllegalArgumentException if either first or second are null.
	*/	
	public static Pair createPair(Comparable first, Comparable second) throws IllegalArgumentException
	{
		if(first == null || second == null)
			throw new IllegalArgumentException("One of newpair members is null!");
		
		Pair newPair = new Position(first, second);
		return newPair;
	}
}

