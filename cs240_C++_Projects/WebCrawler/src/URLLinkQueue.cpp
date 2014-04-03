
#include "URLLinkQueue.h"


URLLinkQueue::URLLinkQueue() {
	head = '\0';
	rear = '\0';
	size = 0;
}

URLLinkQueue::~URLLinkQueue() {
	Clear();
}

void URLLinkQueue::Clear() {

	while (head != NULL) {
		URLLink * n = head;
		head = head->next;
		delete n;
		size--;
//		std::cout<<"final URLLinkQueue.cpp desconstructor."<<std::endl;
	}
	rear = '\0';
}

void URLLinkQueue::Enqueue(const std::string & urllink) {	
	
	URLLink * newLink = new URLLink(urllink, NULL);
	
	if (size == 0) 
		head = newLink;
	else
		rear->next = newLink;
		
	rear = newLink;	
	size++;	
	
}

std::string URLLinkQueue::Dequeue() {
	if(IsEmpty())
		return "";
	std::string front = head->GetURL();
	URLLink * n = head;
	head = head->next;
	delete n;
	size--;

	return front;
}

bool URLLinkQueue::IsEmpty()const {
	return (size==0);
}

int URLLinkQueue::GetSize()const {
	return size;
}

		
void URLLinkQueue::toString()const {
	URLLink * n = head;

	while (n != NULL) {
		std::cout<<n->GetURL()<<std::endl;
		n = n->next;
	}
}

bool URLLinkQueue::Test(std::ostream & os) {
	bool success = true;

	std::string url1("http://www.google.com");
	std::string url2("http://www.byu.edu");

	URLLinkQueue queue;
	queue.Enqueue(url1);
	queue.Enqueue(url2);
	TEST(queue.GetSize() == 2);

	TEST(queue.Dequeue() == url1);
	TEST(queue.Dequeue() == url2);
	

	return success;
}	
