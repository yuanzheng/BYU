#ifndef URLLINKQUEUE_H
#define URLLINKQUEUE_H
#include <iostream>
#include <string>
#include "UnitTest.h"
#include "URLLink.h"

using namespace std;

/*
 * URLLinkQueue implements a Queue link for tracking unprocessed pages. All valid and in-scoped 
 * url links will be add into this queue firstly.
 *
 */

class URLLinkQueue {

	public:
		//!  No-arg constructor.  Initializes an empty Queue
		URLLinkQueue();
		
		//!  Destructor
		~URLLinkQueue();

		//!  Removes the first URLLink node from the Queue
		//!  
		//!  @return  the front node 
		std::string Dequeue();
		
		//!  create a URLLink node for the new url; and insert it
		//!  into the Queue at the end of queue
		//!  
		//!  @param urllink The url from page being inserted.
		void Enqueue( const std::string & urllink);
	    
		//!  @return a pointer to the first node in the Queue, or NULL if the queue is empty
		//URLLink * Front()const;	
		
		//!  @return true if the Queue is empty, or false if the Queue is not empty
		bool IsEmpty()const;
		
		//!  Removes all values from the queue
		void Clear();
		
		//!  @return the number of values in the queue
		int GetSize() const;
		
		void toString()const;

		static bool Test(std::ostream & os);
	
	private:
		URLLink* head;     // points to the front of queue
		URLLink* rear;     // points to the end of queue
		int size;
};

#endif

