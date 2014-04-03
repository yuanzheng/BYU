#include "URLHistoryTree.h"


URLHistoryTree::URLHistoryTree() {
	root = '\0';
	size = 0;

}


URLHistoryTree::~URLHistoryTree() {
	if (root != NULL)
		CleanTree(root);
	root = '\0';
}

URLHistory * URLHistoryTree::Insert(const std::string & url, const std::string & description) {
	URLHistory * newPage = '\0';

	if (root == NULL) {
		newPage = new URLHistory(url, description);
		root = newPage;
		size++;
	}
	else
		newPage = Addit(url, description, root);

	return newPage;
}

URLHistory * URLHistoryTree::Addit(const std::string & url, const std::string & description, URLHistory * curNode) {
	if (curNode->GetURL().compare(url) > 0)
		if (curNode->GetLeft() == NULL) {
			curNode->left = new URLHistory(url, description);
			size++;
//			std::cout<<"Add left: "<<curNode->left->GetURL()<<std::endl;
			return curNode->left;
		}
		else 
			return Addit(url, description, curNode->left);
	else if (curNode->GetURL().compare(url) < 0) 
		if (curNode->GetRight() == NULL) {
			curNode->right = new URLHistory(url, description);
			size++;
//			std::cout<<"Add right: "<<curNode->right->GetURL()<<std::endl;
			return curNode->right;
		}
		else
			return Addit(url, description, curNode->right);
	else
		return NULL;
}



bool URLHistoryTree::IsEmpty()const {
	return (size == 0);
}

void URLHistoryTree::CleanTree(URLHistory * curNode) {
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
//		std::cout<<"URLHistoryTree - CleanTree : delete: "<<curNode->GetURL()<<std::endl;
		delete curNode;
		size--;
	}
}

int URLHistoryTree::GetSize()const {
	return size;
}


URLHistory * URLHistoryTree::GetTree()const {
	return root;
}

