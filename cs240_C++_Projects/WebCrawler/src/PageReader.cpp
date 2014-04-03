#include "PageReader.h"
#include "WordIndex.h"
#include "PageMap.h"

PageReader::PageReader(const std::string & url, const std::string & prefix, WordList & words, StopWord & stopwordlist, URLLinkQueue & urlLinks) {
	currentURL = url;
	urlPrefix = prefix;
	wordlist = & words;	
	// using the pointer, to avoid delete stopword pointer string twice
	stopwords = & stopwordlist;
	links = & urlLinks;
}

PageReader::~PageReader() {
//	stopwords = '\0';
//	links = '\0';
}


void PageReader::PageParser(URLHistoryTree & urlTree) {	


	//stopwords->WordSearch(look);

	//Print source 
//	std::cout << "Printing: " << currentURL << std::endl;
//	std::cout << "=======================================" << std::endl;
	/*  //word list testing
	std::string w1 = "hello";
	std::string w2 = "world";
	std::string w3 = "yuanzheng";
	std::string w4 = "song";
	std::string a1 = "www.google.com";
	std::string a2 = "www.yahoo.com";
	std::string a3 = "www.byu.edu";
	std::string a4 = "www.cs.byu.edu";
	
	std::string a5 = "www.sohu.com";
	std::string a6 = "www.acm.com";

	wordlist->Insert(w1, a1);
	wordlist->Insert(w2, a2);
	wordlist->Insert(w3, a3);
	wordlist->Insert(w4, a4);
	
	wordlist->Insert(w3, a3);
	WordIndex * wi = wordlist->Insert(w3, a3);
	if (wi == NULL)
		std::cout<<"null...."<<std::endl;
	else {
		const PageMap * m = wi->GetPageList();
		std::cout<<"show occ: "<<m->GetTimes()<<std::endl;
	}
*/
/*//URLHistroyTree testing	
	urlTree.Insert(currentURL, description);
	std::cout<<" Tree size: "<<urlTree.GetSize()<<std::endl;
	std::string x = "http:";
	URLHistory * node = urlTree.Insert(x, description);
	std::cout<<" Tree size: "<<urlTree.GetSize()<<std::endl;
	std::string y = "file://";
	urlTree.Insert(y, description);
	std::cout<<" Tree size: "<<urlTree.GetSize()<<std::endl;

	if (node != NULL)	{
		std::cout<<"test Insert: "<<node->GetURL()<<std::endl;
		std::cout<<"test       : "<<node->GetDescription()<<std::endl;
	}

	description += "hello world";
	std::cout<<"check.............>> "<<description<<std::endl;
	std::cout<<"check.............>> "<<description.empty()<<" & "<<false<<std::endl;
	assert(!description.empty());
	node->SetDescription(description);
	std::cout<<"test des    : "<<node->GetDescription()<<std::endl;
*/	

	

	try
	{

		URLInputStream stream (currentURL);
		std::string path = stream.GetLocation();
		//Handle redirections (Find out where we redirected to)
		// check whether this page is redirected, if it is, then check if it is in the scope
		if (path != currentURL) {
			if (!isValidLink(path))
				return;
			else		
				currentURL = path;
		}

		URLHistory * node = urlTree.Insert(currentURL, description);
		if (node == NULL)
			return;
	    
		HTMLTokenizer token (&stream);	

		while (token.HasNextToken()) {
			HTMLToken curToken = token.GetNextToken();
			std::string tag_value = StringUtil::ToLowerCopy(curToken.GetValue());
			if (curToken.GetType() == TAG_START && tag_value == "html") {
				HTMLParser(token);
				break;
			}
		}
		
		CheckDescription();
		// add the description into the Page on URLHistoryTree
		StringUtil::EncodeToXml(description);
		node->SetDescription(description);
		//std::cout<<"Desc: "<<node->GetDescription()<<"\n\n"<<std::endl;

	}
	catch (std::exception &e)
	{
		std::cout << "Exception Occurred 1:" << e.what() << std::endl;
	}
	catch (CS240Exception &e) 
	{
		std::cout << "Exception Occurred 2:" << e.GetMessage() << std::endl;
	}
	catch (...)
	{
		std::cout << "Unknown Exception Occurred" << std::endl;
	}			
}

void PageReader::WordIndexing(std::string & words) {
//	std::cout<<"The text string >>"<<words<<std::endl<<std::endl;

	std::string charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
	std::string::size_type found = words.find_first_not_of(charSet);
	if (found != std::string::npos) {
		std::string sub = words.substr(0, found);
//		std::cout<<"I found it:>>"<<sub<<"<<  & size: "<<sub.size()<<std::endl;
		if (sub.size() != 0)	{
//			std::cout<<"Add it in..."<<std::endl;
			AddWordIn(sub);
		}

//		std::cout<<found<<" v.s. "<<words.size()<<std::endl;
		if (found < words.size()-1) {
			std::string newWords = words.substr(found+1);
			WordIndexing(newWords);
		}
//		else
//			std::cout<<found<<"<< is size-1 >>"<<words.size() -1 <<" so, quit!"<<std::endl;
	}
	else {
//		std::cout<<"*******************"<<std::endl;
//		std::cout<<"No found: "<<words<<std::endl;
		if (words.size() != 0)
			AddWordIn(words);
//		std::cout<<"*******************"<<std::endl;
	}
}

void PageReader::AddWordIn(const std::string word) {

	std::string lower_case = StringUtil::ToLowerCopy(word);
//	std::cout<<"lower case >> "<<lower_case<<std::endl;
	if (!stopwords->WordSearch(lower_case) && 
		!isdigit(lower_case[0]) &&
		lower_case[0] != '-' &&
		lower_case[0] != '_') {
//		std::cout<<"index it..."<<std::endl;	
		wordlist->Insert(lower_case, currentURL);
	}
}

