#include "WebCrawler.h"


WebCrawler::WebCrawler(const std::string & startURL, const std::string & outputfile, const std::string & stopwordfile) {
	this->startURL = startURL;
	xmlFileName = outputfile;
	this->stopwordfile = stopwordfile;

	/* find the prefix of url */
	std::string::size_type loc = startURL.find_last_of('/');
	
	URL_Prefix = startURL.substr(0,loc+1);
	if (StringUtil::IsPrefix(StringUtil::ToLowerCopy(startURL), "http://"))
		if (loc == 6)
			URL_Prefix = startURL;
		
		 
	//URLFilter::url_prefix = URL_Prefix;
}



WebCrawler::~WebCrawler() {

}

void WebCrawler::StartWebCrawler() {
	std::string url = startURL;
//	std::cout<<"chekc ... "<<URL_Prefix<<std::endl;

	StopWord stopword_list(stopwordfile);

//	std::cout<<"final check size: "<<stopword_list.GetSize()<<std::endl;

/*	std::string * stopwords = stopword_list.GetStopWords();
	
	for (int i=0; i<stopword_list.GetSize(); i++)
		std::cout<<stopwords[i]<<std::endl;
*/
		

	do {
		PageReader pr(url, URL_Prefix, wordList, stopword_list, linkQueue);

		pr.PageParser(urlTree);
		//std::cout<<"out???"<<std::endl;
//		std::cout<<"**** from WebCrawler .... "<<std::endl;
//		linkQueue.toString();
//		std::cout<<"queue size: "<<linkQueue.GetSize()<<std::endl;
	//	std::cout<<"dequeue: 1"<<linkQueue.Dequeue()<<std::endl;
	//	std::cout<<"dequeue: 2"<<linkQueue.Dequeue()<<std::endl;
	//	std::cout<<"queue size: "<<linkQueue.GetSize()<<std::endl;
	//	std::string link = linkQueue.Dequeue();
	//	if (link == "")
		//	break;

		url = linkQueue.Dequeue();
//		std::cout<<"continue....."<<std::endl;
	}while (!linkQueue.IsEmpty() || !url.empty());
	
	Xml xmlfile(xmlFileName, wordList, urlTree);
	xmlfile.WriteXml(startURL);
	
//	delete[] allStopW;
}

