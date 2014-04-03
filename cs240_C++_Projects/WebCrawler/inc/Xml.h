#ifndef XML_H
#define XML_H	
#include "Page.h"
#include "WordList.h"
#include "PageMap.h"
#include "URLHistory.h"
#include "URLHistoryTree.h"
#include <iostream>
#include <fstream>
#include <string>

/*
 * Xml class will create Xml output file and write the whole word index tree in
 * xml file format
 */

class Xml {

private:
	std::ofstream file;  // the Xml file descriptor
	std::string url;      // the start page url 
	URLHistoryTree * url_H_Tree;   // the visited pages urls
	WordList * wordlist; // the word index tree
	std::string filename;		

public:
	// Constructor 
	// create the Xml file and open it
	Xml(const std::string & filenamei, WordList & wordl, URLHistoryTree & urlTree);
	
	// Deconstructor--- close file
	~Xml();

	// start write all data into the Xml file in xml formate
	void WriteXml(const std::string & starturl);

	//<website ></website >
	void WebSetTab(std::ofstream & file, const std::string & starturl);

	//<start-url ></start-url > , using the url directly.
	//void StartTab();

	//<pages ></pages >
	void PagesTab(std::ofstream & file, URLHistory * hTree);
	void IndexTab(std::ofstream & file, WordIndex * wTree);

	//<page ></page >
	//void PageTab();
	
	//<url ></url >
	void UrlTab(std::ofstream & file, const PageMap * urlInfo);

	//<description ></description >
	//void DescriptionTab(const std::string description);

	// <index ></index >
	//void IndexTab();
	
	//<word ></word >
	//void WordTab();

	//<value ></value >
	//void ValueTab(char * string);

	//<occurrence ></occurrence >
	//void OccurrenceTab();

	//<count ></count >
	//void CountTab(int i);

};

#endif
