#include <iostream>
#include <string>
#include "StringUtil.h"
#include "WebCrawler.h"

using namespace std;


int main (int argc, char* argv [])
{

	if (argc != 4) {
		std::cout<<"USAGE: crawler <start-url> <output-file> <stopword-file>"<<std::endl;
		return -1;
	}

	string start_url;
	start_url.append(argv[1]);
	string temp = StringUtil::ToLowerCopy(start_url);	
	
	if (!StringUtil::IsPrefix(temp, "http://"))
		if (!StringUtil::IsPrefix(temp, "file://")) {
			std::cout<<"start-url should either: http:// or file://"<<std::endl;
			return -2;
		}


	 
	string startURL=argv[1];
	string stopword = argv[3];
	string xmlfile = argv[2];

	WebCrawler myWebCrawler(startURL, xmlfile, stopword);
	myWebCrawler.StartWebCrawler();
	
	return 0;
}

