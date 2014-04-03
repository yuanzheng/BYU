#!/usr/bin/env python

import sys, time
import funcs
from daemon import Daemon

class MyDaemon(Daemon):
    def run(self):
        while True:
            msg = funcs.readImageResult()
            # print "check"
            # funcs.log("after ImageResult")
            if len(msg) != 0:
                funcs.update_simpleDB(msg)
                # print "it works"
                # funcs.log("test log1")
                funcs.ApprovalProcess(msg)
                # funcs.log("test log2")

            time.sleep(10)



if __name__ == "__main__":
	daemon = MyDaemon('/tmp/processresult_daemon.pid')
	if len(sys.argv) == 2:
		if 'start' == sys.argv[1]:
			daemon.start()
		elif 'stop' == sys.argv[1]:
			daemon.stop()
		elif 'restart' == sys.argv[1]:
			daemon.restart()
		else:
			print "Unknown command"
			sys.exit(2)
		sys.exit(0)
	else:
		print "usage: %s start|stop|restart" % sys.argv[0]
		sys.exit(2)
