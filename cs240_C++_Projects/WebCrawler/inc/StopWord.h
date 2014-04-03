#ifndef STOPWORD_H
#define STOPWORD_H
#include <string>
#include <cstring>
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <ostream>
#include "UnitTest.h"
#include "CS240Exception.h"
using namespace std;
/*
 *  StopWord implements a binary search tree node which contains thestop word from the stop word file
 *  By using the BST, it is fast to search for.
 */
class StopWord {
//		friend class StopWordTree;   //!< StopWordTree can access private members of StopWord
	
	public:
	
		//!  Constructor
		StopWord(); 
		//!  @param w the word
		StopWord(const std::string fileName);

		StopWord & operator =(const StopWord & other);		
		//StopWord(const StopWord & other); 
		~StopWord();
	
		std::string * GetStopWords();
		int GetSize();

		void ReadStopWords(const std::string & stopwordfile);
		void CountLineNumbers(const std::string & stopwordfile);

		bool WordSearch(const std::string & key);

		static bool Test(std::ostream & os);

	private:
		std::string * words;     //!< word stored in the node
		int size;
		static int stopword_cmp(const void * a, const void * b);		
};

#endif
