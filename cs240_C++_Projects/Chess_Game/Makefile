# -----------------------------------------------------------------------------
# Generic Variables
# -----------------------------------------------------------------------------
CC = g++
GTKMM = gtkmm-2.4
SIGC = sigc++-2.0
LIBGLADE = libglademm-2.4

FLAGS = -I$(INC_FOLDER) -I$(VIEW_INC_FOLDER) -I$(MODEL_INC_FOLDER) -Wall -g -fPIC

MODEL_FLAGS = -I$(MODEL_INC_FOLDER) -I utils/include -Wall -g -fPIC

#CFLAGS are the -I values needed to compile files using the GTKMM, SIGC, and
#LIBGLADE libraries
CFLAGS = `pkg-config $(GTKMM) $(SIGC) $(LIBGLADE) --cflags`  -I$(IMAGES_FOLDER)

#LIBS are the paths to the static libraries for GTKMM, SIGC, and LIBGLADE needed
#for linking
LIBS = `pkg-config $(GTKMM) $(SIGC) $(LIBGLADE) --libs`

#LIB_FLAGS D_LOG_DOMAIN is used by g_log in the ChessGui library to seperate logging messages from the library
# from logging messages from the students code
#IMPORTANT: You must add a compiler option here for the library to be dynamic
LIB_FLAGS = -DG_LOG_DOMAIN=\"ChessGui\" -fPIC

# -----------------------------------------------------------------------------
# Folder Variables
# -----------------------------------------------------------------------------
VIEW_FOLDER = view
VIEW_INC_FOLDER = $(VIEW_FOLDER)/inc
VIEW_SRC_FOLDER = $(VIEW_FOLDER)/src
VIEW_OBJ_FOLDER = $(VIEW_FOLDER)/obj
IMAGES_FOLDER = $(VIEW_FOLDER)/images

CONTROLLER_FOLDER = controller
SRC_FOLDER = $(CONTROLLER_FOLDER)/src
INC_FOLDER = $(CONTROLLER_FOLDER)/inc
OBJ_FOLDER = $(CONTROLLER_FOLDER)/obj

# ----------------------------------------------------------------------------
# More Folder Variables            By Yuanzheng Song
# ----------------------------------------------------------------------------
MODEL_FOLDER = model
MODEL_SRC_FOLDER = $(MODEL_FOLDER)/src
MODEL_INC_FOLDER = $(MODEL_FOLDER)/inc
MODEL_OBJ_FOLDER = $(MODEL_FOLDER)/obj

XML_PARSER_FOLDER = lib
PARSER_OBJ_FOLDER = utils/obj

BIN_FOLDER = bin

# -----------------------------------------------------------------------------
# File Name Variables
# -----------------------------------------------------------------------------
#change this to a dynamic library name
LIBRARY= $(VIEW_FOLDER)/libcs240.so
EXE_NAME = $(BIN_FOLDER)/chess

TEST_EXE = $(BIN_FOLDER)/test

LIB_OBJ_FILES = $(VIEW_OBJ_FOLDER)/Chess.o $(VIEW_OBJ_FOLDER)/ChessGui.o \
		$(VIEW_OBJ_FOLDER)/ChessGuiBoard.o $(VIEW_OBJ_FOLDER)/ChessGuiBoardCell.o \
		$(VIEW_OBJ_FOLDER)/ChessGuiImages.o $(VIEW_OBJ_FOLDER)/SelectDialog.o
		
EXE_OBJ_FILES = $(OBJ_FOLDER)/main.o $(OBJ_FOLDER)/GameController.o \
		$(OBJ_FOLDER)/HumanPlayer.o $(OBJ_FOLDER)/ComputerPlayer.o \
		$(MODEL_OBJ_FOLDER)/ChessBoard.o $(MODEL_OBJ_FOLDER)/GameFacade.o \
		$(MODEL_OBJ_FOLDER)/Piece.o $(MODEL_OBJ_FOLDER)/King.o \
		$(MODEL_OBJ_FOLDER)/Queen.o $(MODEL_OBJ_FOLDER)/Knight.o \
		$(MODEL_OBJ_FOLDER)/Bishop.o $(MODEL_OBJ_FOLDER)/Rook.o \
		$(MODEL_OBJ_FOLDER)/Pawn.o $(MODEL_OBJ_FOLDER)/BoardPosition.o \
		$(MODEL_OBJ_FOLDER)/PieceHistory.o $(MODEL_OBJ_FOLDER)/Xml.o 
		
