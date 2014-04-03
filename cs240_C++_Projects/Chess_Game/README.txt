
Chess Game

Author: Lucas SongYz

It is a project of CS240 in Summer 2010.

Execution Environment: Linux

Back-end Functional Specification

You will be required to ensure the following:
•	Turns: The two players playing your game of chess must alternate turns. White always goes first. The current player's turn must be displayed. 
•	Enforce Valid Moves: Only valid chess moves, as defined in the overview, may be made. This is includes the rules about moving in and out of check, and stopping the game when checkmate or stalemate have been reached. Optional: You are not required to, but may if you wish, implement the special moves of En Passant, Castling, and Pawn Promotion. If you do, you must still fulfill all of the other requirements specified.
•	Move History: Each time a piece moves, you need to add the move to the history of the game. Any move may be undone to restore the position of the board before the move took place. Thus, it would be possible to repeatedly select Undo until the chess board is reset to its original position. When a game is loaded from a file, the previous history must be cleared. Using the undo option must maintain proper turn order enforcement.
•	Checkmate and Stalemate: Detect when checkmate or stalemate has occurred, in which case your program should display an appropriate message and not allow further moves to be taken. However, even when checkmate or stalemate is reached, the undo function should still work.
•	New Game: The user may request a "new game", in which case the current game should be discarded and the program re-initialized to its original state. 
•	Load Game, Save Game, and Save As
The user may also save the current game and load a previous game. The user will provide the filename to be loaded or saved to thorough a file selection dialog (provided by the user inteface) If a game is being loaded, the current game will be discarded in favour of the new game. 
Saving and loading games must follow the following guidelines:
•	Both the current board position and the history of the game need to be saved and loaded 
•	If a non-existing filename is provided or an error occurs while loading or saving your program must not crash. You may choose how you wish to respond to such cases, but it must allow for continued gameplay. 
•	You must use the provided XML file format. Details of the XML file format can be found here 
•	Save and Save As should follow the standard behavior, i.e. Save As should always present a file selection dialog while Save should use the previously loaded or saved file unless none is selected, in which case it will behave the same as Save As. Information on using the file selection dialogs is found on the "Using the Provided User Inteface" page 
•	Optional Items: 
•	If desired, you may track if the current game has been saved 'up to date' and present the option to save the game when the user requests to load a different game, start a new game or to exit the game (much like text editors). 
•	If you have implemented the optional moves you must still be able to load a file generated from a version of cs240 chess that has not, but the reverse is not required 


The XML File Format
•	XML File Format Specification
Make sure to read the format carefully, as well as to do your own research into the general rules of XML. 
NOTE: We will only test you on valid XML, but you must allow for poorly formatted XML.

The User Interface

Integrating Your Code
The user interface for the chess game has already been written for you. The source code and details of how to integrate your code with the provided user interface code are provided through the link below. 
•	Using the Provided User Interface
You will be required to finish implementing the provided "Chess" class. Details on how to use the Chess class in your design are in the Design Requirements section.

User Interface Functional Specifications

You are required to implement the following features of the user interface: 
•	When a piece is selected, the position where it is located and the positions of all legal moves for that piece must be highlighted. 
•	Only the pieces of the person whose turn it is may be selected. 
•	While a piece is previously selected: 
•	If a square highlighted as a valid move is selected, the piece is moved and the turn is switched. 
•	If the piece itself or any other square is selected, the highlighted squares and selection must be cleared. 
•	If any other action is taken (Save, Load, Undo, etc.), the highlighted square and selection must be cleared. 
•	NOTE: It is permissible that if another movable piece is selected, the highlighted squares are cleared and the new squares highlighted with only one click. 
•	NOTE: It is NOT permissible to highlight a square and then tell a user that the selected move is invalid (such as in the case of a move placing or leaving the current player's king in check). No invalid moves should be presented for selection. 
•	Drag-and-Drop (Optional) Most of the Drag-and-Drop functionality is included in the provided code. It's behavior is very similar to that of selecting a piece (keep that in mind when implementing the Chess class). When a drag is started, the appropriate squares should be highlighted (none if it's an illegal piece or has no moves), and when a drag is terminated the piece should either be moved or the squares unhighligted, the same as normal selection of a piece. If a piece is already selected when a drag is initiated, then the old highlighted squares should be cleared first. 
•	Actions: The menu and toolbar contain certain actions that may be selected by the user. The menu, toolbar, and accelerators (keyboard shortcuts) all activate the corresponding function found in the Chess class. The behavior of each is found in the Functional Specifications and details on integrating your code with the User Interface may be found on the page Using the Provided User Interface. Notes on what needs to be implemented in the Chess class are included in the source file. 
•	Labels, Messages and Status Bar: The GUI provides two areas for displaying small text messages, a larger text box, and a status bar. The status bar should be used to display the current loaded or last saved file, if any, and the label areas should be used for displaying whose turn it is and whether a player is in check, checkmate, or stalemate. Using these areas is defined in Using the Provided Graphical User Interface 
NOTE: There are a number of actions in the menus that are already implemented by the provided code. You only have to implement the functions found in the Chess class.


