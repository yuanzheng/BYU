
CR = utils/obj/CommandRunner.o
FIS = utils/obj/FileInputStream.o
FS = utils/obj/FileSystem.o
HT = utils/obj/HTMLToken.o
HTZ = utils/obj/HTMLTokenizer.o
HIS = utils/obj/HTTPInputStream.o
SU = utils/obj/StringUtil.o
UIS = utils/obj/URLInputStream.o
CS240LIB = lib/libcs240utils.a
WC = obj/WebCrawler.o
WL = obj/WordList.o
WI = obj/WordIndex.o
SW = obj/StopWord.o
UQ = obj/URLLinkQueue.o
PR = obj/PageReader.o
SRC = obj/crawler.o
URL = obj/URL.o
UF = obj/URLFilter.o
P = obj/Page.o
UH = obj/URLHistory.o
UHT = obj/URLHistoryTree.o
ML = obj/MapList.o
PM = obj/PageMap.o
XML = obj/Xml.o
T = obj/test.o
EXE = bin/crawler
EXE_T = bin/test
EXE_P = bin/printer
TP = obj/printer.o

bin: $(EXE)
lib: $(CS240LIB)
testbin: $(EXE_T) 
testprinter: $(EXE_P)
# compile the test.cpp and run it
test: testbin
	$(EXE_T)
testp: testprinter

#	$(EXE_P)


$(EXE_P): $(TP) $(CS240LIB)
	g++ -o $(EXE_P) $(TP) $(CS240LIB)

$(TP): test/printer.cpp utils/include/HTMLTokenizer.h utils/include/URLInputStream.h utils/include/CS240Exception.h
	g++ -c -o $(TP) -Wall -I utils/include/ test/printer.cpp

#**********************************************************************

$(EXE): $(CS240LIB) $(SRC) $(WC) $(WL) $(SW) $(UQ) $(PR) $(URL) $(UF) $(P) $(UH) $(UHT) $(WI) $(ML) $(PM) $(XML)  
	g++ -g -o $(EXE) $(SRC) $(WC) $(WL) $(SW) $(UQ) $(PR) $(URL) $(UF) $(P) $(UH) $(UHT) $(WI) $(ML) $(PM) $(XML) $(CS240LIB)
	
#chmod ugo+x $(EXE)

$(SRC): src/crawler.cpp inc/WebCrawler.h
	g++ -g -c -o $(SRC) -Wall -I inc/ -I utils/include/ src/crawler.cpp

