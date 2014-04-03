#ifndef URLHISTORY_H
#define URLHISTORY_H
#include <iostream>
#include <string>
#include <cassert>
#include "Page.h"

/*
 *  URLHistory implements a binary search tree node which contains avalid  url visited before. 
 *  By using the BST, it is fast to search for. And keeping this history, the web crawler will avoid to repeat the visited page.
 */
class URLHistory {
		friend class URLHistoryTree;   //!< URLHistoryTree can access private members of URL
	
	public:

		URLHistory();	
		//!  Constructor 
		//!  create the Page object
		//!  @param url the URL string
		URLHistory(const std::string & url, const std::string & description);

		~URLHistory();

		Page* GetPage() const;
		
		//! Copy Constructor
		URLHistory(const URLHistory & other); 
		
	
		//!  @return the current url
		const std::string GetURL() const;

		const std::string GetDescription()const;

		void SetDescription(const std::string & des);
		/*
		 * URLcmp will compare the url to the new url.
		 * @param url is the new url. It will go through the tree to compare each visited current url.
		 * @return 0 is same, -1 the current url is less than the new one, 1 is the current url is bigger.
		 */
		int URLcmp(const std::string & url);	
		
		URLHistory * GetLeft()const;
	
	
		URLHistory * GetRight()const;
		
		//! Assignment operator 
		URLHistory & operator=(const URLHistory & other);
	
	private:
		Page* page;     //!< url stored in the node
		URLHistory * left;     //!< pointer to the node's left child
		URLHistory * right;    //!< pointer to the node's right child
};

#endif
