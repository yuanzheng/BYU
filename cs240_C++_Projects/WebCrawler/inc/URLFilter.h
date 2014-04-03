#ifndef URLFILTER_H
#define URLFILTER_H

#include <iostream>
#include <string>
#include "StringUtil.h"
#include "UnitTest.h"

using namespace std;
/*
 * URLFiler distinguishes the HTML and non-HTML links. Also it distinguishes in 
 * scope and out-of-scope links.
 * Since the set of pages to be indexed by web crawler is limited 
 * to the set of pages that are stored within the prefix specified 
 * by the startURL. This class is used to filter those invalid file 
 * so that it can avoid the infinite craswling web page.
 */

namespace URLFilter {

	//std::string url_prefix;   // the start web link

	//std::string & GetPrefix() const;
	/*
	 * using CheckHTML() and CheckPrefix() to determine
	 * whether the url is valid, in the scope.
	 * @param url is url which need to be checked.
	 * @return true if both CheckHTML() and CheckPrefix()
	 *         return true.
	 */
//	bool Validation(std::string & url, const std::string & prefix);

	/*
	 * check the url whether a HTML page or non-HTML file.
	 * The url ends with one of the following extension .html, 
	 * .htm, .shtml, .cgi, .jsp, .asp, .aspx, .php, .pl, .cfm
	 */
	bool CheckHTML(const std::string & url);

	/* 
	 * check if the url start with the prefix of the startURL.
	 * The prefix of the startURL is everything in the URL 
	 * before the page name.
	 */
	bool CheckPrefix(const std::string & url, const std::string & prefix);
	
	bool http_prefix(const std::string & url, const std::string & prefix);

	bool file_prefix(const std::string & url, const std::string & prefix);

	bool Test(std::ostream & os);
}
#endif