$(CS240LIB): $(CR) $(FIS) $(FS) $(HT) $(HTZ) $(HIS) $(SU) $(UIS)
	ar r $(CS240LIB) utils/obj/*.o

$(EXE_T): $(T) $(URL) $(SW) $(UQ) $(UF) $(CS240LIB)
	g++ -g -o $(EXE_T) $(T) $(URL) $(SW) $(UQ) $(UF) $(CS240LIB)

#chmod ugo+x $(EXE_T)

$(T): test/test.cpp 
	g++ -g -c -o $(T) -Wall -I inc/ -I utils/include/ test/test.cpp

$(WC): src/WebCrawler.cpp inc/Page.h inc/URL.h inc/Xml.h inc/WordList.h inc/StopWord.h inc/URLHistoryTree.h inc/URLLinkQueue.h utils/include/HTMLTokenizer.h utils/include/URLInputStream.h utils/include/CS240Exception.h 
	g++ -g -c -o $(WC) -Wall -I inc/ -I utils/include/ src/WebCrawler.cpp

$(WL): src/WordList.cpp
	g++ -g -c -o $(WL) -Wall -I inc/ -I utils/include/ src/WordList.cpp
#inc/WordList.h

$(SW): src/StopWord.cpp utils/include/CS240Exception.h
	g++ -c -o $(SW) -Wall -I inc/ -I utils/include/ src/StopWord.cpp

$(UQ): src/URLLinkQueue.cpp 
	g++ -g -c -o $(UQ) -Wall -I inc/ -I utils/include/ src/URLLinkQueue.cpp
#inc/URLLinkQueue.h

$(URL): src/URL.cpp
	g++ -c -o $(URL) -Wall -I inc/ -I utils/include/ src/URL.cpp

$(UF): src/URLFilter.cpp
	g++ -g -c -o $(UF) -Wall -I inc/ -I utils/include/ src/URLFilter.cpp

$(XML): src/Xml.cpp
	g++ -g -c -o $(XML) -Wall -I inc/ -I utils/include/ src/Xml.cpp

$(PR): src/PageReader.cpp inc/Page.h inc/URL.h inc/WordList.h inc/StopWord.h inc/URLHistoryTree.h inc/URLLinkQueue.h utils/include/HTMLTokenizer.h utils/include/URLInputStream.h utils/include/CS240Exception.h
	g++ -g -c -o $(PR) -Wall -I inc/ -I utils/include/ src/PageReader.cpp

$(P): src/Page.cpp
	g++ -g -c -o $(P) -Wall -I inc/ -I utils/include/ src/Page.cpp

$(UH): src/URLHistory.cpp
	g++ -g -c -o $(UH) -Wall -I inc/ -I utils/include/ src/URLHistory.cpp

$(UHT): src/URLHistoryTree.cpp
	g++ -g -c -o $(UHT) -Wall -I inc/ -I utils/include/ src/URLHistoryTree.cpp

$(WI): src/WordIndex.cpp
	g++ -g -c -o $(WI) -Wall -I inc/ -I utils/include/ src/WordIndex.cpp

$(ML): src/MapList.cpp
	g++ -g -c -o $(ML) -Wall -I inc/ -I utils/include/ src/MapList.cpp

$(PM): src/PageMap.cpp
	g++ -g -c -o $(PM) -Wall -I inc/ -I utils/include/ src/PageMap.cpp
 
$(CR): utils/src/CommandRunner.cpp utils/include/CommandRunner.h utils/include/CS240Exception.h utils/include/StringUtil.h
	g++ -g -c -o $(CR) -Wall -I utils/include/ utils/src/CommandRunner.cpp

$(FIS): utils/src/FileInputStream.cpp utils/include/FileInputStream.h utils/include/CS240Exception.h
	g++ -g -c -o $(FIS) -Wall -I utils/include/ utils/src/FileInputStream.cpp

$(FS):utils/src/FileSystem.cpp utils/include/FileSystem.h utils/include/CS240Exception.h utils/include/UnitTest.h
	g++ -g -c -o $(FS) -Wall -I utils/include/ utils/src/FileSystem.cpp

$(HT): utils/src/HTMLToken.cpp utils/include/HTMLToken.h
	g++ -g -c -o $(HT) -Wall -I utils/include/ utils/src/HTMLToken.cpp

$(HTZ): utils/src/HTMLTokenizer.cpp utils/include/HTMLTokenizer.h
	g++ -g -c -o $(HTZ) -Wall -I utils/include/ utils/src/HTMLTokenizer.cpp

$(HIS): utils/src/HTTPInputStream.cpp utils/include/HTTPInputStream.h utils/include/StringUtil.h utils/include/CS240Exception.h
	g++ -g -c -o $(HIS) -Wall -I utils/include/ utils/src/HTTPInputStream.cpp

$(SU): utils/src/StringUtil.cpp utils/include/StringUtil.h
	g++ -g -c -o $(SU) -Wall -I utils/include/ utils/src/StringUtil.cpp

$(UIS): utils/src/URLInputStream.cpp utils/include/StringUtil.h utils/include/CS240Exception.h utils/include/HTTPInputStream.h utils/include/FileInputStream.h utils/include/URLInputStream.h utils/include/InputStream.h
	g++ -g -c -o $(UIS) -Wall -I utils/include/ utils/src/URLInputStream.cpp

clean:
	@- rm -f bin/*
	@- rm -f obj/*.o
	@- rm -f utils/obj/*.o
	@- rm -f lib/*.a



