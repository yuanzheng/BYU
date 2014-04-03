#include "WordIndex.h"


WordIndex::WordIndex() {
	left = '\0';
	right = '\0';
}

WordIndex::WordIndex(const std::string & word, const std::string & url) {
	this->word = word;
	pagelist.Insert(url);  // add new url or increase the occurrences
	left = '\0';
	right = '\0';
}

WordIndex::~WordIndex() {
//	std::cout<<"WordIndex.cpp ---- delete "<<std::endl;
}

const std::string WordIndex::GetWord() const {
	//should not return a reference, because url will be deleted after return;
//	std::cout<<"returnnnn "<<word<<std::endl;
	return word;
}
// return a BST of the url list
const PageMap * WordIndex::GetPageList() const {
	//std::cout<<"what is it: "<<description<<std::endl;
	return pagelist.GetRoot();
}

void WordIndex::AddURLLinks(const std::string & url) {
	//std::cout<<"adddddd l "<<url<<std::endl;
	PageMap * p = pagelist.Insert(url);
	assert(p!=NULL);
}

WordIndex * WordIndex::GetLeft() const {
	return left;
}

WordIndex * WordIndex::GetRight() const {
	return right;
}
