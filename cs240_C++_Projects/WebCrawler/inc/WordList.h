#ifndef WORDLIST_H
#define WORDLIST_H
#include <iostream>
#include <string>
#include <cassert>
#include "WordIndex.h"


/*
 *  WordList implements the WordIndex binary search tree to populate word index 
 *  for record all information of each word shown up in each page. It includes the word, 
 *  page object, and times in the same page. 
 */
class WordList {
	
	public:
	
		//!  No-arg constructor.  Initializes an empty BST
		WordList();
	
	
		//!  Copy constructor.  Makes a complete copy of its argument
		WordList(const WordList & other);
	
	
		//!  Destructor
		~WordList();
	
	
		//!  Assignment operator.  Makes a complete copy of its argument
		//!  @return Reference to oneself
		WordList& operator =(const WordList & other);
	
	
		//!  @return a pointer to the root node of the tree, or NULL if the tree is empty.
		WordIndex * GetRoot()const;
	
	
		//!  @return true if the BST is empty, or false if the BST is not empty
		bool IsEmpty() const;
	
	
		//!  Removes all values from the BST
		//void Clear();
	
	 
		//!  @return the number of values in the BST
		int GetSize() const;
	
	
		/* 
		 *  Inserts word into the BST. Searching the WordIndex BST, if word 
		 *  exists, then add the page object in the PageMap BST.If the there 
		 *  is the word and also there is the same page object in the PageMap
		 *  BST, then increase the number of this word show up times in the 
		 *  PageMap object. Otherwise, create a new WordIndex object and insert
		 *  it into the WordIndex BST. The Search and Insert is based on the 
		 *  BST theory (comparing i the word in each WordIndex node)
		 *  
		 *  @param word The new value being inserted
		 *
		 *  @return a pointer to the inserted WordIndex node which contians the word.
		 *          in the tree (i.e., NULL is used to indicate a duplicate insertion)
		 */
		WordIndex * Insert(const std::string & word, const std::string & url );
	
	
		/*
		 *  Searches the tree for the word in each WordIndex on the WordIndex tree.
		 *  
		 *  @param word The new word being searched for
		 *
		 *  @return a pointer to the WordIndex node containing word, or NULL if word is not in the tree
		 */
		WordIndex * Find(const std::string & word) const;
	
	
	private:
		WordIndex * root;   // points to the root of WordIndex BST
		int size;           // the size of BST, number of words
	
		// these methods may be can assist above methods.
		void ParseTree(const WordIndex * node);
		WordIndex * Addit(const std::string & word, const std::string & url, WordIndex * curNode);
		void CleanTree(WordIndex * curNode);
		WordIndex * Search(const std::string & v, WordIndex * curNode) const; 
};


#endif
