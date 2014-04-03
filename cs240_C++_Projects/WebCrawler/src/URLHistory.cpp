
#include "URLHistory.h"

URLHistory::URLHistory() {
	page = '\0';
	left = '\0';
	right = '\0';
}

URLHistory::URLHistory(const std::string & url, const std::string & description) {
	page = new Page(url, description);
	left = '\0';
	right = '\0';
}

URLHistory::~URLHistory() {
	delete page;
//	std::cout<<"URLHistory.cpp -- delete "<<std::endl;
}

const std::string URLHistory::GetURL() const {
	//should not return a reference, because url will be deleted after return;
	std::string url = page->GetURL();
	return url;
}

const std::string URLHistory::GetDescription() const {
	std::string description = page->GetDescription();
	//std::cout<<"what is it: "<<description<<std::endl;
	return description;
}

void URLHistory::SetDescription(const std::string & des) {
	assert(!des.empty());
	//std::cout<<"///// "<<des<<std::endl;
	page->SetDescription(des);

}

URLHistory * URLHistory::GetLeft() const {
	return left;
}

URLHistory * URLHistory::GetRight() const {
	return right;
}
