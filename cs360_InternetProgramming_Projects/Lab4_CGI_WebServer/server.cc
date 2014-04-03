/*
 * File:   main.cpp
 * Author: yuanzheng
 *
 * Created on May 25, 2010, 9:54 PM
 */

#include <sys/types.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <unistd.h>
#include <netinet/in.h>
#include <netdb.h>
#include <string.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <vector>
#include <fcntl.h>
#include <string>
#include <dirent.h>
#include <pthread.h>
#include <iostream>
#include <errno.h>
#include <sys/signal.h>
#include <string.h>
#include "myQueue.h"

using namespace std;

#define SOCKET_ERROR        -1
#define BUFFER_SIZE         1024
#define MESSAGE             "This is the message I'm sending back and forth"
#define QUEUE_SIZE          10
#define MAX_MSG_SZ      2024
#define MAX_THREADS     10
#define LISTEN_SIZE     1024


myQueue<int> connectionQ(QUEUE_SIZE);

// Determine if the character is whitespace
bool isWhitespace(char c)
{
    switch (c)
    {
        case '\r':
        case '\n':
        case ' ':
        case '\0':
            return true;
        default:
            return false;
    }
}

// Strip off whitespace characters from the end of the line
void chomp(char *line)
{
    int len = strlen(line);
    while (isWhitespace(line[len]))
    {
        line[len--] = '\0';
    }
}

// Read the line one character at a time, looking for the CR
// You dont want to read too far, or you will mess up the content
char * GetLine(int socket)
{
    char tline[MAX_MSG_SZ];
    char *line;

    int messagesize = 0;
    int amtread = 0;
    while((amtread = recv(socket, tline + messagesize, 1, 0)) < MAX_MSG_SZ)
    {
        if (amtread > 0)
            messagesize += amtread;
        else
        {
            perror("Socket Error is:");
            fprintf(stderr, "Read Failed on file descriptor %d messagesize = %d\n", socket, messagesize);
             return NULL;  // don't use exit(0); signal should be used
        }
        //fprintf(stderr,"%d[%c]", messagesize,message[messagesize-1]);
        if (tline[messagesize - 1] == '\n')// format is \r\n
            break;
    }
    tline[messagesize] = '\0';
    chomp(tline);
    line = (char *)malloc((strlen(tline) + 1) * sizeof(char));
    strcpy(line, tline);
    //fprintf(stderr, "GetLine: [%s]\n", line);
    return line;
}

// Change to upper case and replace with underlines for CGI scripts
void UpcaseAndReplaceDashWithUnderline(char *str)
{
    int i;
    char *s;

    s = str;
    for (i = 0; s[i] != ':'; i++)
    {
        if (s[i] >= 'a' && s[i] <= 'z')
            s[i] = 'A' + (s[i] - 'a');

        if (s[i] == '-')
            s[i] = '_';
    }

}


// When calling CGI scripts, you will have to convert header strings
// before inserting them into the environment.  This routine does most
// of the conversion
char *FormatHeader(char *str, char *prefix)
{
    char *result = (char *)malloc(strlen(str) + strlen(prefix));
    char* value = strchr(str,':') + 2;
    UpcaseAndReplaceDashWithUnderline(str);
    *(strchr(str,':')) = '\0';
    sprintf(result, "%s%s=%s", prefix, str, value);
    return result;
}

// Get the header lines from a socket
//   envformat = true when getting a request from a web client
//   envformat = false when getting lines from a CGI program
void GetHeaderLines(vector<char *> &headerLines, int skt, bool envformat)
{
    // Read the headers, look for specific ones that may change our responseCode
    char *line;
    char *tline;

    tline = GetLine(skt);   // "\r\n\r\n"
    while(strlen(tline) != 0)
    {
        if (strstr(tline, "Content-Length") ||
            strstr(tline, "Content-Type"))
        {
            if (envformat)
                line = FormatHeader(tline, "");
            else
                line = strdup(tline);
        }
        else
        {
            if (envformat)
                line = FormatHeader(tline, "HTTP_");
            else
            {
                line = (char *)malloc((strlen(tline) + 10) * sizeof(char));
                sprintf(line, "%s", tline);
            }
        }
        //fprintf(stderr, "Header --> [%s]\n", line);

        headerLines.push_back(line);
        free(tline);
        tline = GetLine(skt);      // Getline() loop for everyline
    }
    free(tline);
}