TEST_OBJ_FILES = obj/test.o \
		$(MODEL_OBJ_FOLDER)/ChessBoard.o $(MODEL_OBJ_FOLDER)/GameFacade.o \
		$(MODEL_OBJ_FOLDER)/Piece.o $(MODEL_OBJ_FOLDER)/King.o \
		$(MODEL_OBJ_FOLDER)/Queen.o $(MODEL_OBJ_FOLDER)/Knight.o \
		$(MODEL_OBJ_FOLDER)/Bishop.o $(MODEL_OBJ_FOLDER)/Rook.o \
		$(MODEL_OBJ_FOLDER)/Pawn.o $(MODEL_OBJ_FOLDER)/BoardPosition.o \
		$(MODEL_OBJ_FOLDER)/PieceHistory.o $(MODEL_OBJ_FOLDER)/Xml.o 

# -----------------------------------------------------------------------------
# Add additional library   by yuanzheng song
# -----------------------------------------------------------------------------
CS240LIB = $(XML_PARSER_FOLDER)/libcs240utils.so

CR = $(PARSER_OBJ_FOLDER)/CommandRunner.o
FIS = $(PARSER_OBJ_FOLDER)/FileInputStream.o
FS = $(PARSER_OBJ_FOLDER)/FileSystem.o
HT = $(PARSER_OBJ_FOLDER)/HTMLToken.o
HTZ = $(PARSER_OBJ_FOLDER)/HTMLTokenizer.o
HIS = $(PARSER_OBJ_FOLDER)/HTTPInputStream.o
SU = $(PARSER_OBJ_FOLDER)/StringUtil.o
UIS = $(PARSER_OBJ_FOLDER)/URLInputStream.o

CS240LIB_OBJ_FILES = $(CR) $(FIS) $(FS) $(HT) $(HTZ) $(HIS) $(SU) $(UIS)


# -----------------------------------------------------------------------------
# Command Variables
# -----------------------------------------------------------------------------
bin : $(EXE_NAME)

run : $(EXE_NAME)
	./$(EXE_NAME)
	
test : $(TEST_EXE)
	 ./$(TEST_EXE)

runhh : $(EXE_NAME)
	./$(EXE_NAME) 1
	
runhc : $(EXE_NAME)
	./$(EXE_NAME) 2
	
runch : $(EXE_NAME)
	./$(EXE_NAME) 3
	
runcc : $(EXE_NAME)
	./$(EXE_NAME) 4
	
memtest: $(EXE_NAME)
	valgrind --tool=memcheck --leak-check=yes --show-reachable=yes --suppressions=chess.supp $(EXE_NAME)
	
debug : $(EXE_NAME)
	gdb $(EXE_NAME)
	
lib : $(LIBRARY) $(CS240LIB)

