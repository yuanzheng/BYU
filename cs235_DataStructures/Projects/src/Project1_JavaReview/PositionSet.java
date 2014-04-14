package Project1_JavaReview;

import java.util.ArrayList;
import java.util.List;


public class PositionSet implements PairSet {

	private List<Pair> pairList;
	private final int capacity = 2000;
	
	public PositionSet() {
		pairList = new ArrayList<Pair>();
	}
	
	public PositionSet(Pair[] pairs) {
		pairList = new ArrayList<Pair>();
		
		for (Pair p:pairs)
		{
			pairList.add(p);
		}
	}
	
	@Override
	public void clear() {
		
		pairList.removeAll(pairList);
	}

	@Override
	public boolean add(Pair newpair) throws IllegalArgumentException {
		
		if(!contains(newpair) && pairList.size() < capacity) {
			pairList.add(newpair);
			return true;
		}
		
		return false;
	}
	
	private boolean validPair(Pair newpair) {
		if(newpair.getFirst() == null || newpair.getSecond() == null) {
			return false;
		}
		return true;
	}

	@Override
	public boolean contains(Pair checkpair) throws IllegalArgumentException {
		
		if(checkpair == null)
			throw new IllegalArgumentException("This pair is null!");
		
		if(!validPair(checkpair))
			throw new IllegalArgumentException("In this pair, one of it's members is null");

		for(Pair p : pairList) {
			if(p.equals(checkpair)) // Pair implementation has equals()
				return true;
		}
		
		return false;
	}

	@Override
	public int size() {
		int size = pairList.size();
		return size;
	}

	@Override
	public Pair[] getItemsInInterval(Pair lowerLeft, Pair upperRight) throws IllegalArgumentException {
	
		if(lowerLeft == null || upperRight == null)
			throw new IllegalArgumentException("Either lowerLeft or upperRight is null!");
		
		if(!validPair(lowerLeft) || !validPair(upperRight))
			throw new IllegalArgumentException("Either lowerLeft or upperRight, its members is null");

		List<Pair> result = new ArrayList<Pair>();
		
		for (Pair p:pairList) {
			if (lowerLeft.getFirst().compareTo(p.getFirst()) <= 0 &&
				lowerLeft.getSecond().compareTo(p.getSecond()) <= 0 &&
				upperRight.getFirst().compareTo(p.getFirst()) >= 0 &&
				upperRight.getSecond().compareTo(p.getSecond()) >= 0)
			{
				result.add(p);
			}
		}
				
		return convertArrayListToPairs(result);
	}
	
	// cannot cast Object array to Pair[], so using for loop cast each pair object
	private Pair[] convertArrayListToPairs(List<Pair> pairList) {
		Object[] p = pairList.toArray();
		Pair[] r = new Pair[pairList.size()];
		int c = 0;
		
		for(Object o : p) {
			r[c++] = (Pair) o;
		}
		
		return r;
	}

	@Override
	public Pair[] getAllPairs() {

		Pair[] pairs = new Pair[size()];
		int i=0;
		//Pair[] pairs = (Pair[]) locations.toArray();
		for(Pair p : pairList) {
			pairs[i] = p;
			i++;
		}
		return pairs;
	}
	
	

}