void get_directory(vector<string> &path, char* dir)
{
    DIR *dirp;
    struct dirent *dp;
    string name;

    dirp = opendir(dir);


    while ((dp = readdir(dirp)) != NULL)
    {
        name = dp->d_name;
        if (name == ".." || name == ".")
            continue;

        path.push_back(name);

    }


}


void send_msg(int socket, string message)
{
    char* msg = &message[0];
    int nleft = message.length();
    int nsent;
    cout<<"total sending: "<<nleft<<endl;
	cout<<"and message   "<<msg<<endl;
    while (nleft)
    {
        if ((nsent = send(socket, msg, nleft, 0))<0)   // send the max at once
        {
            if(errno == EINTR) {
                nsent = 0;
            }else {
                perror("write");
                break;
            }
        }
        else if (nsent == 0) {
            cout<<"The socket is closed!"<<endl;
            break;
        }


        nleft -= nsent;
        msg += nsent;
    }

}


void send_body (int socket, char* url, int size)
{
    char buffer[MAX_MSG_SZ + 1];
    int fd = open(url,O_RDONLY);
	string defaultMSG = "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\"> <html><head> <title>Error: 404 Not Found</title> </head><body> <h1>Error 5xx: Server is busy!</h1> <p> Sorry, please try it again!<br /> </p> <hr> </body></html>";


    if(fd < 0) {
        perror("open failed");
    }
    int counter = 0;
    int rval;
    int nsent;
    while(size) {
        if ((rval = read(fd,buffer,MAX_MSG_SZ)) > 0){
            buffer[rval] = '\0';

            if ((nsent = write(socket, buffer, rval))<0)   // write() and send() both send info to client
            {
                if(errno == EINTR) {
                    nsent = 0;
                }else {
                    perror("write");
                    break;
                }
            }
            else if (nsent == 0) {
                cout<<"The socket is closed!"<<endl;
                break;
             }
             else {
                  counter += nsent;
             }
        }

        else{
			send_msg(socket, defaultMSG);
            perror("read failed");
            break;
        }

        size -= rval;
    }
    cout<<"Total sent out: "<<counter<<endl;
	close(fd);

}


void send_200 (int socket, char* url, int file_size)
{
    string HTTP_200_OK = "HTTP/1.0 200 OK";
    //string content_length;
    string content_type;
    string http_status_line;
    string headerfile="";

    char buf[33];
    http_status_line = HTTP_200_OK;
    http_status_line.append("\r\n");
    //content_length = "Content_lenght: ";
    sprintf(buf, "%d", file_size);
    //content_length.append(strdup(buf));
    //content_length.append("\r\n");
    //body_message = create_message(http_status, url, file_size);

    headerfile.append(http_status_line);
    //headerfile.append(content_length);
    headerfile.append(content_type);
    headerfile.append("\r\n");

    cout<<headerfile<<endl;
    send_msg(socket, headerfile);

    //cout<<"sending the bodymessage:"<<endl;
    send_body(socket, url, file_size);

}

void send_CGI_200 (int socket, int file_size)
{
    string HTTP_200_OK = "HTTP/1.0 200 OK";
    //string content_length;
    //string content_type;
    string http_status_line;
    string headerfile="";

    char buf[33];
    http_status_line = HTTP_200_OK;
    http_status_line.append("\r\n");
    //content_length = "Content_lenght: ";
    //sprintf(buf, "%d", file_size);
    //content_length.append(strdup(buf));
    //content_length.append("\r\n");
    //body_message = create_message(http_status, url, file_size);

    headerfile.append(http_status_line);
    //headerfile.append(content_length);
    //headerfile.append(content_type);
    //headerfile.append("\r\n");

    cout<<headerfile<<endl;
    send_msg(socket, headerfile);

}

void send_404(int socket, char* url)
{
    string HTTP_404_NF = "HTTP/1.0 404 No Found";
    string content_length;
    string content_type = "Content-Type: text/html\r\n";
    string http_status_line;
    string body_message;
    string message = "";

    char buf[33];
    http_status_line = HTTP_404_NF;
    http_status_line.append("\r\n");

    body_message = "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\"> <html><head> <title>Error: 404 Not Found</title> </head><body> <h1>Error 404: Not Found</h1> <p> ....<br /> </p> <hr> </body></html>";

    content_length = "Content_lenght: ";
    sprintf(buf, "%d", body_message.length());
    content_length.append(strdup(buf));
    content_length.append("\r\n");

    message.append(http_status_line);
    message.append(content_length);
    message.append(content_type);
    message.append("\r\n");

    cout<<message<<endl;
    message.append(body_message);

    send_msg(socket, message);

}

