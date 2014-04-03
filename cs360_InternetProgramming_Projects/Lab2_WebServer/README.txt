In this lab you will write a simple web server.  This web server will only handle static files via the GET method.  
CGI processing will be added in the next lab .

Your Web server should:

	Appropriatly respond to HTTP 1.1 requests; however, you don’t have to accept multiple requests on a single connection
	Only the GET method is required for this lab
	handle multiple simultaneous requests
	function with a variety of web browsers
	if the URL is a directory, check if an index.html page exists in the directory; if it does, return it, otherwise, output a directory listing (print out http headers and html) with links to each file or directory
	if an error occurs or if the file is not found, send back an appropriate error page

You should respond with the following Content-Type fields for these file extensions.

	Content-Type: text/html – for files with the .html suffix
	Content-Type: text/plain – for files with the .txt suffix
	Content-Type: image/jpg – for files with the .jpg suffix
	Content-Type: image/gif – for files with the .gif suffix


You may notice that when you start a server on a particular port, you cant use it again for a while. This occurs because 
the operating system keeps the resources allocated in case some data is in transit. To eliminate this behavior and allow 
the port to be immediately reused try

int optval = 1;
setsockopt (listenSocket, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval));

The linux command GET -Ue [URL] works similiarly to your lab 1 web client program, fetching the given URL and printing out 
the contents as well as the request and response headers. For more info, run man GET from the command line.

Semaphores:

The code on the Web Server Architecture slides (slide seven) is very pseudocode. For example, the correct syntax for 
semaphores for calls are:
	#include <semaphore.h>
	sem_t nameOfMutex;
	sem_init(&nameOfMutex,PTHREAD_PROCESS_SHARED, sizeOfMutex);
	sem_wait(&nameOfMutex);
	sem_post(&nameOfMutex);
	sem_close(&nameOfMutex);
 
Compile your code with the -lpthread flag
g++ -lpthread pthread1.c


gdb server    // using gdb run server program
(gdb) r 8080    // run server with port number 8080
                //'Ctrl-Z' do not stop server or gdb, it just send a signal to return program to run at backgroud!
				// using the 'fg' to get program back to front!
				// However, 'Ctrl-c' will interrupt the program totally.

(gdb) bt        // trace the system calls, so we can see what problem stops the program!!



(gdb) q         //quit the gdb

//because we are runing server under the gdb, so use the
//g++ -o server server -lpthread -g to compile it (-g)!!!
