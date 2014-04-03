#include "Xml.h"

Xml::Xml(const std::string & filename, WordList & wordl, URLHistoryTree & urlTree) {
	this->filename = filename;
	url_H_Tree = & urlTree;
	wordlist = & wordl;
}

Xml::~Xml() {
}


void Xml::WriteXml(const std::string & starturl) {

	std::ofstream file(filename.c_str());

	if (!file.is_open())
		std::cout<<"open fail!!!"<<std::endl;

	WebSetTab(file, starturl);

	file.close();

}



void Xml::WebSetTab(std::ofstream & file, const std::string & starturl) {
	file <<"-<website>\n";
	file <<" -<start-url>\n";
	file <<"   "<< starturl <<std::endl;
	file <<"  </start-url>\n";	

	URLHistory * hTree = url_H_Tree->GetTree();
	file <<" -<pages>\n";
	PagesTab(file, hTree);
	file <<"  </pages>\n";

//	std::cout<<" ..... size .... "<<wordlist->GetSize()<<std::endl;
	WordIndex *wTree = wordlist->GetRoot();
	file <<" -<index>\n";
	IndexTab(file, wTree);
	file <<"  </index>\n";

	file <<" </website>\n";


}
	

void Xml::PagesTab(std::ofstream & file, URLHistory * hTree) {
	if (hTree != NULL) {
		file <<"  -<page>\n";
		file <<"   -<url>\n";
		file <<"     " << hTree->GetURL()<<std::endl;
		file <<"    </url>\n";
		file <<"    <description>";
		file <<hTree->GetDescription();
		file <<"</description>\n";
		file <<"   </page>\n";

		PagesTab(file, hTree->GetLeft());
		PagesTab(file, hTree->GetRight());
	}
}

void Xml::IndexTab(std::ofstream & file, WordIndex * wTree) {
	if (wTree != NULL) {
		//std::cout<<" >>    "<<wTree->GetWord()<<std::endl;
		file <<"  -<word>\n";
		file <<"    <value>" <<wTree->GetWord() <<"</value>\n";
		const PageMap * urlInfo = wTree->GetPageList();
		UrlTab(file, urlInfo);	
		
		file <<"   </word>\n";
		
		IndexTab(file, wTree->GetLeft());
		IndexTab(file, wTree->GetRight());
	}
}

void Xml::UrlTab(std::ofstream & file, const PageMap * urlInfo) {
	if (urlInfo != NULL) {
	//	std::cout<<"..url:. "<<urlInfo->GetURL()<<std::endl;
	//	std::cout<<"..tim:. "<<urlInfo->GetTimes()<<std::endl;
		file <<"   -<occurrence>\n";
		file <<"    -<url>\n";
		file <<"      " << urlInfo->GetURL()<<std::endl;
		file <<"     </url>\n";
		file <<"     <count>" << urlInfo->GetTimes() <<"</count>\n";
		file <<"    </occurrence>\n";
		
		UrlTab(file, urlInfo->GetLeft());
		UrlTab(file, urlInfo->GetRight());

	}

}