void send_400 (int socket, char* url)
{
    string HTTP_400_BAD = "HTTP/1.0 400 Bad Request";
    string content_length;
    string content_type = "Content-Type: text/html\r\n";
    string http_status_line;
    string body_message;
    string message = "";


    char buf[33];
    http_status_line = HTTP_400_BAD;
    http_status_line.append("\r\n");

    body_message = "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\"> <html><head> <title>Error: 400 Dad Request</title> </head><body> <h1>Error 400: Bad Request</h1> <p>Sorry, we only support \".html, .txt, .jpg, or .gif\" files.<br /> </p> <hr> </body></html>";

    content_length = "Content_lenght: ";
    sprintf(buf, "%d", body_message.length());
    content_length.append(strdup(buf));
    content_length.append("\r\n");

    message.append(http_status_line);
    message.append(content_length);
    message.append(content_type);
    message.append("\r\n");

    cout<<message<<endl;
    message.append(body_message);

    send_msg(socket, message);
}

void send_3xx (int socket, char* url)
{
    string HTTP_3XX_DR = "HTTP/1.0 3XX Print Directory";
    string content_length;
    string content_type = "Content-Type: text/html\r\n";
    string http_status_line;
    string body_message;
    string message = "";


    char buf[33];
    http_status_line += HTTP_3XX_DR;
    http_status_line.append("\r\n");

    vector<string> path;
    char folder[] = "folder/";                                   //should be globle variable
    char* new_url = new char[strlen(url) + strlen(folder) + 1];
    strcpy(new_url, url);
    strcat(new_url, folder);

    //cout<<"New Url: "<<new_url<<endl;
    get_directory(path, new_url);      // find all of files and folders in this new_url directory
   // path.push_back()
    body_message = "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\"> <html><head> <title>Error: 300 Print Directory</title> </head><body> <h1>Directory:</h1> <p><ul>";
    for(int i=0; i<path.size(); i++)
    {
        body_message.append("<li><a href=\"/folder/");
        body_message.append(path.at(i));
        body_message.append("\">");
        body_message.append(path.at(i));
        body_message.append("</a></li>");
    }

    body_message.append("</ul> </p> <hr> </body></html>");

    content_length = "Content_lenght: ";
    sprintf(buf, "%d", body_message.length());
    content_length.append(strdup(buf));
    content_length.append("\r\n");

    message.append(http_status_line);
    message.append(content_length);
    message.append(content_type);
    message.append("\r\n");

    cout<<message<<endl;
    message.append(body_message);

    send_msg(socket, message);

    delete[] new_url;

}

bool file_extensions(char *url)
{
    string content_type;
    char* contenttype;
    char tHtml[] = ".html";//"text/html";
    char tPlain[] = ".txt";//"text/plain";
    char iJPG[] = ".jpg";//"image/jpg";
    char iGIF[] = ".gif";//"image/gif";
    char CGI[] = ".cgi";
    char PL[] = ".pl";
    char PHP[] = ".php";
    
    //Returns a pointer to the first occurrence of character

	char* temp;
    temp = strchr(url, '.');
    char *query = strchr(temp, '?');

    //char* modified_url;

    if (query != NULL)
        contenttype = strndup(temp, strlen(temp)-strlen(query));
    else
        contenttype = strndup(temp, strlen(temp));
/*
	char* query = strchr(url, '?');
	if (query == NULL)
		contenttype = strchr(url, '.');
	else
	{
		contenttype = strchr(url,'.');
		
	}
*/
    //cout<<"check the type: "<<contenttype<<endl;

    if (strcmp(contenttype, tHtml)==0){
        content_type = "Content-Type: text/html";
        content_type.append("\r\n");
    }
    else if (strcmp(contenttype, tPlain)==0){
        content_type = "Content-Type: text/plain";
        content_type.append("\r\n");
    }
    else if(strcmp(contenttype, iJPG)==0) {
        content_type = "Content-Type: image/jpg";
        content_type.append("\r\n");
    }
    else if(strcmp(contenttype, iGIF)==0) {
        content_type = "Content-Type: image/gif";
        content_type.append("\r\n");
    }
    else if(strcmp(contenttype, CGI)==0) {
       //what if the cgi file is not exist?
        content_type = "Content-Type: CGI";
        content_type.append("\r\n");
    }
    else if(strcmp(contenttype, PL)==0) {
       content_type = "Content-Type: PL";
       content_type.append("\r\n");
    }
    else if(strcmp(contenttype, PHP)==0) {
       content_type = "Content-Type: PHP";
       content_type.append("\r\n");
    }
    else
        return false;

    return true;

}

