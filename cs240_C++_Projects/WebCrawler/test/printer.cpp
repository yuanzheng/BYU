#include <iostream>
#include "URLInputStream.h"
#include "CS240Exception.h"
#include "HTMLTokenizer.h"
//#include "HTMLToken.h"

void print_contents (InputStream &stream);

/**
 * printer takes a list of urls from he command line and prints their contents to std::cout
 * 
 * usage: printer [files]
 * 
 * ex. 
 *     printer http://google.com file:/home/somefile.txt
 * */
int main (int argc, char* argv [])
{

		for(int i = 1;i<argc;++i)
		{
			std::string path=argv[i];
			//Print source URL
			std::cout << "Printing: " << path << std::endl;
			std::cout << "=======================================" << std::endl;
			
			try
			{
				URLInputStream stream (path);
			    HTMLTokenizer token (&stream);	


//				HTMLToken curToken = token.GetNextToken();
//				std::cout<< "my token test: \n" << "Attribute: " << curToken.GetValue()<<std::endl; 
				std::string st = "";	
				std::string link = "";
				while (token.HasNextToken()) {
					HTMLToken curToken = token.GetNextToken();
					if (curToken.GetType() == TEXT) {
						//std::cout<< "\nmy token test:"<<std::endl;
					
						//<< " Get Type: " << HTMLToken./*curToken.GetType()*/ 
						//std::cout<< "Get Value: "
						//<< curToken.GetValue() <<std::endl;
						st += curToken.GetValue();
					}
					else if (curToken.AttributeExists("href"))
							link += curToken.GetAttribute("href");
				}
				std::cout<<st<<endl;
				std::cout<<link<<endl;
				//print_contents (stream);

				//Handle redirections (Find out where we redirected to)
				path = stream.GetLocation();
				std::cout << "=======================================" << std::endl;
				std::cout << "Actual Location: " << path << std::endl;
			}
			catch (std::exception &e)
			{
				std::cout << "Exception Occurred 1:" << e.what() << std::endl;
			}
			catch (CS240Exception &e) 
			{
				std::cout << "Exception Occurred 2:" << e.GetMessage() << std::endl;
				std::cout << "Expect:" << path << std::endl;
			}
			catch (...)
			{
				std::cout << "Unknown Exception Occurred" << std::endl;
			}
		}
				
	
	return 0;
}

//!Note that this function can accept any kind of InputStream, not just URLInputStream
void print_contents (InputStream &stream)
{
	
	while (!stream.IsDone())
	{
		std::cout << stream.Read();
	}
}

