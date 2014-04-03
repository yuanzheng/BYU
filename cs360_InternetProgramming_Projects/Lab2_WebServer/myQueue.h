/* 
 * File:   myQueue.h
 * Author: yuanzheng
 *
 * Created on May 11, 2010, 11:21 PM
 */

#ifndef _MYQUEUE_H
#define	_MYQUEUE_H

#include<queue>
#include <semaphore.h>

using namespace std;

template <typename T>

class myQueue 
{

public:
    myQueue();
    myQueue(int size);
    ~myQueue();
    void enqueue(T qel);
    T dequeue();

private:
    queue <T> q;
    int Max_size;
    sem_t Emptysem;
    sem_t Presentsem;
    sem_t mutex;

};

template <typename T>
myQueue<T>::myQueue()
{
	Max_size = 0;
	sem_init(&Emptysem, PTHREAD_PROCESS_PRIVATE, Max_size);
	sem_init(&Presentsem, PTHREAD_PROCESS_PRIVATE, 0);
	sem_init(&mutex, PTHREAD_PROCESS_PRIVATE, 1);
}
template <typename T>
myQueue<T>::myQueue(int size)
{
	Max_size = size;
	sem_init(&Emptysem, PTHREAD_PROCESS_PRIVATE, Max_size);
	sem_init(&Presentsem, PTHREAD_PROCESS_PRIVATE, 0);
	sem_init(&mutex, PTHREAD_PROCESS_PRIVATE, 1);
}
template <typename T>
myQueue<T>::~myQueue()
{
    sem_close(&Emptysem);
    sem_close(&Presentsem);
    sem_close(&mutex);
}
template <typename T>
void myQueue<T>::enqueue(T qel)
{
	//printf("queue size: %d\n", q.size());
    sem_wait(&Emptysem);
    sem_wait(&mutex);
    q.push(qel);
	//printf("socket: %d added in.\n", qel);
    sem_post(&mutex);
    sem_post(&Presentsem);
}
template <typename T>
T myQueue<T>::dequeue()
{
    sem_wait(&Presentsem);
    sem_wait(&mutex);
    T tmp;                 //this is a local variable, so it cannot be affected!!!
    tmp = q.front();
    q.pop();
	cout<<"I took socket: "<<tmp<<endl;
    sem_post(&mutex);
    sem_post(&Emptysem);
    return tmp;                           
}

#endif	/* _MYQUEUE_H */


