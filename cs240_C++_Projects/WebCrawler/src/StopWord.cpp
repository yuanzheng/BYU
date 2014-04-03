#include "StopWord.h"

StopWord::StopWord() {
	words = '\0';
	size = 0;
}
/*
StopWord & StopWord::operator =(const StopWord & other) {
	if (&other != this) {
		if (words != NULL)
			delete[] words;
		words = '\0';
		std::cout<<"operator = "<<std::endl;
	}
	words = other.words;

	size = other.size;
	return *this;
}
*/

StopWord::StopWord(const std::string fileName) {
	CountLineNumbers(fileName);
	ReadStopWords(fileName);
}

StopWord::~StopWord() {
	if (words != NULL) {
		delete[] words;
//		std::cout<<"final StopWord.cpp deconstructor!!"<<std::endl;
	}
	words = '\0';
}

std::string * StopWord::GetStopWords() {
	return words;
}

int StopWord::GetSize() {
	return size;
}

void StopWord::ReadStopWords(const std::string & stopwordfile) {
	
	//std::string * lines;
	std::string word;
	int counter = 0;

	try {
		std::ifstream StopWFile;
		StopWFile.open(stopwordfile.c_str());
			
 		words = new std::string[size];
		//int line_numbers = CoutLineNumbers();
		while (getline(StopWFile, word)) {
			if (word.size() == 0)
				continue;
			
			words[counter++] = word;
		}	

	//	std::cout<<"Get: "<<counter<<std::endl;
		StopWFile.close();

	}
	catch (std::exception & e)
	{
		std::cout<< "Exception Occurred from GetStopWord:"<< e.what() <<std::endl;
	}
	catch (FileException & e)
	{
		std::cout<<"Exception Occurred from GetStopWord: "<< e.GetMessage() <<std::endl;
	}
	catch (...)
	{
		std::cout << "Unknown Exception Occurred from GetStopWord!" << std::endl;
	}				
	
}

void StopWord::CountLineNumbers(const std::string & stopwordfile) {
	
	char line[32];
	//int line_numbers = 0;
	size = 0;	
	try {
		std::ifstream StopWFile;
		StopWFile.open(stopwordfile.c_str());
	
		while (StopWFile.getline(line, sizeof(line))) {
			if (strlen(line) == 0)
				continue;
			size ++;
			//line_numbers++;
		}	

	//	std::cout<<"Counter: "<<size<<std::endl;
		StopWFile.close();

	}
	catch (std::exception & e)
	{
		std::cout<< "Exception Occurred from CountLineNumbers:"<< e.what() <<std::endl;
	}
	catch (FileException & e)
	{
		std::cout<<"Exception Occurred from countLineNumbers: "<< e.GetMessage() <<std::endl;
	}
	catch (...)
	{
		std::cout << "Unknown Exception Occurred from countLineNumbers!" << std::endl;
	}				
}


bool StopWord::WordSearch(const std::string & key) {

//	std::cout<<"what to search: "<<key<<std::endl;	
	
//	for (int i=0; i<size; i++)
//		std::cout<<words[i]<<std::endl;

	if (bsearch(&key, words, size, sizeof(words), stopword_cmp) == NULL)
	//	std::cout<<"not found!!!"<<std::endl;
		return false;
	//else
	//	std::cout<<"yes : "<<std::endl;

	return true;

}

int StopWord::stopword_cmp(const void * a, const void * b) {
	std::string & v1 = *(std::string *) a;
	std::string & v2 = *(std::string *) b;

	//std::cout<<v1<<" ... "<<v2<<std::endl;
	if (v1 < v2)
		return -1;
	else if (v1 > v2)
		return 1;

	return 0;
}

bool StopWord::Test(std::ostream & os) {
	bool success = true;

	StopWord st("stopword.txt");	
	std::string a1 = "hello";
	std::string a2 = "the";

	TEST(!st.WordSearch(a1));
	TEST(st.WordSearch(a2));

	return success;

}