clean: 
	-rm -f $(EXE_NAME)
	-rm -f $(TEST_EXE)
	-rm -f obj/test.o
	-rm -f $(EXE_OBJ_FILES)
	-rm -f $(CS240LIB_OBJ_FILES)
	-rm -f $(SRC_FOLDER)/*~ $(INC_FOLDER)/*~
	-rm -f $(LIBRARY) $(LIB_OBJ_FILES)
	-rm -f $(CS240LIB) $(CS240LIB_OBJ_FILES)
	-rm -f $(VIEW_SRC_FOLDER)/*~ $(VIEW_INC_FOLDER)/*~


# File Construction
# -----------------------------------------------------------------------------
$(EXE_NAME): $(EXE_OBJ_FILES)  $(LIBRARY) $(CS240LIB)
	$(CC) $(FLAGS) $(CFLAGS) $(LIBS) -o $(EXE_NAME) $(EXE_OBJ_FILES) $(LIBRARY) $(CS240LIB)
	
$(OBJ_FOLDER)/main.o: $(SRC_FOLDER)/main.cpp
	$(CC) -c $(FLAGS) $(CFLAGS) -I utils/include/ -o $(OBJ_FOLDER)/main.o $(SRC_FOLDER)/main.cpp
	
	
# Students: Place your makefile commands here
$(TEST_EXE): $(TEST_OBJ_FILES) 
	$(CC) $(MODEL_FLAGS) -o $(TEST_EXE) $(TEST_OBJ_FILES)

obj/test.o: test/test.cpp
	$(CC) -c $(MODEL_FLAGS) -o obj/test.o test/test.cpp
	
$(OBJ_FOLDER)/GameController.o: $(SRC_FOLDER)/GameController.cpp
	$(CC) -c $(FLAGS) $(CFLAGS) -I utils/include/ -o $(OBJ_FOLDER)/GameController.o $(SRC_FOLDER)/GameController.cpp


$(OBJ_FOLDER)/HumanPlayer.o: $(SRC_FOLDER)/HumanPlayer.cpp
	$(CC) -c $(FLAGS) -I utils/include/ -o $(OBJ_FOLDER)/HumanPlayer.o $(SRC_FOLDER)/HumanPlayer.cpp


$(OBJ_FOLDER)/ComputerPlayer.o: $(SRC_FOLDER)/ComputerPlayer.cpp
	$(CC) -c $(FLAGS) -I utils/include/ -o $(OBJ_FOLDER)/ComputerPlayer.o $(SRC_FOLDER)/ComputerPlayer.cpp


$(MODEL_OBJ_FOLDER)/ChessBoard.o: $(MODEL_SRC_FOLDER)/ChessBoard.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/ChessBoard.o $(MODEL_SRC_FOLDER)/ChessBoard.cpp


$(MODEL_OBJ_FOLDER)/GameFacade.o: $(MODEL_SRC_FOLDER)/GameFacade.cpp
	$(CC) -c $(MODEL_FLAGS) -I utils/include/ -o $(MODEL_OBJ_FOLDER)/GameFacade.o $(MODEL_SRC_FOLDER)/GameFacade.cpp

$(MODEL_OBJ_FOLDER)/PieceHistory.o: $(MODEL_SRC_FOLDER)/PieceHistory.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/PieceHistory.o $(MODEL_SRC_FOLDER)/PieceHistory.cpp

$(MODEL_OBJ_FOLDER)/BoardPosition.o: $(MODEL_SRC_FOLDER)/BoardPosition.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/BoardPosition.o $(MODEL_SRC_FOLDER)/BoardPosition.cpp

$(MODEL_OBJ_FOLDER)/Piece.o: $(MODEL_SRC_FOLDER)/Piece.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/Piece.o $(MODEL_SRC_FOLDER)/Piece.cpp

$(MODEL_OBJ_FOLDER)/King.o: $(MODEL_SRC_FOLDER)/King.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/King.o $(MODEL_SRC_FOLDER)/King.cpp

$(MODEL_OBJ_FOLDER)/Queen.o: $(MODEL_SRC_FOLDER)/Queen.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/Queen.o $(MODEL_SRC_FOLDER)/Queen.cpp

$(MODEL_OBJ_FOLDER)/Knight.o: $(MODEL_SRC_FOLDER)/Knight.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/Knight.o $(MODEL_SRC_FOLDER)/Knight.cpp

$(MODEL_OBJ_FOLDER)/Bishop.o: $(MODEL_SRC_FOLDER)/Bishop.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/Bishop.o $(MODEL_SRC_FOLDER)/Bishop.cpp

$(MODEL_OBJ_FOLDER)/Rook.o: $(MODEL_SRC_FOLDER)/Rook.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/Rook.o $(MODEL_SRC_FOLDER)/Rook.cpp

$(MODEL_OBJ_FOLDER)/Pawn.o: $(MODEL_SRC_FOLDER)/Pawn.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/Pawn.o $(MODEL_SRC_FOLDER)/Pawn.cpp

$(MODEL_OBJ_FOLDER)/Xml.o: $(MODEL_SRC_FOLDER)/Xml.cpp
	$(CC) -c $(MODEL_FLAGS) -o $(MODEL_OBJ_FOLDER)/Xml.o $(MODEL_SRC_FOLDER)/Xml.cpp


# Students: Place your makefile commands here
	

# -----------------------------------------------------------------------------
# Library Construction
# -----------------------------------------------------------------------------
#This is currently a STATIC library, you must change it to a DYNAMIC library
#You must also add a compiler option to the variable LIB_FLAGS in order for the library to be dynamic
$(LIBRARY): $(LIB_OBJ_FILES) 
	g++ -shared -o $(LIBRARY) $(LIB_OBJ_FILES)

$(CS240LIB): $(CS240LIB_OBJ_FILES)
	g++ -shared -o $(CS240LIB) $(CS240LIB_OBJ_FILES)
	
########DO NOT DELETE###########################################################################################3
#Below is some Makefile Magic to compile the libraries, you do not need to
#understand or alter it.  If you would like to, look up the Make manual online, it's very comprehensive	
LIBSOURCES = $(foreach file, $(shell ls $(VIEW_SRC_FOLDER)/*.cpp), $(basename $(notdir $(file))))

$(VIEW_OBJ_FOLDER)/%.o : $(VIEW_SRC_FOLDER)/%.cpp $(VIEW_INC_FOLDER)/Inline.h
	$(CC) $(FLAGS) $(LIB_FLAGS) $(CFLAGS) -c -o $@ $< 

  #The following is part of what lets us include Images within the binary. It currently only loads the default
  #"Image not found" icon that we use

INLINE_IMAGES = $(shell ls $(IMAGES_FOLDER)/* )
INLINE_IMAGE_PAIRS =$(foreach file, $(INLINE_IMAGES), $(basename $(notdir $(file)) $(file).* ))	
view/inc/Inline.h: $(INLINE_IMAGES)
	@echo "Updating Images"
	gdk-pixbuf-csource --raw --build-list $(INLINE_IMAGE_PAIRS) > $(VIEW_INC_FOLDER)/Inline.h

#################################### compile library ####################################################
$(CR): utils/src/CommandRunner.cpp utils/include/CommandRunner.h utils/include/CS240Exception.h utils/include/StringUtil.h
	g++ -g -c -o $(CR) -Wall -I utils/include/ utils/src/CommandRunner.cpp -fPIC

$(FIS): utils/src/FileInputStream.cpp utils/include/FileInputStream.h utils/include/CS240Exception.h
	g++ -g -c -o $(FIS) -Wall -I utils/include/ utils/src/FileInputStream.cpp -fPIC

$(FS):utils/src/FileSystem.cpp utils/include/FileSystem.h utils/include/CS240Exception.h utils/include/UnitTest.h
	g++ -g -c -o $(FS) -Wall -I utils/include/ utils/src/FileSystem.cpp -fPIC

$(HT): utils/src/HTMLToken.cpp utils/include/HTMLToken.h
	g++ -g -c -o $(HT) -Wall -I utils/include/ utils/src/HTMLToken.cpp -fPIC

$(HTZ): utils/src/HTMLTokenizer.cpp utils/include/HTMLTokenizer.h
	g++ -g -c -o $(HTZ) -Wall -I utils/include/ utils/src/HTMLTokenizer.cpp -fPIC

$(HIS): utils/src/HTTPInputStream.cpp utils/include/HTTPInputStream.h utils/include/StringUtil.h utils/include/CS240Exception.h
	g++ -g -c -o $(HIS) -Wall -I utils/include/ utils/src/HTTPInputStream.cpp -fPIC

$(SU): utils/src/StringUtil.cpp utils/include/StringUtil.h
	g++ -g -c -o $(SU) -Wall -I utils/include/ utils/src/StringUtil.cpp -fPIC

$(UIS): utils/src/URLInputStream.cpp utils/include/StringUtil.h utils/include/CS240Exception.h utils/include/HTTPInputStream.h utils/include/FileInputStream.h utils/include/URLInputStream.h utils/include/InputStream.h
	g++ -g -c -o $(UIS) -Wall -I utils/include/ utils/src/URLInputStream.cpp -fPIC