void static_Web_Resp(int socket, int http_status, char* url, int file_size )
{
    switch(http_status){
        case 200: {
            send_200(socket, url, file_size);
            break;
        }
        case 404: {
            send_404(socket, url);
            break;
        }
        case 400: {
            send_400(socket, url);
            break;
        }
        default: {
            send_3xx(socket, url);
            break;
        }
    }
}



void read_by_Length(int socket, int content_len)
{
    char buffer[MAX_MSG_SZ+1];
    //char contentType[MAX_MSG_SZ];

    // Now read and print the rest of the file
    int rval;
    if (content_len == 0) {

        while((rval = recv(socket,buffer,MAX_MSG_SZ, 0)) > 0) {

            if (rval < MAX_MSG_SZ)
                buffer[rval] = '\0';
            else
                buffer[MAX_MSG_SZ] = '\0';

            cout<<buffer;
        }
    }
    else{
        while (content_len != 0) {

            if ((rval = recv(socket,buffer,MAX_MSG_SZ, 0)) > 0)
            {
                if (rval < MAX_MSG_SZ)
                    buffer[rval] = '\0';
                else
                    buffer[MAX_MSG_SZ] = '\0';

                cout<<buffer;

                content_len -= rval;
            }
            else
                perror("The socket is closed!\n");

        }
    }

    cout<<endl<<endl;

}

