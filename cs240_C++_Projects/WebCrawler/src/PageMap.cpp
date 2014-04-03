#include "PageMap.h"

PageMap::PageMap(const std::string & url, int times) {
	this->url = url;
	occurrence = times;
	left = '\0';
	right = '\0';	
}

const std::string PageMap::GetURL()const {
	return url;
}

void PageMap::IncreaseTimes() {
	occurrence++;
}

int PageMap::GetTimes()const {
	return occurrence;
}

PageMap * PageMap::GetLeft()const {
	return left;
}

PageMap * PageMap::GetRight()const {
	return right;
}
