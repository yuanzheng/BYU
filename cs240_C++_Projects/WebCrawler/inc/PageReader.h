#ifndef PAGEREADER_H
#define PAGEREADER_H
#include <iostream>
#include <string>
#include <cassert>
#include <cctype>
#include "Page.h"
#include "URL.h"
#include "URLFilter.h"
#include "MapList.h"
#include "WordList.h"
#include "URLHistory.h"
#include "URLHistoryTree.h"
#include "URLLinkQueue.h"
#include "StopWord.h"
#include "HTTPInputStream.h"
#include "HTMLTokenizer.h"
#include "StringUtil.h"
#include "CS240Exception.h"


class PageReader {

private:
	std::string currentURL;
	std::string urlPrefix;
	StopWord * stopwords;
	URLLinkQueue * links;
	WordList * wordlist;
	std::string allwords;
	std::string description;
	std::string body_;  // 100 characters from body
	
//	bool GetDescription(HTMLTokenizer & token, HTMLToken & curToken);
	void RunScript(HTMLTokenizer & token);

	void Description_title(HTMLTokenizer & token);

	void Description_h(HTMLTokenizer & token, std::string & start_tag);

	void Description_body(HTMLTokenizer & token);

	void HTMLParser(HTMLTokenizer & token);

	bool isValidLink(std::string & url);
	
	void CheckDescription();

	void AddNewLink(std::string link);

	void WordIndexing(std::string & words);

	void AddWordIn(const std::string word);

public:
	PageReader(const std::string & url, const std::string & prefix, WordList & words, StopWord & stopwordlist, URLLinkQueue & urlLinks);
	~PageReader();

	void PageParser(URLHistoryTree & urlTree);
};

#endif

