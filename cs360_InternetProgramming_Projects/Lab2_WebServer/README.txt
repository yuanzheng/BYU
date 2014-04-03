gdb server    // using gdb run server program
(gdb) r 8080    // run server with port number 8080
                //'Ctrl-Z' do not stop server or gdb, it just send a signal to return program to run at backgroud!
				// using the 'fg' to get program back to front!
				// However, 'Ctrl-c' will interrupt the program totally.

(gdb) bt        // trace the system calls, so we can see what problem stops the program!!



(gdb) q         //quit the gdb

//because we are runing server under the gdb, so use the
//g++ -o server server -lpthread -g to compile it (-g)!!!
