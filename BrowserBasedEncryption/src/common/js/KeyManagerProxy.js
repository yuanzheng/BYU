/**
* This class provides a fascade for using the key manager.
* @class KeyRequestArgs
* @constructor
*/
var KeyRequestArgs = function(keyServerUri, creatorId, viewerId, timestamp, keySize) {
    this.keyServerUri = keyServerUri;
    this.creatorId = creatorId;
    this.viewerId = viewerId;
    this.timestamp = timestamp;
    this.keySize = keySize;
};

/**
* A facade used to access the key manager that lives in a different frame.
* @class KeyManagerProxy
* @constructor
*/
var KeyManagerProxy = (function () {
    var keyManagerProxy = new Class({

        /**
        * Keep track of all the various requests waiting to be fulfilled.
        * @property waitingRequests
        * @type Object
        */
        waitingRequests: {},

        /**
        * Regular expression for parsing the session storage response.
        * @property responseRegex
        * @type XRegExp
        */
        responseRegex: new XRegExp("^KeyResponse\\|(?<id>\\d+)", 'i'),

        /**
        * Adds the window event listener that will get key responses from
        * the key manager overlay.
        * @method initialize
        */
        initialize: function () {
            var self = this;

            window.addEventListener("storage", function (e) {
                // We only care about new entries in session storage.
                // TODO: Firefox doesn't correctly set the storage area.  This is a hack.
                // TODO: I do not like using !!e.oldValue, but I have to since IE sets e.oldValue to '' when it should be null.
                if (!(Browser.firefox || e.storageArea === window.sessionStorage) || (!e.newValue) || (!!e.oldValue))
                    return;

                // See if the result is something we are waiting for.
                var results = self.responseRegex.exec(e.key);
                if (results && self.waitingRequests[results.id]) {
                    // Get the item out of storage.                
                    var item = self.waitingRequests[results.id];
                    delete self.waitingRequests[results.id];

                    // Parse the response.
                    var responseResults = JSON.parse(e.newValue);

                    // Remove this record when possible.
                    window.setTimeout(function () { window.sessionStorage.removeItem(e.key); }, 0);

                    // Fire the callback.
                    item.callback(responseResults.success, responseResults.value, item.args);
                }
            }, false);
        },

        /**
        * Gets a viewer key as described.
        * @method getViewerKey
        * @param args {KeyRequestArgs} The arguments that describe the key requested.
        * @param callback {Function} A callback to be called when the key has been retrieved.
        */
        getViewerKey: function (args, callback) {
            this.getKey(args, callback, KeyRequestType.ViewerKey);
        },

        /**
        * Gets a creator key as described.
        * @method getCreatorKey
        * @param args {KeyRequestArgs} The arguments that describe the key requested.
        * @param callback {Function} A callback to be called when the key has been retrieved.
        */
        getCreatorKey: function (args, callback) {
            this.getKey(args, callback, KeyRequestType.CreatorKey);
        },

        /**
        * Sends a request for the key to the key manager.
        * @method getViewerKey
        * @param args {KeyRequestArgs} The arguments that describe the key requested.
        * @param callback {Function} A callback to be called when the key has been retrieved.
        * @param requestType {KeyRequestType} The type of key requested.
        */
        getKey: function (args, callback, requestType) {
            var requestId = Math.random().toString().substring(2);
            var requestString = String.format("KeyRequest|{0}|{1}", requestType, requestId);
            this.waitingRequests[requestId] = { args: args, callback: callback };

            window.sessionStorage[requestString] = JSON.stringify(args);
        } .protect()
    });

    return new keyManagerProxy();
})();