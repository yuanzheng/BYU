#ifndef WEBCRAWLER_H
#define WEBCRAWLER_H
#include "Page.h"
#include "URL.h"
#include "URLFilter.h"
#include "Xml.h"
//#include "WordIndex.h"
#include "WordList.h"
//#include "URLHistory.h"
#include "URLHistoryTree.h"
//#include "URLLink.h"
#include "URLLinkQueue.h"
#include "StopWord.h"
#include "PageReader.h"
//#include "StopWordTree.h"
//#include "HTTPInputStream.h"
//#include "HTMLTokenizer.h"
#include "StringUtil.h"
#include "CS240Exception.h"
#include <iostream>
#include <string>




class WebCrawler {
private:
	WordList wordList;   // a Word Binary search tree
	URLLinkQueue linkQueue;
	URLHistoryTree urlTree;
	std::string startURL;
	std::string URL_Prefix;
	std::string stopwordfile;
	std::string xmlFileName;

public:
	//WebCrawler(); 
	/*
	 * Constructor
	 * initialze the xmlFileName, setup the URL History BST, setup the stop word tree,
	 * initialize url links queue. Initialize the Word Index BST. 
	 * 
	 * @param baseURL the url of the start page from the command line
	 * @param outputfile the name of the output xml file
	 * @param stopwordfile the file contains stopword.
	 */

	WebCrawler(const std::string & startURL, const std::string & outputfile, const std::string & stopwordfile);
	
	~WebCrawler();

	// create URL queue links, add start url in constructor, and dequeue in startWebcrawler(); 
	//void SetupURLTree(const std::string & baseURL);
	
	/*
	 * create url object, by resolving the start url and relative url
	 * check the url is valid or not, by using url filter. Then create page object, and insert it.
	 * Finally return the page.
	 * @return Page or NULL
	 */
	Page & CreateURLHistoryTree(std::string & url);
	// open stop word file, read it and build the stopword string*
	std::string * GetStopWords();
	
	// counter the line number of stopwords file, so that get the number of stopwords
	int CountLineNumbers();

	/*
	 *	create url object to check and resolve the url
	 */
	std::string GetURL(std::string & url);
	/*
	 * This is the main program. It downloads the web page by using the "HTTPInputStream". 
	 * Double check the source location so that it will learn whether the page is redircted. 
	 * It creates the PageReader by passing the URL and the URLLinkTree. PageReader will create 
	 * Page object containing the URL and description. build the wordIndex tree.. 
	 * After the PageReader return, the Page object will be added into the URLHistory BST. And creat XML file.
	 */
    void StartWebCrawler();	

	/*
	 * Each Web page will create its own word index BST. This BST will return back as a pointer.
	 * wordList will be update by the new word index BST. !!! If the word does not exist in 
	 * the wordList, the new word index will be created. If there is one, then just add the 
	 * PageMap in. After the update process delete the new page word index BST. Release the memory.
	 *
	 * @param newPageWords this is a returned wordIndex BST by PageReader.
	 */
	void AddWordIndex(WordList * newPageWords);

	/*
	 * Open a Xml file, create the Xml object for the xml format, then write all word into the file.
	 */
	void WriteIntoXml();

	//
};


#endif


















