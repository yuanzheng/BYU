#ifndef URLHISTORYTREE_H
#define URLHISTORYTREE_H
#include "URLHistory.h"


/*
 *  URLHistoryTree implements the URLHistory binary search tree for keep track of already processed pages.
 *  Each new url will be searched on this tree, if there is the same URL, then the new url 
 *  will be descarded. Otherwise, it will be add on the tree. So that web crawler will avoid 
 *  revisit the same page. Using BST, gives a quick search.
 *  
 */
class URLHistoryTree {
	
	public:
	
		//!  No-arg constructor.  Initializes an empty BST
		URLHistoryTree();
	
	
		//!  Copy constructor.  Makes a complete copy of its argument
		//URLHistoryTree(const URLHistoryTree & other);
	
	
		//!  Destructor
		~URLHistoryTree();
	
	
		//!  Assignment operator.  Makes a complete copy of its argument
		//!  @return Reference to oneself
		//URLHistoryTree& operator =(const URLHistoryTree & other);
	
	
		//!  @return a pointer to the root node of the tree, or NULL if the tree is empty.
		URLHistory * GetTree()const;
	
	
		//!  @return true if the BST is empty, or false if the BST is not empty
		bool IsEmpty() const;
	
	
		//!  Removes all URL from the BST
		void Clear();
	
	 
		//!  @return the number of URL in the BST
		int GetSize() const;
	
	
		//!  Inserts a url v into the BST
		//!  
		//!  @param url The new value being inserted
		//!
		//!  @return a pointer to the newly inserted node, or NULL if url was already
		//!          in the tree (i.e., NULL is used to indicate a duplicate insertion)
		URLHistory * Insert(const std::string & url, const std::string & description);
	
	
		/*
		 *  Searches the tree for the url on.
		 *  
		 *  @param url The url is being searched for
		 *
		 *  @return true if this url is found on the tree, otherwise is false.
		 */
		//bool Find(const std::string & url) const;

        /*
 	 	 * @return the leftmost URLHistory->Page each time till the whole tree.
		 */
		Page * URLiterator() const;
	
	
	private:
		URLHistory * root;   // points to the root of URL history BST
		int size;           // the size of BST, number of urls
	
		// these methods may be can assist above methods to build the  tree and delete the tree.
		void ParseTree(const URLHistory * node);
		URLHistory * Addit(const std::string & url, const std::string & description, URLHistory * curNode);
		void CleanTree(URLHistory * curNode);
		URLHistory * Search(const std::string & v, URLHistory * curNode) const; 
};


#endif
