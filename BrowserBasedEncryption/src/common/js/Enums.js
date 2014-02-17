/**
* The types of controllers the system supports.
* @class ControllerTypes
*/
var ControllerTypes = {
    
    /**
    * Means any chat controller matches this type.
    * @property any
    * @type String
    */
    any: "Any",

    /**Represents controllers for email.
    * @property email
    * @type String
    */
    email: "email",

    /**
    * Represents controllers for chat.
    * @property chat
    * @type String
    */
    chat: "chat"

};

/**
* This class represents the various chat event types.
* @class ChatEventTypes
*/
var ChatEventTypes = {

    /**
    * Occurs when a chat message is sent or received
    * @property MessageSentReceived
    * @type String
    */
    MessageSentReceived: "messageSentReceived",

    /**
    * Occurs when a chat window receives focus
    * @property FocusChat
    * @type String
    */
    FocusChat: "focusChat",

    /**
    * Occurs when a chat window closes
    * @property CloseChat
    * @type String
    */
    CloseChat: "closeChat"

};

/**
* This class represents an area of text that must be processed by Kiwi.
* @class Uris
*/
var Uris = {

    /**
     * Gets the domain of this script.
     * @property domainUri
     * @type String
     */
    domainUri: '@DOMAIN_URI',

    /**
     * Gets the URI of the proxy.
     * @property proxyUri
     * @type String
     */
    proxyUri: '@PROXY_URI',
  
    /**
     * Gets the url for the read window.
     * @property readWindowUri
     * @type String
     */
    readWindowUri: '@SERVER_URI/ReadWindow.aspx',

    /**
     * Gets the url for the compose window.
     * @property composeWindowUri
     * @type String
     */
    composeWindowUri: '@SERVER_URI/ComposeWindow.aspx',

    /**
    * Gets the url for the Key Manager Window.
    * @property keyManagerWindowUri
    * @type String
    */
    keyManagerWindowUri: '@SERVER_URI/KeyManagerWindow.aspx',

		/**
		* Gets the url for the Facebook chat window.
		* @property facebookChatWindowUri
		* @type String
		*/
		chatWindowUri: '@SERVER_URI/ChatWindow.aspx',

		/**
		* Gets the url for the website where the chat bookmarklet is
		* @property chatInfoUri
		* @type String
		*/
		chatInfoUri: '@DOMAIN_URI/chat',

    /**
     * Gets the url for the small lock icon.
     * @property smallLockIconUri
     * @type String
     */
    smallLockIconUri: '@SERVER_URI/img/SmallLockIcon.png',

    /**
     * Gets the url for the medium lock icon.
     * @property mediumLockIconUri
     * @type String
     */
    mediumLockIconUri: '@SERVER_URI/img/MediumLockIcon.png',

    /**
     * Gets the url for the large lock icon.
     * @property largeLockIconUri
     * @type String
     */
    largeLockIconUri: '@SERVER_URI/img/LargeLockIcon.png',

    /**
     * Gets the url for the medium unlocked icon.
     * @property smallLockIconUri
     * @type String
     */
    mediumUnlockedIconUri: '@SERVER_URI/img/MediumUnlockedIcon.png',

    /**
    * Gets the urls for the key servers.
    * @property keyServerUris
    * @type String
    */
    keyServerUris: "https://kiwi.byu.edu/ks/",//[@TRUSTED_KEY_SERVERS],

};


/**
* This class represents the various message types.
* @class WindowMessageTypes
*/
var WindowMessageTypes = {

	/**
	* Request contents.
	* @property GetContents
	* @type Number
	*/
	GetContents: 1,

	/**
	* Cancel kiwi encryption
	* @property CancelEncryption
	* @type Number
	*/
	CancelEncryption: 2,

	/**
	* Saves a draft.
	* @property SaveDraft
	* @type Number
	*/
	SaveDraft: 3,

	/**
	* Sends a message.
	* @property SendMessage
	* @type Number
	*/
	SendMessage: 4,

    /**
	* Gets the recipients of a message.
	* @property GetRecipients
	* @type Number
	*/
	GetRecipients: 5,
    
    /**
	* Gets the saw tokens from email subjects.
	* @property GetSawTokens
	* @type Number
	*/
	GetSawTokens: 6,

	/**
	* Processes a message just received
	* @property MessageReceived
	* @type Number
	*/
	MessageReceived: 7,

	/**
	* Gets the token from other authentication forms
	* @property BeginGetOtherTokens
	* @type Number
	*/
	BeginGetOtherTokens: 8,

	/**
	* Ends the get other token process
	*/
	EndGetOtherTokens: 9,

	/**
	* Closes the encryption and chat dialogs
	*/
	CloseChat: 10,

    /**
    * Sends the sizing info for the overlay or vice-versa.
    */
    SizingInfo: 11,

};

/**
* The various authentication methods
* @class AuthenticationMethod
*/
var AuthenticationMethod = {

    /**
	* No authentication used.
	* @property None
	* @type Number
	*/
    None: 0,
    
    /**
	* Saw authentication used.
	* @property Saw
	* @type Number
	*/
    Saw: 1,
    
    /**
	* Password authentication used.
	* @property Password
	* @type Number
	*/
    Password: 2,
    
    /**
	* Other authentication used.
	* @property Facebook
	* @type Number
	*/
    Other: 3
};

/**
* The type of key request.
* @class KeyRequestType
*/
var KeyRequestType = {

    /**
	* Creator key is being requested.
	* @property CreatorKey
	* @type Number
	*/
    CreatorKey: 1,

    /**
	* Viewer key is being requested.
	* @property ViewerKey
	* @type Number
	*/
    ViewerKey: 2
};