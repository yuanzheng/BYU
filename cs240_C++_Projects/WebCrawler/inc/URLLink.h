#ifndef URLLINK_H
#define URLLINK_H
#include <string>

/*
 *  URLLink implements a Queue node which contains a valid unvisited url link. Some Web page 
 *  contains several url links. Each link will be built into a URL object and added into 
 *  the queue for the future vist.
 *  By using the Queue structure, each url link will be access in FIFO order.
 */
class URLLink {
		friend class URLLinkQueue;  //!< URLLinkQueue can access private members of URLLink
	public:
	
		//!  Constructor 
		//!  @param url the URL string
		URLLink(): url(""), next(0){	
		}

		URLLink(const std::string & url, URLLink * n):url(url), next(n) {
		}
		
	
		//!  @return the current url
		std::string GetURL() const {
			return url;
		}
	
		
	private:
		std::string url;     //!< url stored in the node
		URLLink* next;
};

#endif