char** enviroment_v(vector<char *> &headerLines, const char* method, char* url, char* query )
{
    char* gateway; //= String("GATEWAY_INTERFACE=CGI/1.1");
    char* REQUEST_URI; //=%s; //where %s is the url
    char* REQUEST_METHOD;  //=%s //where %s is either POST or GET
    char* QUERY_STRING;   //=%s //where %s is everything after ? in the url

    gateway = new char[strlen("GATEWAY_INTERFACE=CGI/1.1") + 1];
    strcpy(gateway,"GATEWAY_INTERFACE=CGI/1.1");

    REQUEST_URI = new char[strlen("REQUEST_URI=") + strlen(url) + 1];
    strcpy(REQUEST_URI, "REQUEST_URI=");
    strcat(REQUEST_URI, url);

    REQUEST_METHOD = new char[strlen(method) + strlen("REQUEST_METHOD=") + 1];
    strcpy(REQUEST_METHOD, "REQUEST_METHOD=");
    strcat(REQUEST_METHOD, method);

    if (query != NULL)
    {
        QUERY_STRING = new char[strlen("QUERY_STRING=") + strlen(query)];   // without +1, because ? is in the front
        strcpy(QUERY_STRING, "QUERY_STRING=");
        strcat(QUERY_STRING, &query[1]);    //because there is a ? in the front, take it off
    }else
    {
        QUERY_STRING = new char[strlen("QUERY_STRING=") + 1];   // without +1, because ? is in the front
        strcpy(QUERY_STRING, "QUERY_STRING=");
    }

	headerLines.push_back(gateway);
    headerLines.push_back(REQUEST_URI);
    headerLines.push_back(REQUEST_METHOD);
    headerLines.push_back(QUERY_STRING);

	char* contenttype = strchr(url, '.');
	if (strcmp(contenttype, ".php") == 0)
	{
		char* SCRIPT_FILENAME = (char* )"SCRIPT_FILENAME=/usr/bin/php-cgi";   // use the  / because this is root directory
		char* SCRIPT_NAME = new char[strlen("SCRIPT_NAME=") + strlen(url) + 1];
		strcpy(SCRIPT_NAME, "SCRIPT_NAME=");
		strcat(SCRIPT_NAME, url);
		char* REDIRECT_STATUS = (char* )"REDIRECT_STATUS=200";

		headerLines.push_back(SCRIPT_FILENAME);
		headerLines.push_back(SCRIPT_NAME);
		headerLines.push_back(REDIRECT_STATUS);
	}

    char** env = (char**)malloc((headerLines.size()+1)*sizeof(char*));
	int i;
    for (i=0; i<headerLines.size(); i++)
    {
        env[i] = (char *)malloc(strlen(headerLines[i]) * sizeof(char)+5);
        strcpy(env[i], headerLines[i]);

    }
	env[i] = '\0';     // very important.... as same as strcpy char*
    return env;

}
void launch_CGI(int socket, const char* method, char* url, int file_size)
{
    char buffer[MAX_MSG_SZ+1];
    vector<char *> headerLines;
    int content_length = 0;

    GetHeaderLines(headerLines, socket , true);   // change to true, star the cgi parse
    cout<<"launch the CGI : "<<endl;
/*
	for (int i=0; i<headerLines.size(); i++)
    {
		cout<<headerLines[i]<<endl;
	}
*/
    char* query = strchr(url, '?');
    char* path;
	char* modified_path;

	//separate the path and query, execve() needs the path without the ?
    if (query != NULL){
        path = strndup(url, strlen(url)-strlen(query) );
    }
    else
        path = strndup(url, strlen(url));

/*	
	modified_path = new char[strlen(path) + strlen("/") + 1];
	strcpy(modified_path,"/");
	strcat(modified_path, path);
*/
    char** env = enviroment_v(headerLines, method, path, query);
    
/*
	for (int i=0; i<headerLines.size(); i++)
    {
		cout<<env[i]<<endl;
	}

	cout<<"****** check env *************"<<endl;

    cout<<env[0]<<endl;
    cout<<env[1]<<endl;
    cout<<env[2]<<endl;
*/
	cout<<"PATH: "<<path<<endl;

	int ServeToCGIpipefd[2];
    int CGIToServepipefd[2];
    pipe(ServeToCGIpipefd);
    pipe(CGIToServepipefd);

    pid_t pid;

    pid = fork();
    if (pid == 0) // I am the child who is going to exec the CGI script
    {
        close(ServeToCGIpipefd[1]);    // close the write side of the pipe from the server
        dup2(ServeToCGIpipefd[0], 0);  // dup the pipe to stdin
        close(CGIToServepipefd[0]);    // close the read side of the pipe to the server
        dup2(CGIToServepipefd[1], 1);  // dup the pipe to stdout
		//char* arg[2] = {path, (char*)0};

        char* contenttype = strchr(path, '.');
        if (strcmp(contenttype, ".php") == 0)
        {
			char* dirc = (char*)"/usr/bin/php-cgi";
            char* arg[3] = {dirc,path, (char*)0};
            execve(arg[0], arg, env);
        }
        else {
            char* arg[2] = {path, (char*)0};

            // set up args and env
            execve(path, arg, env);
        }
		
    }
    else if (pid < 0)            // failed to fork
    {
            cerr << "Failed to fork" << endl;
    }
    else // This is the parent
    {
        close(ServeToCGIpipefd[0]);  // close the read side of the pipe to the CGI script
        close(CGIToServepipefd[1]);  // close the write side of the pipe from the CGI script

        // Now print them out
        for (int i = 0; i < headerLines.size(); i++) {
            if(strstr(headerLines[i], "CONTENT_LENGTH")) {
                sscanf(headerLines[i], "CONTENT_LENGTH=%d", &content_length);
            }
        }
        //read_by_Length(socket, content_length);

        if (strcmp(method, "POST") == 0)
        {
            int rval;
            while (content_length != 0) {

                if ((rval = recv(socket,buffer,MAX_MSG_SZ, 0)) > 0)
                {
                    if (rval < MAX_MSG_SZ)
                        buffer[rval] = '\0';
                    else
                        buffer[MAX_MSG_SZ] = '\0';

                    content_length -= rval;

                    //?????????????????????? what is this write function????
                    int x = write (ServeToCGIpipefd[1], buffer, rval);

					cout<<"return from write   "<<x<<endl;
                    // Read from the CGIToServePipefd[0] until you get an error and write this data to the socket
                }
                else
                    perror("The socket is closed!\n");

            }
        }
        send_CGI_200 (socket, file_size);
        // Read from the CGIToServepipefd[0] until you get an error and write this data to the socket
        int rval;
        int nsent;
        while(true) {

            if ((rval = read(CGIToServepipefd[0],buffer,MAX_MSG_SZ)) > 0){
                buffer[rval] = '\0';
				
                if ((nsent = write(socket, buffer, rval))<0)   // write() and send() both send info to client
                {
                    if(errno == EINTR) {
                        nsent = 0;
                    }else {
                        perror("loooooook write");
                        break;
                    }
                }
                else if (nsent == 0) {
                    cout<<"The socket is closed!"<<endl;
                    break;
                }
                else {

                 }

            }
            else{
                //send_msg(socket, defaultMSG);
                perror("read failed");
                break;
            }

        }

        close(ServeToCGIpipefd[1]); // all done, close the pipe
        close(CGIToServepipefd[0]); // all done, close the pipe
    }

}


