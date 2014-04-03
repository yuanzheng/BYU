#ifndef MAPLIST_H
#define MAPLIST_H
#include "Page.h"
#include "PageMap.h"
#include <string>
/*
 *  MapList implements a binary search tree for each PageMap object
 *  Every WordIndex object has a MapList BST for recording all visited
 *  in scoped web page.
 */

class MapList {
	
	public:
	
		//!  No-arg constructor.  Initializes an empty MapList
		MapList();
	
	
		//!  Copy constructor.  Makes a complete copy of its argument
//		MapList(const MapList & other);
	
	
		//!  Destructor
		~MapList();
	
	
		//!  Assignment operator.  Makes a complete copy of its argument
		//!  @return Reference to oneself
//		MapList& operator =(const MapList & other);
	
	
		//!  @return a pointer to the root node of the tree, or NULL if the tree is empty.
		//!  @note This is useful for WordIndex that need to traverse the tree.)
		PageMap * GetRoot()const;
	
	
		//!  @return true if the MapList is empty, or false if the MapList is not empty
		bool IsEmpty() const;
	
	
		//!  Removes all values from the MapList
		void Clear();
	
	
		//!  @return the number of values in the MapList
		int GetSize() const;

		// add the url on the tree, if the url already existed, then increate times.	
		PageMap * Insert(const std::string & url);
	
		//!  Inserts page into the MapList for the new download Web page
		//!  Each Web page will creat its own WordIndex BST.
		//!  @param page The new value being inserted, and the new PageMap
		//!  being creaded.
		//!  @return a pointer to the newly inserted node, or a pointer of which
		//!  the page is already in a PageMap.
//		PageMap * Insert(const Page* page);
		
		/*  Inserts a PageMap into the MapList for the MainWordIndex BST
		 *  Since the Web crawler will not visit the same Web page(the same url)
		 *  , it's not necessary to check the URLs of each Page object.
	 	 *  just add the PageMap directly.
		 */
//		PageMap * Insert(const PageMap* map);
	
	
		//!  Searches the tree for a PageMap containing a certain Page object
		//!  
		//!  @param page The page being searched for
		//!
		//!  @return a pointer to the node containing page, or NULL if page is not in the tree
//		PageMap * Find(const Page* page) const;
	
	
	private:
		PageMap * root;   // points to the root of BST  
		int size;         // number of BST PageMap

		//! these method is planned to assist above methods.	
		void ParseTree(const PageMap * node);
		PageMap * Addit(const std::string & page, PageMap * curNode);
		void CleanTree(PageMap * curNode);
		PageMap * Search(const Page* page, Page * curNode) const; 
};


#endif

