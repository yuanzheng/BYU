#ifndef PAGE_H
#define PAGE_H
#include <iostream>
#include <string>
#include <cassert>
//#include "URL.h"

/*
 *  This class stores the URL and description for a visited page.
 *  the page url can be reset, if the web page is redirected.
 */

class Page {
		friend class PageMap;   //!< PageMap can access private members of each Page object
	
	public:
	
		//!  Constructor
		Page(const std::string & url, const std::string & description);
		
		//! Copy Constructor
//		Page(const Page & other); 
		
//		void SetURL(const std::string & url);
		void SetDescription(const std::string & description);	


		const std::string & GetURL() const;

		/*
		 * return the page description for the use by clients of the PageMap
		 * class
		 */
		const std::string & GetDescription() const;
	
		// redirect, when the web page rdirection occurs, the new and valid 
		// url should be reassign to this page.
		// this method modifies the url to the new one.
//		void ResetURL(URL* url);   
	
//		Page & operator=(const Page & other);
	
	private:
		std::string url;
		std::string description;  // the description of web page
};

#endif