void send_message(int socket, const char* method, char* url)
{
    struct stat filestat;
    int http_status = 0;
    int file_size=0;
	

    if(stat(url, &filestat)) {        // format: ./directory, directory/, or directory !!!
        //cout <<"ERROR in stat\n";    //no such file!!!
        if (file_extensions(url))
            http_status = 404;
        else
            http_status = 400;        // otherwise I don't support this file extension.
    }

    while (http_status == 0)
    {
        if(S_ISREG(filestat.st_mode)) {   // there is this file

            if (file_extensions(url)) {
                //it is static web file
                http_status = 200;
                //to determine the content-length
                file_size = filestat.st_size;
            }
            else {
                http_status = 400;
                //cout << url << " is not a supported file \n";
            }
        }

        if(S_ISDIR(filestat.st_mode)) {  // it's directory!

            //char default_file[] = "index.html";    // it need the '/', therefore, url = test_folder/index.html, or url = test_folder/folder/index.html
            char* newUrl;

            newUrl = new char[strlen(url) + strlen("index.html") + 1];
            strcpy(newUrl, url);
            strcat(newUrl, "index.html");


            if(stat(newUrl, &filestat)) {    // if it still cannot be found
                cout <<newUrl<<" is not found!!!\n";    //no such file!!!
                //output a directory listing (print out http headers and html) with links to each file or directory

                http_status = 300;            //a directory list
                delete[] newUrl;
            }
            else
                url = newUrl;   //it can be found
           
        }

    }

	//cout<<"look at "<<url<<endl;
    char* contenttype;
    char CGI[] = ".cgi";
    char PL[] = ".pl";
    char PHP[] = ".php";

    //Returns a pointer to the first occurrence of character
    contenttype = strchr(url, '.');
    // check if this is a dynamic web file request
    if(strncmp(contenttype, CGI, 4)==0) {
        launch_CGI(socket, method, url, file_size);      // send header file????
    }
    else if(strncmp(contenttype, PL, 3)==0) {
		launch_CGI(socket, method, url, file_size); 
    }
    else if(strncmp(contenttype, PHP, 4)==0) {
		launch_CGI(socket, method, url, file_size); 
    }
    else {
        static_Web_Resp(socket, http_status, url, file_size );

    }

    shutdown(socket, SHUT_RDWR);  //very important, must let client know you shutdown his socket
    //cout<<"response has been sent!"<<endl<<endl;
    if(close(socket) == SOCKET_ERROR)
    {
         printf("\nCould not close socket\n");

    }

}

void receive_req(int socket)
{
    char* method;
    char* uri_;
    char* version_;
    // First read the status line
    char *startline = GetLine(socket);

    if (startline != NULL)
    {
        printf("Status line %s\n\n",startline);


        char* pch = strtok(startline, " ");
        int counter =0 ;

        while (pch != NULL)
        {
            if (counter == 0) {
                    method = new char[strlen(pch) + 1];
                    strcpy(method, pch);
                    //cout<<"llo: "<<method<<endl;
            }
            if (counter == 1){
                    uri_ = new char[strlen(pch) + 1];
                    strcpy(uri_, pch);
                    //cout<<"Look: url "<<uri_<<endl;
            }
            if (counter == 2){
                    version_ = new char[strlen(pch) + 1];
                    strcpy(version_, pch);
            }

            pch = strtok (NULL, " ");
            counter++;
        }


        printf("%s, %s, %s\n", method, uri_, version_);
        // take off the /
        char *modified_uri = strndup(uri_+1, strlen(uri_)-1 );
        
        if (uri_ == NULL){

            if(close(socket) == SOCKET_ERROR)
            {
                printf("\nCould not close socket\n");
            }
        }
        else
        {
            
            char* url = new char[strlen("test_folder/") + strlen(modified_uri) + 1];
            strcpy(url, "test_folder/");
            strcat(url, modified_uri);
			
            send_message(socket, method, url);
            delete[] url;
           
        }
		delete modified_uri;
    }

	delete[] uri_;
    delete startline;
    delete[] method;
    delete[] version_;
    

}

