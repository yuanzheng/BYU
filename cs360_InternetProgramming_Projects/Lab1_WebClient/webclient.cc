#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <string.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <arpa/inet.h>
#include <iostream>
#include <errno.h>
#include <vector> 
using namespace std;

#define SOCKET_ERROR        -1
#define BUFFER_SIZE         100
#define HOST_NAME_SIZE      255
#define MAX_MSG_SZ      1024


void send_message(int socket, const char* obj, int flags)
{
	string uri = string(obj);
	string request_msg = string("GET") + " " + uri + " " + "HTTP/1.0" + "\r\n\r\n";

	
	int nsent;
	char* msg = &request_msg[0];
	int nleft = request_msg.length();
	while (nleft)
	{
		if ((nsent = send(socket, msg, nleft, 0))<0)
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

	//cout<<"request has been sent!"<<endl<<endl;
	if (flags == 1)
		cout<<request_msg<<endl;

}



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
            exit(2);
        }
        //fprintf(stderr,"%d[%c]", messagesize,message[messagesize-1]);
        if (tline[messagesize - 1] == '\n')                                //I don't think it's a good idea, what if unlucky, just get the first line "GET....HTTP/1.1/r/n", it will lost the rest header file!!!
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
char *FormatHeader(char *str, char *prefix, int flags)
{
    char *result = (char *)malloc(strlen(str) + strlen(prefix));
    char* value = strchr(str,':') + 2;
    UpcaseAndReplaceDashWithUnderline(str);
    *(strchr(str,':')) = '\0';

	if (flags == 1)
    	sprintf(result, "%s%s=%s", prefix, str, value);
    return result;
}


// Get the header lines from a socket
//   envformat = true when getting a request from a web client
//   envformat = false when getting lines from a CGI program

void GetHeaderLines(vector<char *> &headerLines, int skt, bool envformat, int flags)
{
    // Read the headers, look for specific ones that may change our responseCode
    char *line;
    char *tline;
    
    tline = GetLine(skt);
    while(strlen(tline) != 0)
    {
        if (strstr(tline, "Content-Length") || 
            strstr(tline, "Content-Type"))
        {
            if (envformat)
                line = FormatHeader(tline, "", flags);
            else
                line = strdup(tline);
        }
        else
        {
            if (envformat)
                line = FormatHeader(tline, "HTTP_", flags);
            else
            {
                line = (char *)malloc((strlen(tline) + 10) * sizeof(char));
                sprintf(line, "HTTP_%s", tline);                
            }
        }
        //fprintf(stderr, "Header --> [%s]\n", line);
        
        headerLines.push_back(line);
        free(tline);
        tline = GetLine(skt);
    }
    free(tline);
}

void recv_response(int socket, int flags) {

	vector<char *> headerLines;
  	char buffer[MAX_MSG_SZ+1];
  	char contentType[MAX_MSG_SZ];
	int content_length = 0;
	int fd;

	// First read the status line
    char *startline = GetLine(socket);

	if (flags == 1)
		printf("Status line %s\n\n",startline);

	// Read the header lines
	GetHeaderLines(headerLines, socket , false, flags);


	// Now print them out
	for (int i = 0; i < headerLines.size(); i++) {
		if (flags == 1)
			printf("[%d] %s\n",i,headerLines[i]);
/*
		if(strstr(headerLines[i], "Content-Type")) {
				 sscanf(headerLines[i], "Content-Type: %s", contentType);
		}
*/
		if(strstr(headerLines[i], "Content-Length")) {
			sscanf(headerLines[i], "Content-Length: %d", &content_length);

		}
	}
	cout<<"let's check the length "<<content_length<<endl;

	// Now read and print the rest of the file
	int rval;
	if (content_length == 0) {
		
		while((rval = recv(socket,buffer,MAX_MSG_SZ, 0)) > 0) {

			if (rval < MAX_MSG_SZ)
				buffer[rval] = '\0';
			else
				buffer[MAX_MSG_SZ] = '\0';

			cout<<buffer;
		}
	}
	else{
		while (content_length != 0) {
		
			if ((rval = recv(socket,buffer,MAX_MSG_SZ, 0)) > 0)
			{
				if (rval < MAX_MSG_SZ)
					buffer[rval] = '\0';
				else
					buffer[MAX_MSG_SZ] = '\0';

				cout<<buffer;
				
				content_length -= rval;
			}
			else
				perror("The socket is closed!\n");

		}
	}

	cout<<endl<<endl;
}

