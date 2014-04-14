
package cs235.spell;

public interface SpellingChecker {

    /**
     * Loads the dictionary contained in the specified file
     * 
     * @param filename The name of the dictionary file to be loaded
     * @return true If the file was successfully loaded, false
     *          if the file could not be loaded or was invalid
     * @throws IllegalArgumentException if filename is null
     */
    boolean loadDictionary(String filename);
    
    /**
     * Check the document for misspelled words
     *
     * @return A list of misspelled words and
     *         the line numbers where they occur.
     * @throws IllegalArgumentException if filename is null
     */
    String checkDocument(String filename);

}