void *HandleConnection(void* args)
{
    int socket;

    while (1)
    {
        socket = connectionQ.dequeue();
	//printf("I got : %d\n", socket);
        receive_req(socket);

    }
}

void handler (int status)
{
    fprintf(stderr,"****************** received signal %d\n",status);
}



int main(int argc, char** argv) {


    struct sigaction sigold, signew;

	// call handler function, for avoiding the crash down the system!!
    signew.sa_handler=handler;

	// run this server, use the Ctrl + z to crash system to test it.
	// don't use the exit(0); statement, otherwise the system will be shut down, when signaled!

    sigaction(SIGPIPE,&signew,NULL);


    int hSocket,hServerSocket;  /* handle to socket */
    struct hostent* pHostInfo;   /* holds info about a machine */
    struct sockaddr_in Address; /* Internet socket address stuct */
    int nAddressSize=sizeof(struct sockaddr_in);
    int nHostPort;

    if(argc < 2)
      {
        printf("\nUsage: server host-port\n");
        return 0;
      }
    else
      {
        nHostPort=atoi(argv[1]);
      }

    printf("\nStarting server");

    printf("\nMaking socket");
    /* make a socket */
    hServerSocket=socket(AF_INET,SOCK_STREAM,0);

    if(hServerSocket == SOCKET_ERROR)
    {
        printf("\nCould not make a socket\n");
        return 0;
    }

	// set socket to reuse port from bind
	int optval = 1;
	if (setsockopt(hServerSocket, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval)) < 0 )
	{
		perror("setsocketopt is wrong!");
		return 0;
	}

    /* fill address struct */
    Address.sin_addr.s_addr=INADDR_ANY;
    Address.sin_port=htons(nHostPort);
    Address.sin_family=AF_INET;

    printf("\nBinding to port %d",nHostPort);

    /* bind to a port */
    if(bind(hServerSocket,(struct sockaddr*)&Address,sizeof(Address))
                        == SOCKET_ERROR)
    {
        printf("\nCould not connect to host\n");
        return 0;
    }

    printf("\nMaking a listen queue of %d elements\n\n",LISTEN_SIZE);
    /* establish listen queue */
    if(listen(hServerSocket,LISTEN_SIZE) == SOCKET_ERROR)
    {
        printf("\nCould not listen\n");
        return 0;
    }


   // setup receive threads
    pthread_t threads[MAX_THREADS];
    int rc1;
    for (int i=0; i<MAX_THREADS; i++)
    {
//		printf("\nCreating threads....%d\n", i);
        if( (rc1=pthread_create( &threads[i], NULL, HandleConnection, NULL)) )
        {
                printf("Thread creation failed: %d\n", rc1);
        }
    }


    while (1)
    {
        /* get the connected socket */
        hSocket=accept(hServerSocket,(struct sockaddr*)&Address,(socklen_t *)&nAddressSize);

        // add it to the queue
        connectionQ.enqueue(hSocket);

    }

    void *status;
    int rc;
    for (int j=0; j<MAX_THREADS; j++)
    {
        rc = pthread_join(threads[j], &status);
        if (rc) {
                printf("ERROR; return code from pthread_join() is %d\n", rc);
                exit(-1);
        }
        printf("Main: completed join with thread %d having a status of %ld\n",j,(long)status);

    }

	printf("\nClosing the socket\n\n");

    if(close(hServerSocket) == SOCKET_ERROR)
    {
     printf("\nCould not close socket\n");
     return -1;
    }
    pthread_exit(NULL);

    return (EXIT_SUCCESS);
}