Chess Artificial Intelligence

A characteristic of the growing gaming industry today is the option for players to play in a single-player mode where they try to beat a computer opponent, rather than another human player. This provides several advantages, not the least of which is that you no longer have to have a friend at the same computer as you to practice your chess playing abilities. In this project, you will be implementing a simple chess artificial intelligence so that you can have one of four required modes: Human vs. Human, Human vs. Computer, Computer vs. Human, and Computer vs. Computer, where the first type of player is the white team and the second type of player is the black team. To select which mode to run the program is in, use the run makefile commands as explained below in the makefile section.
There is no requirement for how advanced your AI must be. We only require that your AI can follow all of the rules of the chess game. If you are interested in developing a good chess AI, there are numerous resources online. One place that we found as we were preparing our own chess AI was a six part article at www.gamedev.net.
One thing to keep in mind is the difference between a computer player and a human player as far as their input into the program is concerned. A human player interacts with the chess program by clicking (at least with a graphical user interface). A computer player probably will not likely produce its own clicks, and so you will have to think of a way to have the computer communicate to the Chess GUI and your chess data storage objects when it wants to select a piece and make a move. Provided in the Chess object and in the ChessView interface is a on_TimerEvent method that will be called every given amount of time. The given amount of time can be set with the SetTimeoutMilliseconds method. If you want your program to animate the computer player's moves such as selecting and moving, these methods could be very helpful.

Designing Your Program

When designing and implementing your chess program you must use the design patterns and techniques described below. Your design document and your code will be evaluated to ensure their inclusion. 

Layers Design Pattern

Layers is a design pattern where different classes of an application are organized into groups so that each group is at a particular level of abstraction. This allows a better organization of classes, reduced dependencies, and looser coupling. Most importantly it helps you keep track of what you're doing so that as the project becomes larger you can understand what is happening.
There are two main types of layering; strict and loose. In strict layering you may only call classes of the same abstraction level or one level lower. In loose layering, you may call classes in the same level, or any lower abstraction. In neither should a class in a lower level call or use a class in a higher level.
You are REQUIRED to use the layers design pattern (either strict or loose) in your code.
The facade design pattern is a tool for simplifying the interface to a complex class or set of classes. The facade class invokes the functionality of the library of set of classes. In terms of layers, a facade acts as a boundary between two abstraction layers, reducing the coupling between layers even more, and also allowing for easier to read and modify code.
You are STRONGLY ENCOURAGED to follow the facade pattern in designing and implementing the logical functionality of a chess game. If you decide not to use the facade pattern, you should discuss your decision with the professor or a TA and make sure it is approved.
This chess program will help you practice the use of the Layers design pattern because we have already separated the GUI from the code that you will be implementing. This is very useful because you will find that if you wanted to use a different type of UI, such as a text-based UI or even a 3d based UI, all it would take would be implementing the new UI, and then making a one line change in your main method. That’s the power of layering.
The basic design that you will be working with is a GUI that is completely implemented and should not be modified by you, and a ChessController that is handed all of the events that the GUI receives. This way, all of your code will be in the ChessController implementation (not the interface) and the GUI can remain untouched. In main.cpp you will need to add your implementation of the ChessController interface, and then connect the view and the controller objects by using the SetView and SetController methods on the two objects.

