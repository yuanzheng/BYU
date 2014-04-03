#include "Page.h"

Page::Page(const std::string & url, const std::string & description) {
	this->url = url;
	this->description = description;
//	std::cout<<"Page is create (Page.cpp constructor)......"<<std::endl;
}

const std::string & Page::GetURL() const {
	return url;
}

const std::string & Page::GetDescription() const {
	return description;
}

void Page::SetDescription(const std::string & description) {
	assert(!description.empty());
	this->description = description;
}

