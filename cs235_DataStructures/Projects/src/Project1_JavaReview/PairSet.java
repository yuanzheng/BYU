
package Project1_JavaReview;


public interface PairSet
{
	/**
	* Clears all points from this PairSet
	* 
	* @return void
	*/
	void clear( );
	
	/**
	* Adds a Pair to the current set of Pair objects.
	* 
	* @param newpair The new pair to be added to the set.
	* @return true if the item was successfully added to the set,
	*         false if it was already in the set.
	* @throws IllegalArgumentException if newpair is null, or if one of it's members is null.
	*/
	boolean add(Pair newpair);
	
	/**
	* Determines whether a given Pair object exists in the current set of Pairs.
	* 
	* @param checkpair The pair to be checked.
	* @return true if the item was in the set, false if not.
	* @throws IllegalArgumentException if checkpair is null, or if one of it's members is null.
	*/	
	boolean contains(Pair checkpair);
	
	/**
	* Gets the number of pairs currently in the set.
	* 
	* @return the number of pairs in the set.
	*/
	int size();
	
	/**
	* Generates an array of Pairs that fall equal to or below upperRight
	* and equal to or above lowerLeft.
	* lowerLeft and upperRight define two points on a rectangle,
	* so it would generate a list of all the Pairs whose first elements 
	* fell between lowerLeft's and upperRight's first elements,
	* and whose second elements fell between the second 
	* elements of lowerLeft and upperRight.
	*
	* @param lowerLeft Defines the lower-left corner of the rectangle and provides a lower bound.
	* @param upperRight Defines the upper-right corner of the rectangle and provides a upper bound.
	* @return an array of Pairs appearing in the defined interval.
	* @throws IllegalArgumentException if either pair is null, or their members are null.
	*/	
	Pair[] getItemsInInterval(Pair lowerLeft, Pair upperRight);

	/**
	* Returns the array containing the Pairs in the set.
	* The returned array's size must be the same as the set size.
	*
	* @return the array containing the pairs in the set.
	*/	
	Pair[] getAllPairs();
		
} 

