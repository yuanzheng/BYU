package Project1_JavaReview;

public class Position implements Pair {

	/*
	 *  Both elements of a Pair must be objects that implement the Comparable interface. 
	 *  a generic data structure that is capable of storing pairs of any Comparable objects 
	 *  (strings, dates, times, numbers, etc.)
	 */
	private Comparable x;
	private Comparable y;
	
	
	public Position(Comparable x, Comparable y) {
		
		this.x = x;
		this.y = y;
	}
	
	@Override
	public Comparable getFirst() {
		
		return x;
	}

	@Override
	public Comparable getSecond() {
		
		return y;
	}
	
	/*
	 * Compares any Comparable objects (strings, dates, times, numbers, etc.)
	 * @param nextPosition The pair to be compared.
	 * @return true if x and y of nextPosition equal to current pair's x and y, false if not.
	 * 
	 */
	public boolean equals(Object nextPosition) {
		
		if(x.equals( ((Position)nextPosition).getFirst()) &&
				y.equals( ((Position)nextPosition).getSecond()) )
			return true;
		
		return false;
	}
	
	public String toString() {
		
		
		return "(" + x + ", " + y + ")";
	}
	

}
