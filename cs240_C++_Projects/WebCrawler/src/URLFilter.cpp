#include "URLFilter.h"


namespace URLFilter {
/*
bool Validation(std::string & url, const std::string & prefix) {

	if (CheckPrefix(url, prefix) && CheckHTML(url))
		return true;
	return false;
}
*/

bool CheckHTML(const std::string & url) {

	std::string::size_type foundLast = url.find_last_of('/');
	
	if (foundLast != std::string::npos && foundLast < 7)
		return true;
	
	std::string fileName = url.substr(foundLast);
	foundLast = fileName.find_first_of('.');
	if (foundLast == std::string::npos)
		return true;
	
	std::string suffix = fileName.substr(foundLast);
	foundLast = suffix.find_first_of('?');
	if (foundLast != std::string::npos)
		suffix = suffix.substr(0, foundLast);

	if (suffix == ".html" ||
		suffix == ".htm" ||
		suffix == ".shtml" ||
		suffix == ".cgi" ||
		suffix == ".jsp" ||
		suffix == ".asp" ||
		suffix == ".aspx" ||
		suffix == ".php" ||
		suffix == ".pl" ||
		suffix == ".cfm")
		return true;

	return false;
		
}

bool CheckPrefix(const std::string & url, const std::string & prefix) {

	if (url.length() < prefix.length())
		return false;

	std::string temp1 = StringUtil::ToLowerCopy(url);
	std::string temp2 = StringUtil::ToLowerCopy(prefix);
	//std::string temp_prefix = prefix;
	if (StringUtil::IsPrefix(temp1, "file://") &&
		StringUtil::IsPrefix(temp2, "file://")) {
		return file_prefix(url, prefix);
	}
	else if (StringUtil::IsPrefix(temp1, "http://") &&
			StringUtil::IsPrefix(temp2, "http://")) {
			//std::cout<<url<<" & "<<prefix<<std::endl;
			return http_prefix(url, prefix);
	}
	
	return false;
		

}

bool file_prefix(const std::string & url, const std::string & prefix) {
		// format: file:/home....
		/*
		while (url.at(6) == '/'){
			url.erase(6,1);
		}
		while (prefix.at(6) == '/'){
			prefix.erase(6,1);
		}
		
		if (url.length() < prefix.length())
			return false;
		*/		
		// check home... parts, exclude "file:/"
		std::string subURL = url.substr(7);
		std::string subPrefix = prefix.substr(7);
	//	std::cout<<">>>>>>>>>>>>>>> "<<url.substr(7)<<"\n & \n"
	//			<<">>>>>>>>>>>>>>> "<<prefix.substr(7)<<std::endl;
		if (StringUtil::IsPrefix(subURL, subPrefix)) 
			return true;

	return false;

}


bool http_prefix(const std::string & url, const std::string & prefix) {
/*
		if (url.length() < prefix.length())
			return false;
*/
		std::string subURL = url.substr(7);
		std::string subPrefix = prefix.substr(7);

		// compare the net_loc of url and prefix url
		std::string::size_type foundURL = subURL.find_first_of('/');
		std::string net_l;
		std::string path_url;
		if (foundURL != std::string::npos) {
			//std::cout<<"found it u!!!"<<foundURL<<std::endl;
			net_l = subURL.substr(0, foundURL);
			path_url = subURL.substr(foundURL);
		}else{
			//std::cout<<"found it url!!!"<<std::endl;
			net_l = subURL;
		}

		std::string::size_type foundPrefix = subPrefix.find_first_of('/');
		std::string net_p;
		std::string path_prefix;
		if (foundPrefix != std::string::npos){
			//std::cout<<"found it p!!!"<<foundPrefix<<std::endl;
			net_p = subPrefix.substr(0, foundPrefix);
			path_prefix = subPrefix.substr(foundPrefix);
		}else{
			//std::cout<<"found it pre!!!"<<std::endl;
			net_p = subPrefix;

		}

		if (StringUtil::ToLowerCopy(net_l) != StringUtil::ToLowerCopy(net_p))
			return false;

		if (!StringUtil::IsPrefix(path_url, path_prefix)) {
			//std::cout<<"...... is not in scope!!!"<<std::endl;	
			return false;
		}
/*

		std::cout<<"%%%%%%%%%%%%%%%% U"<<subURL<<std::endl;
		std::cout<<"%%%%%%%%%%%%%%%% t"<<path_url<<std::endl;
		std::cout<<"%%%%%%%%%%%%%%%% P"<<subPrefix<<std::endl;
		std::cout<<"%%%%%%%%%%%%%%%% t"<<path_prefix<<std::endl;
		std::cout<<"%%%%%%%%%%%%%%%% net_L"<<net_l<<std::endl;
		std::cout<<"%%%%%%%%%%%%%%%% net_P"<<net_p<<std::endl;
*/
	return true;

}

bool Test(std::ostream & os) {
	bool success = true;

	std::string pre1 = "http://www.byu.edu/yuanzheng/";
	std::string pre2 = "file:///home/yuanzheng";

	std::string t1 = "http://www.byu.edu/yuanzheng/song.php";
	std::string t2 = "http://www.byu.edu/yuanzheng/";
	std::string t3 = "http://cs.byu.edu/yuanzheng/song.php";
	std::string ty = "http://www.byu.edu/yuanZheng/song.php";
	std::string tx = "http://www.BYU.edu/yuanzheng/song.html";

	TEST(http_prefix(t1, pre1));
	TEST(http_prefix(t2, pre1));
	TEST(!http_prefix(t3, pre1));
	TEST(!http_prefix(ty, pre1));
	TEST(http_prefix(tx, pre1));

	std::string t4 = "FILE:///home/yuanzheng/song.php";
	std::string t5 = "file:///home";
	std::string t6 = "file:///home/Yuanzheng/song.php";
	TEST(file_prefix(t4, pre2));
	TEST(!file_prefix(t5, pre2));
	TEST(!file_prefix(t6, pre2));
	TEST(!CheckPrefix(t6, pre1));

	std::string t7 = "http://www.byu.edu/song";
	std::string t8 = "file:///home/";
	std::string t9 = "http://www.byu.edu/yuanzheng.abc";

	TEST(CheckHTML(t7));
	TEST(CheckHTML(t8));
	TEST(CheckHTML(t1));
	TEST(!CheckHTML(t9));


	return success;


}

}
