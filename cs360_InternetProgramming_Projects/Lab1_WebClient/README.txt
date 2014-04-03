
The goals of this assignment are 
	(1) to learn how to write a client application using the BSD socket API, 
	(2) to understand how to process and parse data when reading from a network socket, and 
	(3) to understand the basics of the HTTP protocol.

In this assignment, you will write a simple web client in C++ that can download a web page from a web server. 
This will help you to understand the BSD socket API from the perspective of the client and give you a basic 
understanding of HTTP.

Basic Web Client

Your web client will accept a host name, port, and a URL on the command line. The client will use DNS to convert 
the host name into an IP address, then connect to the specified web server using the IP address and port. 
Once connected, the client will download the URL listed on the command line, sending an HTTP/1.0 request and parsing 
the response for each object. If the -d flag is present, your web client will also print the HTTP request sent and 
the HTTP response received.

To download a URL, the web client needs to

	1. Send the GET command on the socket ¡°GET /path/to/file/index.html HTTP/1.0¡å
	2. Receive an HTTP response, then examine the response for the Content-Length header. The value of this header 
	   indicates how many bytes to read to receive the object, given in the entity body of the HTTP message. Thus 
	   each time the client downloads an object, it first reads until it receives a sentinel (¡±\r\n\r\n¡±), then reads 
	   a given number of bytes.
	3. Read the content of the response
	
Command Line Arguments and Error Checking

Your client should be called download and must take the following parameters on the command line: 
	(a) a host name, 
	(b) a port number, 
	(c) a URL. Each object is given as an absolute path. For example:

download students.cs.byu.edu 80 /index.html

If the users does not specify the correct number of arguments, the program should exit gracefully and print an message 
informing the user about the correct way to call the program. The program should also gracefully exit if the host name or 
port number is not valid.

Your program should additionally parse a debugging flag ¡°-d¡±, which when activated will print out all communications in 
either direction between the program and the web server. However, the program should not print debugging lines if the flag 
is not specified on the command line. In this case, the program should just print out the contents of the web page (in text). 
I suggest using the getopt  API for parsing the command line options; see man 3 getopt.

You should check for errors for all system calls and exit gracefully if an error occurs, printing out an appropriate error 
message with perror().