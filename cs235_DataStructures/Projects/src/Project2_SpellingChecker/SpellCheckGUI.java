
package cs235.spell;

/** SpellCheckGUI v1.0 
*		by Brian Sanderson 6/22/2004
*   
*       editted to be compliant with checkstyle by John Broderick 5/7/2008
*
*	This GUI is intended to provide a graphical test harness for the Spelling Checker
*	project in CS 235. It is recommended to students that they complete the requirements
*	found in the project specification before running the GUI, then using the GUI as 
*	a means to test their implementation.
*/

import javax.swing.JPanel;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.JFileChooser;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JTextPane;
import javax.swing.JSplitPane;

import javax.swing.text.StyledDocument;
import javax.swing.text.Style;
import javax.swing.text.StyleContext;
import javax.swing.text.StyleConstants;
import javax.swing.text.BadLocationException;

import java.awt.GridBagLayout;              //for layout managers and more
import java.awt.Color;
import java.awt.GridBagConstraints;
import java.awt.Dimension;
import java.awt.BorderLayout;
import java.awt.event.ActionListener;        //for action events
import java.awt.event.ActionEvent;



import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.File;
import java.util.List;
import java.util.ArrayList;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.StringTokenizer;

public class SpellCheckGUI extends JPanel{
	
    private OptionsPanel options;
    
    private TextArea textPane;
    private SpellingChecker speller;
    private final int TEXT_AREA_WIDTH_MIN = 450;
    private final int TEXT_AREA_HEIGHT_MIN = 300;
    private final int GUI_SIZE = 500;


    public SpellCheckGUI() {
	setLayout(new BorderLayout());
	
	speller = CheckerFactory.createSpellingChecker();
	//Create an editor pane.
	textPane = new TextArea();
	textPane.setEditable(false);
	textPane.setMinimumSize(new Dimension(TEXT_AREA_WIDTH_MIN, TEXT_AREA_HEIGHT_MIN));
	//textPane.setLineWrap(false);	
	
	JScrollPane editorScrollPane = new JScrollPane(textPane);
	editorScrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);
	editorScrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
	editorScrollPane.setPreferredSize(new Dimension(TEXT_AREA_WIDTH_MIN, TEXT_AREA_HEIGHT_MIN));
	editorScrollPane.setMinimumSize(new Dimension(TEXT_AREA_WIDTH_MIN, TEXT_AREA_HEIGHT_MIN));
	options = new OptionsPanel();
	
	//Put the editor pane and the text pane in a split pane.
	JSplitPane splitPane = new JSplitPane(JSplitPane.VERTICAL_SPLIT,editorScrollPane,options);
	splitPane.setResizeWeight(1.0);
	
