#ifndef PAGEMAP_H
#define PAGEMAP_H
#include <iostream>
#include <string>
#include <cassert>

/*
 *  PageMap implements a binary search tree node for the occurrence of 
 *  the current word. Each node includes a page object and the times of
 *  Occurrence of the current word in this page. Since the page object has 
 *  the url, the same word in the same page will increase the times of 
 *  the occurrence.
 */
 
class PageMap {
		friend class MapList;   //!< MapList can access private members of PageMap node
	
	public:
	
		//!  Constructor
		PageMap(const std::string & url, int times);
		
		//! Copy Constructor
		PageMap(const PageMap & other); 
		
		// @return the page object in this node so that the client
		// object can learn that if the word shows up in the same page 	
 		// by comparing the url. As well as determine to add a new PageMap
		// node, or increase the times of occurrence.
		//const Page * GetPage() const;
		
		// @return the url of the page variable.
		const std::string GetURL()const;

		// increase the time of occurrence once.
		void IncreaseTimes();
/*
		// the MainWordIndex BST will just add the number of times in the PageMap
		// of the new WordIndex BST created by a new web page procedure.
		void IncreaseTimes(int numbers);
*/
		// @return the occurrence times of the word in the Page.
		int GetTimes()const;
	
		PageMap * GetLeft()const;
	
	
		PageMap * GetRight()const;
		
		//! Assignment operator 
		//Page & operator=(const Page & other);
	
	private:
		int occurrence;
		std::string url;
//		std::string description;
	//	Page page;         // pointer to the page object
		PageMap * left;     //!< pointer to the node's left child
		PageMap * right;    //!< pointer to the node's right child
};

#endif
