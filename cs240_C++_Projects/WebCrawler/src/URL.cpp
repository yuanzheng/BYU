#include "URL.h"

namespace URL {

void ParseURL(char** url_parts, char* absolute_URL)
{
    char* pch;
    
	//read the <scheme>
    pch = strchr(absolute_URL, ':');
    url_parts[0] = new char[pch-absolute_URL+1]; 
	strncpy(url_parts[0], absolute_URL, pch-absolute_URL);
    url_parts[0][pch-absolute_URL] = '\0';
    absolute_URL = pch + 3; // '://'

	//read the <net_loc>
    pch = strchr(absolute_URL, '/');
	if (pch == NULL)  // http://www.google.com
	{
		url_parts[1] = new char[strlen(absolute_URL)+1];
		strcpy(url_parts[1], absolute_URL);		
		return;
    }
		
	url_parts[1] = new char[pch-absolute_URL+1];
    strncpy(url_parts[1], absolute_URL, pch-absolute_URL);
    url_parts[1][pch-absolute_URL] = '\0'; //strlen(url_parts[1])] = '\0';
    
	absolute_URL = pch;

	// read the <path>
	url_parts[2] = new char[strlen(absolute_URL)+1];
	strcpy(url_parts[2], absolute_URL);

}

char* RemoveDots(char* new_path, char* relative_URL)
{
	if(*relative_URL =='.' && *(relative_URL + 1) == '/')   //"./abc"
    {
		relative_URL = relative_URL +2;

		relative_URL = RemoveDots(new_path, relative_URL);
    }
	else if (*relative_URL =='.' && *(relative_URL + 1) == '.')
	{
		char* p = strrchr(new_path, '/');
		if (p != NULL)
        	*p = '\0';

		relative_URL = relative_URL + 3;
		relative_URL = RemoveDots(new_path, relative_URL);
	}
		
	return relative_URL;
}

char* slash_start(char** url_parts, char* relative_URL) {

	char* url = new char[strlen(url_parts[0])+strlen(SIGN)+strlen(url_parts[1])+strlen(relative_URL)+1];

    strcpy(url, url_parts[0]);
    strcat(url, SIGN);
    strcat(url, url_parts[1]);
    strcat(url, relative_URL);

//	cout<<"\n\n\n\n\n"<<url<<"\n\n\n\n\n"<<endl;
	return url;
}

char* poundSign_start(char** url_parts, char* relative_URL) {

	char* url = new char[strlen(url_parts[0])+strlen(SIGN)+strlen(url_parts[1])+strlen(url_parts[2])+strlen(relative_URL)+1];
    strcpy(url, url_parts[0]);
    strcat(url, SIGN);
    strcat(url, url_parts[1]);
    strcat(url, url_parts[2]);
    strcat(url, relative_URL);

	return url;
}

char* dot_start(char** url_parts, char* relative_URL) {

	char* url = '\0';
	//if(*(relative_URL+1) == '/' || *(relative_URL+1) == '.') {
    
	char* p = '\0';
	if (url_parts[2] != NULL) {
		p = strrchr(url_parts[2], '/');
		*p = '\0';  //http://www.google.com/abc\0  /index.html
	}
	else {
		url_parts[2] = new char[1];
		url_parts[2][0] = '\0';
	}

	relative_URL = RemoveDots(url_parts[2], relative_URL);

   	url = new char[strlen(url_parts[0])+strlen(SIGN)+strlen(url_parts[1])+strlen(url_parts[2])+strlen(relative_URL)+2]; 

    strcpy(url, url_parts[0]);
   	strcat(url, SIGN);
   	strcat(url, url_parts[1]);
   	strcat(url, url_parts[2]);
	strcat(url, "/");
   	strcat(url, relative_URL);

	return url;
}	

char* fileName_start(char** url_parts, char* relative_URL) {

	char* url = '\0';
	if (url_parts[2] == NULL){
		url = new char[strlen(url_parts[0])+strlen(SIGN)+strlen(url_parts[1])+strlen(relative_URL)+2];
	    strcpy(url, url_parts[0]);
	    strcat(url, SIGN);
	    strcat(url, url_parts[1]);
	}
	else {
		char* pch = strrchr(url_parts[2], '/');   
		*pch = '\0';	

		url = new char[strlen(url_parts[0])+strlen(SIGN)+strlen(url_parts[1])+ strlen(url_parts[2]) + strlen(relative_URL)+2];

		strcpy(url, url_parts[0]);
	    strcat(url, SIGN);
	    strcat(url, url_parts[1]);
	    strcat(url, url_parts[2]);
	}

	strcat(url, "/");
    strcat(url, relative_URL);

	return url;
}


char* URLResolver(char** url_parts, char* relative_URL)
{
	char* url = '\0';

    if (*relative_URL == '/')
		url = slash_start(url_parts, relative_URL);

    else if (*relative_URL == '#')
    	url = poundSign_start(url_parts, relative_URL);

	else if (*relative_URL =='.')
		url = dot_start(url_parts, relative_URL);
    
	else    //http://www.google.com/financal/index.html   image.jpg
		//url_parts[2] : /financal/index.html
		url = fileName_start(url_parts, relative_URL);

	return url;
}


std::string URLAnalyzer(const std::string & currentURL, const std::string & link) {

	char* base_url = new char[currentURL.size() + 1];
	const char* temp1 = currentURL.c_str();
	strcpy(base_url, temp1);

	char* relative_url = new char[link.size() + 1];
	const char* temp = link.c_str();
	strcpy(relative_url, temp);

	char* url_parts[3];
		
	memset(url_parts, 0, sizeof(url_parts));
	
	ParseURL(url_parts, base_url);
	char* resolvedURL = URLResolver(url_parts, relative_url);

//	std::cout<<">>>>>R "<<resolvedURL<<std::endl;
	
	std::string newURL = resolvedURL;
//	newURL.append(resolvedURL);

	delete[] url_parts[0];
    delete[] url_parts[1];
	delete[] url_parts[2];

    delete[] relative_url;
	delete[] base_url;
	delete[] resolvedURL;
    
    return newURL;
}



bool Test(std::ostream & os) {

	bool success = true;

	std::string base_url("http://www.byu.edu/this/is/a/path/index.html");
	std::string base_url2("http://www.byu.edu");
	std::string rel_url1("/yuanzheng/song.php");
	std::string rel_url2("#fragment");
	std::string rel_url3("./././song.php");
	std::string rel_url4("../../song.php");
	std::string rel_url5(".././../song.php");
	std::string rel_url6("./.././song.php");
	std::string rel_url7("song.php");

	std::string resolved1 = URLAnalyzer(base_url, rel_url1);
	TEST(resolved1 == "http://www.byu.edu/yuanzheng/song.php");

	std::string resolved2 = URLAnalyzer(base_url, rel_url2);
	TEST(resolved2 == "http://www.byu.edu/this/is/a/path/index.html#fragment");
	std::string resolved3 = URLAnalyzer(base_url, rel_url3);
	TEST(resolved3 == "http://www.byu.edu/this/is/a/path/song.php");

	std::string resolved4 = URLAnalyzer(base_url, rel_url4);
	TEST(resolved4 == "http://www.byu.edu/this/is/song.php");
	
	std::string resolved5 = URLAnalyzer(base_url, rel_url5);
	TEST(resolved5 == "http://www.byu.edu/this/is/song.php");

	std::string resolved6 = URLAnalyzer(base_url, rel_url6);
	TEST(resolved6 == "http://www.byu.edu/this/is/a/song.php");
	std::string resolved7 = URLAnalyzer(base_url, rel_url7);
	TEST(resolved7 == "http://www.byu.edu/this/is/a/path/song.php");
	
	std::string resolved8 = URLAnalyzer(base_url2, rel_url7);
	TEST(resolved8 == "http://www.byu.edu/song.php");

	return success;
}

}