	//Put everything together.
	add(splitPane, BorderLayout.CENTER);
	setSize(GUI_SIZE, GUI_SIZE);		
    }
    

    public static void main(String[] args) {
	//Make sure we have nice window decorations.
	JFrame.setDefaultLookAndFeelDecorated(true);
	
	//Create and set up the window.
	JFrame frame = new JFrame("CS 235 Spelling Checker GUI");
	frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	
	//Create and set up the content pane.
	JComponent newContentPane = new SpellCheckGUI();
	newContentPane.setOpaque(true); //content panes must be opaque
	frame.setContentPane(newContentPane);
	
	//Display the window.
	frame.pack();
	frame.setVisible(true);
    }
    
    private class OptionsPanel extends JPanel {
	private JLabel labelDictionaries;
	private JLabel labelCurrentFile;
	private JButton buttonAddDictionary;
	private JButton buttonClearAll;
	private JButton buttonLoadFile;
	private JPanel dictionaryPane;
	private JPanel loadfilePane;
	private String loadedDict;
	private String currentFile;

	private final int DICT_LABEL_WIDTH = 100;
	private final int FILE_LABEL_WIDTH = 140;
	private final int LABEL_HEIGHT = 30;

	public OptionsPanel(){
	    loadedDict = "";				
		
	    setupDictionaryPane();

				
	    setupFilePane();
	    //Put the loadfile pane, dictionary pane in a split pane
	    JSplitPane bottomdivider;
	    bottomdivider = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT,dictionaryPane,loadfilePane);
	    add(bottomdivider);		
	    
	}

	private void setupDictionaryPane(){
	    //Create the dictionary pane.
	    
	    labelDictionaries = new JLabel("Dictionaries: none");
	    labelDictionaries.setMaximumSize(new Dimension(DICT_LABEL_WIDTH, LABEL_HEIGHT));
	    labelDictionaries.setMinimumSize(new Dimension(DICT_LABEL_WIDTH, LABEL_HEIGHT));
	    buttonAddDictionary = new JButton("Add Dictionary...");
	    buttonClearAll = new JButton("Clear All Dictionaries");
	    ActionListener listener = new ButtonListener();
	    buttonAddDictionary.addActionListener(listener);
	    buttonClearAll.addActionListener(listener);
	    dictionaryPane = new JPanel();
	    GridBagLayout gridbag = new GridBagLayout();
	    GridBagConstraints c = new GridBagConstraints();
	    dictionaryPane.setLayout(gridbag);
	    c.anchor = GridBagConstraints.EAST;
	    c.gridwidth = GridBagConstraints.RELATIVE; //next-to-last
	    c.fill = GridBagConstraints.NONE;      //reset to default
	    c.weightx = 0.0;                       //reset to default
	    dictionaryPane.add(buttonAddDictionary, c);
	    c.gridwidth = GridBagConstraints.REMAINDER;     //end row
	    c.fill = GridBagConstraints.HORIZONTAL;
	    c.weightx = 1.0;
	    dictionaryPane.add(buttonClearAll, c);
	    c.gridwidth = GridBagConstraints.REMAINDER; //last
	    c.anchor = GridBagConstraints.WEST;
	    c.weightx = 1.0;
	    dictionaryPane.add(labelDictionaries, c);
	    
	}

	private void setupFilePane(){
	    //Create the load file pane
	    currentFile = "";
	    labelCurrentFile = new JLabel("Current File: none");
	    buttonLoadFile = new JButton("Load File...");
	    buttonLoadFile.addActionListener(new ButtonListener());
	    loadfilePane = new JPanel();
	    loadfilePane.setMinimumSize(new Dimension(FILE_LABEL_WIDTH, LABEL_HEIGHT));
	    loadfilePane.setMaximumSize(new Dimension(FILE_LABEL_WIDTH, LABEL_HEIGHT));
	    GridBagLayout gridbag = new GridBagLayout();
	    GridBagConstraints c = new GridBagConstraints();
	    loadfilePane.setLayout(gridbag);
	    c.gridwidth = GridBagConstraints.REMAINDER;     //end row
	    c.fill = GridBagConstraints.HORIZONTAL;
	    c.weightx = 1.0;
	    loadfilePane.add(buttonLoadFile, c);
	    c.gridwidth = GridBagConstraints.REMAINDER; //last
	    c.anchor = GridBagConstraints.WEST;
	    c.weightx = 1.0;
	    loadfilePane.add(labelCurrentFile, c);			
	    
	}
	
    }
    
    private class TextArea extends JTextPane{
	public TextArea(){
	    super();
	}
	
	public void updateTextPane(String fileName){
	    setText("");
	    StyledDocument doc = getStyledDocument();
	    Style def = StyleContext.getDefaultStyleContext().getStyle(StyleContext.DEFAULT_STYLE);
	    Style regular = doc.addStyle("regular", def);
	    StyleConstants.setFontFamily(def, "SansSerif");
	    
	    Style redbold = doc.addStyle("redbold", regular);
	    StyleConstants.setBold(redbold, true);
	    StyleConstants.setForeground(redbold, Color.red);
	    
	    String result = speller.checkDocument(fileName);
	    if (result == null)	result = "";
	    SortedMap misspelled = new TreeMap();
	    List nlst;
	    String line;
	    String curword;
	    
	    populateMisspelled(result, misspelled);
	    addWords(fileName, misspelled, doc);
	}

	private void populateMisspelled(String result, SortedMap misspelled){
	    StringTokenizer st = new StringTokenizer(result,"\n\r\f");// divide only by lines
	    String line;
	    String curword;
	    List nlst;
	    while (st.hasMoreTokens())	{
		line = st.nextToken();
		StringTokenizer st2 = new StringTokenizer(line, ":, \t");
		if (!st2.hasMoreTokens())
		    throw new NumberFormatException("Illegal line: Empty line returned"
						    +" in string from checkDocument()");
		curword = st2.nextToken();
		nlst = new ArrayList();
		while (st2.hasMoreTokens())
		    nlst.add(new Integer(st2.nextToken()));
		misspelled.put(curword.toLowerCase(),nlst);
	    }
	}
	private void addWords(String fileName, SortedMap misspelled, StyledDocument doc) {
	    final String delimiters = "\n\t\" 1234567890';,.():-=+%/\\*[]{}<>?!&|_";
	    String line;
	    String curword;
	    StringTokenizer st;
	    int count = 0;
	    try{
	    BufferedReader filein = new BufferedReader(new FileReader(fileName));

	    while ((line=filein.readLine()) != null)
		{
		    count++;
		    st = new StringTokenizer(line,delimiters, true);
		    while (st.hasMoreTokens())
			{
			    curword = st.nextToken();
			    insertWord(delimiters, curword, misspelled, doc, count);
			}
		    doc.insertString(doc.getLength(), "\n", doc.getStyle("regular"));// new line
		}
	    
	    filein.close();
	    } catch( BadLocationException ble){
		System.err.println("Couldn't insert text into text pane.");
	    } catch (IOException e){			
		System.err.println("Cannot open file: " + fileName);
	    }
	    
	}

	private void insertWord(String delimiters, String curword, SortedMap misspelled, 
				StyledDocument doc, int count) throws BadLocationException{
	    if (delimiters.indexOf(curword.charAt(0)) == -1)	{		// it's a word
		if (misspelled.containsKey(curword.toLowerCase()) && 
		    ((ArrayList)misspelled.get(curword.toLowerCase())).contains(new Integer(count)))
		    doc.insertString(doc.getLength(), curword, doc.getStyle("redbold"));// highlight
		else  //case for no highligh
		    doc.insertString(doc.getLength(), curword, doc.getStyle("regular"));
	    }
	    else	
		doc.insertString(doc.getLength(), curword, doc.getStyle("regular"));  // delimiter
	    
	}

    }//end private class TextArea extends JTextPane


    
    private class ButtonListener implements ActionListener{
	public void actionPerformed(ActionEvent e) {
	    
	    if (e.getSource() == options.buttonClearAll)	{	// Clear all
		textPane.setText("");
		speller = CheckerFactory.createSpellingChecker();
		options.loadedDict = "";
		options.labelDictionaries.setText("Dictionaries: none");
	    }
	    if (e.getSource() == options.buttonAddDictionary)	{
		JFileChooser chooser = new JFileChooser(System.getProperty("user.dir"));
		if (chooser.showOpenDialog(SpellCheckGUI.this) != JFileChooser.APPROVE_OPTION)
		    return;
		File file = chooser.getSelectedFile();
		if (file == null)	return;
		//System.out.println(file.getAbsolutePath());
		//System.out.println(file.getName());
		if (!speller.loadDictionary(file.getAbsolutePath()))
		    return;
		options.loadedDict += " " + file.getName();
		options.labelDictionaries.setText("Dictionaries:" + options.loadedDict);
	    }
	    if (e.getSource() == options.buttonLoadFile)	{	// load File
		JFileChooser chooser = new JFileChooser(System.getProperty("user.dir"));
		if (chooser.showOpenDialog(SpellCheckGUI.this) != JFileChooser.APPROVE_OPTION)
		    return;
		File file = chooser.getSelectedFile();
		if (file == null)	return;
		textPane.updateTextPane(file.getAbsolutePath());
		options.currentFile = file.getName();
		options.labelCurrentFile.setText("Current File: " + options.currentFile);
	    }
	}
	
    }
}

