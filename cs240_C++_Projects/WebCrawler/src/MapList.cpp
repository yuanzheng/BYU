
#include "MapList.h"


MapList::MapList() {
	root = '\0';
	size = 0;
}

MapList::~MapList() {
	if (root != NULL)
		CleanTree(root);
	root = '\0';
}



PageMap * MapList::Insert(const std::string & url) {
	PageMap * newNode = '\0';

	if (root == NULL) {
		newNode = new PageMap(url, 1);
		//std::cout<<"start insert..."<<std::endl;
		root = newNode;
		size++;
	}
	else
		newNode = Addit(url, root);

	return newNode;
}

PageMap * MapList::Addit(const std::string & url, PageMap * curNode) {
	//std::cout<<"We inste "<<url<<std::endl;
	//std::cout<<"       & "<<curNode->GetURL()<<std::endl;
	//std::cout<<" v.s.    "<<curNode->GetURL().compare(url)<<std::endl;
	if (curNode->GetURL().compare(url) > 0)
		if (curNode->GetLeft() == NULL) {
		//	std::cout<<"MapList Left "<<curNode->GetURL()<<std::endl;
			curNode->left = new PageMap(url, 1);
			size++;
		//	std::cout<<"Add left: "<<curNode->left->GetURL()<<std::endl;
			return curNode->left;
		}
		else 
			return Addit(url, curNode->left);
	else if (curNode->GetURL().compare(url) < 0) {
		//std::cout<<"Right side "<<std::endl;	 
//		std::cout<<"           "<<(curNode->GetRight())->GetURL()<<std::endl;	 
		if (curNode->GetRight() == NULL) {
			//std::cout<<"MapList right "<<std::endl;
			//std::cout<<curNode->GetURL()<<std::endl;
			curNode->right = new PageMap(url, 1);
			size++;
			//std::cout<<"Add right: "<<curNode->right->GetURL()<<std::endl;
			return curNode->right;
		}
		else
			return Addit(url, curNode->right);
	}
	else {
//		std::cout<<"Increase timtes!!!"<<std::endl;
		//	 is the current word...
		curNode->IncreaseTimes();	
	}

	return curNode;
}


PageMap * MapList::GetRoot()const {
	return root;
}


bool MapList::IsEmpty()const {
	return (size == 0);
}

void MapList::CleanTree(PageMap * curNode) {
	if (curNode->left != NULL) {
		CleanTree(curNode->left);
		curNode->left = '\0';
		//cout<<"check left if : "<<curNode->left<<endl; //" : "<<curNode->left->GetValue()<<endl;
	}

	if (curNode->right != NULL) {
		CleanTree(curNode->right);
		curNode->right = '\0';
		//cout<<"check right if : "<<curNode->right<<endl; //" : "<<curNode->right->GetValue()<<endl;
	}

	if (curNode->left == NULL && curNode->right == NULL) {
//		std::cout<<"MapList - CleanTree : delete: "<<curNode->GetURL()<<std::endl;
		delete curNode;
		size--;
	}

}
int MapList::GetSize()const {
	return size;
}

/*
BSTNode * BST::Find(const std::string & v)const {
	if (root == NULL)
		return NULL;

	return Search(v, root);
}

BSTNode * BST::Search(const std::string & v, BSTNode * curNode) const {
	if (curNode != NULL) {	
		if (curNode->GetValue().compare(v) > 0)






*/





