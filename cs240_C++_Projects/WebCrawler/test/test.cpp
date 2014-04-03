#include <iostream>
#include <string>
#include <cstring>
#include "URL.h"
#include "StopWord.h"
#include "URLLinkQueue.h"
#include "URLFilter.h"

using namespace std;



int main() 
{
	bool success = true;

	cout<<"URL TESTING ------  ";
	if (!URL::Test(cout)) success = false;

	if (success) {
		cout << "Tests Succeeded!" << endl;
	}
	else {
		cout << "Tests Failed!" << endl;
	}

	cout<<"STOPWORD TESTING ------  ";
	if (!StopWord::Test(cout)) success = false;

	if (success) {
		cout << "Tests Succeeded!" << endl;
	}
	else {
		cout << "Tests Failed!" << endl;
	}
	
	cout<<"URLLinkQueue TESTING ------  ";
	if (!URLLinkQueue::Test(cout)) success = false;

	if (success) {
		cout << "Tests Succeeded!" << endl;
	}
	else {
		cout << "Tests Failed!" << endl;
	}
	
	cout<<"URLFilter TESTING ------  ";
	if (!URLFilter::Test(cout)) success = false;

	if (success) {
		cout << "Tests Succeeded!" << endl;
	}
	else {
		cout << "Tests Failed!" << endl;
	}



	return 0;
}

