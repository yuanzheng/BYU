#!/usr/bin/env python

import sys, time
import funcs
from daemon import Daemon

class MyDaemon(Daemon):
    def run(self):
        while True:
            msg = funcs.readImageProcessQueue()
            # print "check"
            # funcs.log("after ImageProcess")
            if len(msg) != 0:
                size = funcs.processImage(msg)
                funcs.imageResultQueue(msg, size)
                
                funcs.update_S3(msg)
                # print "it works"

            time.sleep(1)



if __name__ == "__main__":
	daemon = MyDaemon('/tmp/imageProcessing_daemon.pid')
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