void PageReader::HTMLParser(HTMLTokenizer & token) {

	std::string tag_value;		

	while (token.HasNextToken()) {
		HTMLToken curToken = token.GetNextToken();
		tag_value = StringUtil::ToLowerCopy(curToken.GetValue());

		if (curToken.GetType() == TAG_START && tag_value == "script") {
			RunScript(token);
			continue;
		}
		else if (curToken.GetType() == TAG_END && tag_value == "html")	
			break;
		
		if (curToken.GetType() == TAG_START && tag_value == "title") {
			Description_title(token);
		}
		else
			if (curToken.GetType() == TAG_START && tag_value == "body") {
  				Description_body(token);
		}

		if (curToken.GetType() == TAG_START && tag_value == "a") {
			if (curToken.AttributeExists("href") && curToken.GetAttribute("href").size() > 1) {
				AddNewLink(curToken.GetAttribute("href"));
			}
		}
	}

	if (tag_value != "html")
		throw IllegalStateException(string("HTML file is not ended by </html> tag"));
}

void PageReader::CheckDescription() {
	/*
	 *	if descrp is still none, then add the first 100 character of <body>
	 */	
	if (description.empty()) {
		int n =0;
		for (size_t i=0; i<body_.length(); i++) {
			if (n == 100)
				break;
			description += body_[i];
	
			if (!isspace(body_[i]))            //???? space or '/'...
				n++;
		}	
	}

}

void PageReader::RunScript(HTMLTokenizer & token) {
	while (token.HasNextToken()) {
		HTMLToken curToken = token.GetNextToken();
		std::string tag_value = StringUtil::ToLowerCopy(curToken.GetValue());
		if (curToken.GetType() == TAG_END && tag_value == "script")
			break;
	}
}
/*
bool PageReader::GetDescription(HTMLTokenizer & token, HTMLToken & curToken) {

	std::string tag_value = StringUtil::ToLowerCopy(curToken.GetValue());

	if ( tag_value == "title")
		Description_title(token);
	else if ( tag_value == "body")
		Description_body(token);

	if (!description.empty())
		return true;
	
	return false;
}
*/
void PageReader::Description_title(HTMLTokenizer & token) {
	
	while (token.HasNextToken()) {
		HTMLToken curToken = token.GetNextToken();
		std::string tag_value = StringUtil::ToLowerCopy(curToken.GetValue());
		if (curToken.GetType() == TAG_END && tag_value == "title")
			break;
		
		if (curToken.GetType() == TEXT) {
			description += curToken.GetValue();
			std::string words = curToken.GetValue();
			if (words.size() != 0) {
				WordIndexing(words);
			}
				
		}
	}
}
	
void PageReader::Description_h(HTMLTokenizer & token, std::string & start_tag) {

	while (token.HasNextToken()) {
		HTMLToken curToken = token.GetNextToken();
		std::string tag_value = StringUtil::ToLowerCopy(curToken.GetValue());
		if (curToken.GetType() == TAG_END && tag_value[0] == 'h')
			break;
		
		if (curToken.GetType() == TAG_START && tag_value == "a") {
			if (curToken.AttributeExists("href") && curToken.GetAttribute("href").size() > 1) {
				AddNewLink(curToken.GetAttribute("href"));
			}
		}
		else if (curToken.GetType() == TEXT) {
			description += curToken.GetValue();
			std::string words = curToken.GetValue();
			if (words.size() != 0) {
				WordIndexing(words);
			}
		}
	}
}

void PageReader::Description_body(HTMLTokenizer & token) {
	
	while (token.HasNextToken()) {
		HTMLToken curToken = token.GetNextToken();
		std::string tag_value = StringUtil::ToLowerCopy(curToken.GetValue());
		if (curToken.GetType() == TAG_END && tag_value == "body")
			break;
		
		if (curToken.GetType() == TEXT) {
				body_ += curToken.GetValue();
				std::string words = curToken.GetValue();
				
				if (words.size() != 0) {
					WordIndexing(words);
				}
		}
		else if ( tag_value[0] == 'h' && isdigit(tag_value[1]) && description.empty())
			Description_h(token, tag_value);
		
		else if (curToken.GetType() == TAG_START && tag_value == "a") {
			if (curToken.AttributeExists("href") && (curToken.GetAttribute("href")).size() > 1) {
				AddNewLink(curToken.GetAttribute("href"));
			}
		}
	}
}

void PageReader::AddNewLink(std::string link) {  // give a copy of link
	std::string temp = StringUtil::ToLowerCopy(link);
	//first see if it is a absolute url, if yes, filter it
	if (StringUtil::IsPrefix(temp, "http://") ||
		 StringUtil::IsPrefix(temp, "file://"))  {    // ???? file:// ? or  http://
		
		if (isValidLink(link)) {
			links->Enqueue(link);
		}
	}
	else {
		std::string resolvedLink = URL::URLAnalyzer(currentURL, link);
		if (isValidLink(resolvedLink)) {
			links->Enqueue(resolvedLink);
		}
	}
}


bool PageReader::isValidLink(std::string & url) { // we can modify this url
	// strip off the fragment and throw it
	std::string::size_type foundFrag = url.find_first_of('#');

	if (foundFrag != std::string::npos) 
		url = url.substr(0, foundFrag);

	if (URLFilter::CheckPrefix(url, urlPrefix) && URLFilter::CheckHTML(url))		
		return true;

	return false;
}