int  main(int argc, char* argv[])
{
    int hSocket;                 /* handle to socket */
    struct hostent* pHostInfo;   /* holds info about a machine */
    struct sockaddr_in Address;  /* Internet socket address stuct */
    long nHostAddress;
    char pBuffer[BUFFER_SIZE];
    unsigned nReadAmount;
    char strHostName[HOST_NAME_SIZE];
    int nHostPort;
	int opt;

	int flags = 0;

	while ( ( opt = getopt(argc, argv, "d:")) != -1) {
		switch(opt) {
			case 'd':
				flags = 1;
				break;
			default: 
				isprint (optopt);
				fprintf (stderr, "Unknown option `-%c'.\n", optopt);
				exit(EXIT_FAILURE);
		}
	}


	if (flags == 0) 
	{
		if (argc < 4){
		    fprintf (stderr,"\nUsage: %s host-name host-port /object-page\n", argv[0]);
		    exit(EXIT_FAILURE);
		}
		else
		{
		    strcpy(strHostName,argv[1]);
			
			char* ch = new char[strlen(argv[2]) + 1];
			strcpy(ch,argv[2]);

			for(int i=0; i<strlen(ch); i++)
			{
				if (!isdigit(ch[i]))
				{
					fprintf (stderr, "The port `-%s' is not a legal number.\n", argv[2]);
					exit(EXIT_FAILURE);
				}
			}

			delete[] ch;
			nHostPort=atoi(argv[2]);
	
		}
	
    }
    else if(flags == 1)
    {
		if (argc < 5){
		    fprintf (stderr,"\nUsage: %s -d host-name host-port /object-page\n", argv[0]);
		    exit(EXIT_FAILURE);
		}
		else
		{
		    strcpy(strHostName,argv[2]);
			

			char* ch = new char[strlen(argv[3]) + 1];
			strcpy(ch,argv[3]);

			for(int i=0; i<strlen(ch); i++)
			{
				if (!isdigit(ch[i]))
				{
					fprintf (stderr, "The port `-%s' is not a legal number.\n", argv[3]);
					exit(EXIT_FAILURE);
				}
			}
			delete[] ch;
			nHostPort=atoi(argv[3]);
		}
    }
    

	if ((flags == 0 && argv[3][0] != '/') || (flags == 1 && argv[4][0] !='/')) {
        fprintf (stderr,"The request Object is in a wrong format! eg.%s\n","/index.html");
        exit(EXIT_FAILURE);
    }


    /* get IP address from name */
    pHostInfo=gethostbyname(strHostName);
	
	if (pHostInfo == NULL) {
		perror("The host-name cannot be found, please check the format!\n");
		exit(EXIT_FAILURE);
	}
/*
	const char *ip_address;
	int i = 0;
    while (pHostInfo->h_addr_list[i] != NULL) {
        cout << "\t" << inet_ntoa(*(struct in_addr *)pHostInfo->h_addr_list[i]) << endl;

		break;
		ip_address = inet_ntoa(*(struct in_addr *)pHostInfo->h_addr_list[i]);   //192.23.89.0
        i++;
    }
*/	
	
	//inet_aton(pHostInfo->h_addr_list[0], &Address.sin_addr);
	//cout<<"s_addr: "<<Address.sin_addr.s_addr<<endl;
    /* copy address into long */
    memcpy(&nHostAddress,pHostInfo->h_addr,pHostInfo->h_length);

    /* fill address struct */
    Address.sin_addr.s_addr=nHostAddress;
    Address.sin_port=htons(nHostPort);
    Address.sin_family=AF_INET;

	
	//cout<<"s_addr: "<<Address.sin_addr.s_addr<<endl;
	
    //printf("\nConnecting to %s on port %d",strHostName,nHostPort);


	//printf("\nMaking a socket");
    /* make a socket */
    hSocket=socket(AF_INET,SOCK_STREAM,IPPROTO_TCP);

    if(hSocket == SOCKET_ERROR)
    {
        perror("\nCould not make a socket\n");
        exit(EXIT_FAILURE);
    }

    /* connect to host */

    if(connect(hSocket,(struct sockaddr*)&Address,sizeof(Address)) == SOCKET_ERROR)
    {
        perror("\nCould not connect to host, check the port nnumber!\n");
        exit(EXIT_FAILURE);
    }
	
	if (flags == 0)
		send_message(hSocket, argv[3], flags);
	else
		send_message(hSocket, argv[4], flags);
	recv_response(hSocket, flags);

	close(hSocket);
	cout<<"close socket!"<<endl;

	return 0;
}

