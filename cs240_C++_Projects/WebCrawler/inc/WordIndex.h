#ifndef WORDINDEX_H
#define WORDINDEX_H
#include <iostream>
#include <string>
#include "MapList.h"
#include "PageMap.h"

/*
 *  WordIndex class store index that maps the word to pages.
 *  WordIndex implements a binary search tree node which contains the word
 *  and a Maplist ( another BST for  all web page which the word show up)
 * 	Each WordIndex object record the informaiton about word and the url which
 *	includes that word and times.
 */
class WordIndex {
		friend class WordList;   //!< WordList can access private members of WordIndex
	
	public:

		WordIndex();	
		//!  Constructor 
		//!  @param w the word
		//!  @oaram currentURL the word is found in this web page under this url
		WordIndex(const std::string & word, const std::string & url);
		
		//! Copy Constructor
		WordIndex(const WordIndex & other); 
		
		~WordIndex();	
		//!  @return the word
		const std::string GetWord() const;

		// @return the reference of Maplist, PageMap list, so that we can learn how many time each word
		// shows up in each page' url and occurrence. When the WordIndex BST is created for a page
		// there is only one PageMap object, but the times could be 1 or n.
		const PageMap * GetPageList()const;

		// pagelist insert the url, if the url existed, then increase the times. pageList will call insert() to add the url, if it exist, then increase the times.
		void AddURLLinks(const std::string & url);	
	
		WordIndex * GetLeft()const;
	
	
		WordIndex * GetRight()const;
		
		//! Assignment operator 
		//WordIndex & operator=(const WordIndex & other);
	
	private:
		MapList pagelist;    //! pages BST incudes all page contianning this word
		std::string word;     //!< word stored in the node
		WordIndex * left;     //!< pointer to the node's left child
		WordIndex * right;    //!< pointer to the node's right child
};

#endif
