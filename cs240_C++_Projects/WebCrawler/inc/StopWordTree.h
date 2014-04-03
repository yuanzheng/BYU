#ifndef STOPWORDTREE_H
#define STOPWORDTREE_H
#include "StopWord.h"


/*
 *  StopWordTree implements the StopWord binary search tree for load and store the stop word. 
 *  Each word shown up in each page should be searched on this tree.
 *  By using BST data structure each word can be fast searched.
 */
class StopWordTree {
	
	public:
	
		//!  No-arg constructor.  Initializes an empty BST
		WordTree();
	
	
		//!  Copy constructor.  Makes a complete copy of its argument
		WordTree(const WordTree & other);
	
	
		//!  Destructor
		~WordTree();
	
	
		//!  Assignment operator.  Makes a complete copy of its argument
		//!  @return Reference to oneself
		WordTree& operator =(const WordTree & other);
	
	
		//!  @return a pointer to the root node of the tree, or NULL if the tree is empty.
		StopWord * GetTree()const;
	
	
		//!  @return true if the BST is empty, or false if the BST is not empty
		bool IsEmpty() const;
	
	
		//!  Removes all values from the BST
		void Clear();
	
	 
		//!  @return the number of values in the BST
		int GetSize() const;
	
	
		/* 
		 *  Inserts each stop word from the stopword.txt fileinto the BST. 
		 *  Searching the StopWord BST. each stop word are unique.
		 *  
		 *  @param word The new value being inserted
		 *
		 */
		void Insert(const std::string & word);
	
	
		/*
		 *  Searches the tree for the word on the StopWord BST tree.
		 *  
		 *  @param word The new word being searched for
		 *
		 *  @return true if this word is found on the tree, otherwise is false.
		 */
		bool Find(const std::string & word) const;
	
	
	private:
		StopWord * root;   // points to the root of StopWord BST
		int size;           // the size of BST, number of words
	
		// these methods may be can assist above methods to build the  tree and delete the tree.
		void ParseTree(const StopWord * node);
		StopWord * Addit(const std::string & v, StopWord * curNode);
		void CleanTree(WordIndex * curNode);
		StopWord * Search(const std::string & v, StopWord * curNode) const; 
};


#endif
