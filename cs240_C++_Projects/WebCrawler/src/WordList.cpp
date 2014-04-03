#include "WordList.h"

WordList::WordList() {
	root = '\0';
	size = 0;

}

WordList::~WordList() {
	if (root != NULL)
		CleanTree(root);
	root = '\0';
}



WordIndex * WordList::Insert(const std::string & word, const std::string & url) {
	WordIndex * newNode = '\0';
//	std::cout<<"word going to be inserted : "<<word<<std::endl;

	if (root == NULL) {
		newNode = new WordIndex(word, url);
//		std::cout<<"start insert..."<<std::endl;
		root = newNode;
		size++;
	}
	else
		newNode = Addit(word, url, root);

	return newNode;
}

WordIndex * WordList::Addit(const std::string & word, const std::string & url, WordIndex * curNode) {
	//std::cout<<"look:   "<<curNode->GetWord()<<std::endl;
	if (curNode->GetWord().compare(word) > 0)
		if (curNode->GetLeft() == NULL) {
//			std::cout<<"llllleft"<<std::endl;
			curNode->left = new WordIndex(word, url);
			size++;
			//std::cout<<"Add left: "<<curNode->left->GetWord()<<std::endl;
			return curNode->left;
		}
		else 
			return Addit(word, url, curNode->left);
	else if (curNode->GetWord().compare(word) < 0) 
		if (curNode->GetRight() == NULL) {
//			std::cout<<"rrrrrightt"<<std::endl;
			curNode->right = new WordIndex(word, url);
			size++;
			//std::cout<<"Add right: "<<curNode->right->GetWord()<<std::endl;
			return curNode->right;
		}
		else
			return Addit(word, url, curNode->right);
	else
		// is the current word...
		curNode->AddURLLinks(url);	
	return curNode;
}


WordIndex * WordList::GetRoot()const {
	return root;
}


bool WordList::IsEmpty()const {
	return (size == 0);
}

void WordList::CleanTree(WordIndex * curNode) {
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
//		std::cout<<"WordList - CleanTree : delete: "<<curNode->GetWord()<<std::endl;
		delete curNode;
		size--;
	}

}
int WordList::GetSize()const {
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




