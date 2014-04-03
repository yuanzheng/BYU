#ifndef URL_H
#define URL_H
/*
 * The URL class is for encapsulate the valid and Crawling scoped
 * URL. Resolve the URLS. URL can be set either by constructor or URLAnalyzer() from
 * the base url and relative url. Only the valid url object will be
 * saved .
 */
#include <string>
#include <cstring>
#include <iostream>
#include <ostream>
#include "UnitTest.h"
#define SIGN "://"
using namespace std;

namespace URL {

	/*
	 * Analysis whether url link starts with "http://"
	 * or "file://". If it is true, then url = link, otherwise,
 	 * it will invoke the URLResolver() to resolve the url.
	 * At the end it will use the URLFilter.Validation() to 
	 * check the resolved url if it is in the Crawling scope.
	 */
	std::string URLAnalyzer(const std::string & currentURL, const std::string & link);
	
	/*
	 * resolve the base url and relative url.
	 * it will use ParseURL() 
	 */
	char* URLResolver(char** url_parts, char* relative_URL);

	/* 
	 * Parse the base url into each part for URLResolver to use
	 */
	void ParseURL(char** url_parts, char* absolute_URL);

	char* RemoveDots(char* new_path, char* relative_URL);

	char* slash_start(char** url_parts, char* relative_URL);

	char* poundSign_start(char** url_parts, char* relative_URL);

	char* dot_start(char** url_parts, char* relative_URL);

	char* fileName_start(char** url_parts, char* relative_URL);

	// unit test code for url class
	bool Test(std::ostream & os);

};

#endif