Polymorphism

You are required to use polymorphism (i.e., virtual functions) in your implementation of this program. Specifically, you must use polymorphism to distinguish between the different kinds of chess pieces. This will probably involve creating a base class (or interface) that defines virtual methods for all of the operations on a chess piece, and then creating subclasses of the base class for each type of piece. This will allow your program to easily deal with the differences between the pieces, and also make it easy to add new kinds of pieces. 

Unit Tests

You are required to write thorough, automated unit test cases for the "GetMoves" methods (or the equivalent) on your King, Queen, Rook, Knight, Bishop, and Pawn classes. All six of your piece classes should each have a public method with the following signature
static bool Test(ostream & os); 
that will automatically test the class and verify that it works correctly. The Test method on a class should create one or more instances of the class, call methods on those objects, and automatically check that the results returned by the methods are correct. 
If all tests succeed, Test should return true. If one or more tests fail, Test should return false. For each test that fails, an informative error message that describes the test that failed should be written to the passed-in output stream. This will tell you which tests failed so that you can fix the problems.
You should also write a test driver program that runs all of your automated test cases. This program will be very simple, consisting only of a main function that calls all of your Test methods. Whenever you change your piece classes, you can recompile and run your test program to verify that the modified code works correctly.
Of course, you are free to write unit tests for as many classes as you like, but this is not required. We just want you to get hands on experience writing some unit tests so you will better internalize the concept of unit testing.
The CS240 Utilities Module Unit Test contains code that is a useful example of creating unit tests. For more complex examples of unit tests, you can look at the CS 240 Utils unit tests provided with the utils.

Standard Template Library (STL)

You may use the STL for this project. It is not required, but learning its use is a valuable exercise, and it may simplify some of your design. 

Design Documentation

The first step in developing a larger program like Chess is to spend some time understanding the problem that is to be solved. Once you understand the problem, start to design the classes that you will need by visualizing the operation of the program in your mind, and creating classes that perform each of the functions required by the program. For each class that you create, you should document what responsibilities the class has, and how it interacts with other classes to perform its responsibilities. This exercise will help you figure out what classes you need to write, and how those classes work together to produce a working program. Doing this type of design work before you start coding will save you time because it will help you avoid spending effort on dead-end ideas that don't work.
Once you've thought through your design the best that you can without writing any code, you should make a first attempt at implementing your design. As your implementation progresses, you will probably find that your design was incomplete or faulty in some respects. This is to be expected because some insights only come from actually implementing a design. As you proceed, make necessary changes to your design, and incorporate them into your code.
To encourage you to follow this type of design process, about a third of the way through the project you will be asked to document and turn in your Chess design. Your design document must include three things:
1.	A DETAILED description of the data structures that you will use to store the program's data. Describe in detail what data needs to be stored, and how you intend to store it (e.g., binary trees, hash tables, queues, arrays, linked-lists, etc.). Also explain why you chose the data structures that you did. 
2.	For each class in your design, document the following: 
•	The name and purpose of the class 
•	The name and purpose of each data member 
•	The name and purpose of each method. For each method, document each of its parameters and its return value. 
The easiest way to document this information is to create a commented header file (.h file) for each of your classes using the style described in the Code Evaluation section. Since you will have to create commented header files anyway, using this format for your design document will help you get a head start on your code.
3.	A DETAILED description of the top-level algorithms that implement each of the use cases below: 
•	New Game 
•	Move Piece 
•	Undo Move 
•	Save Game 
•	Load Game 
The best way to document these algorithms is to actually write the code or psuedocode for them in terms of the specific classes and methods in your design. This will help you see how your classes will work together at runtime to accomplish each task. The description should be specific and include solutions to algorithmic problems inherent in the project.
Submit a hard-copy printout of your design document at the TA's office before midnight on the due date (remember that the building's doors are locked at 11). Please make sure that your name is clearly visible on the front of your design document. Design documents may not be submitted by email. 
NOTE: A good way to create a good, easy to read (and easy to grade) design document is to use the grading sheet as an outline.

5

