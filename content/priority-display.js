Components.utils.import("resource:///modules/gloda/log4moz.js");

function enhancedPriorityDisplayIcons() {
    var oldColumnHandler;
    var logger = Log4Moz
	.getConfiguredLogger("extensions.EnhancedPriorityDisplay",
			     Log4Moz.Level.Trace,
			     Log4Moz.Level.Info,
			     Log4Moz.Level.Debug);
    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefBranch);

    function priorityIconsOnLoad() {
	var ObserverService = Components.classes["@mozilla.org/observer-service;1"]
	    .getService(Components.interfaces.nsIObserverService);
	ObserverService.addObserver(createDbObserver, "MsgCreateDBView", false);
	// Sometimes the event doesn't happen.
	createDbObserver.observe();
    };

    function priorityIconsOnUnload() {
	if (gDBView) {
	    var handler = gDBView.getColumnHandler("priorityCol");
	    if (handler) {
		var old = handler.old;
		gDBView.removeColumnHandler("priorityCol");
		if (old) {
		    gDBView.addColumnHandler("priorityCol", old);
		}
	    }
	}
    };

    var createDbObserver = {
	// Components.interfaces.nsIObserver
	observe: function(aMsgFolder, aTopic, aData) {  
	    if (gDBView) {
		var columnHandler = {
		    getCellText: function(row, col) {
			return "";
		    },

		    getSortStringForRow: function(hdr) {
			if (columnHandler.old)
			    return columnHandler.old.getSortStringForRow(hdr);
			else
			    return null;
		    },

		    isString: function() {
			return false;
		    },

		    getCellProperties: function(row, col, props) {
			var hdr = gDBView.getMsgHdrAt(row);
			var priority = hdr.getStringProperty("priority");
			var property;
			switch (priority) {
			case "6":
			    property = "enhanced-priority-display-highest";
			    break;
			case "5":
			    property = "enhanced-priority-display-high";
			    break;
			case "3":
			    property = "enhanced-priority-display-low";
			    break;
			case "2":
			    property = "enhanced-priority-display-lowest";
			    break;
			}
			if (property) {
			    var aserv=Components
				.classes["@mozilla.org/atom-service;1"].
				getService(Components.interfaces.nsIAtomService);
			    props.AppendElement(aserv.getAtom(property));
			}
			if (columnHandler.old)
			    columnHandler.old.getCellProperties(row, props);
		    },

		    getRowProperties: function(row, props) {
			if (columnHandler.old)
			    columnHandler.old.getRowProperties(row, props);
		    },

		    getImageSrc: function(row, col) {
			var hdr = gDBView.getMsgHdrAt(row);
			var priority = hdr.getStringProperty("priority");
			switch (priority) {
			case "6":
			    return "chrome://EnhancedPriorityDisplay/content/highest.gif";
			case "5":
			    return "chrome://EnhancedPriorityDisplay/content/high.gif";
			case "3":
			    return "chrome://EnhancedPriorityDisplay/content/low.gif";
			case "2":
			    return "chrome://EnhancedPriorityDisplay/content/lowest.gif";
			default:
			    if (columnHandler.old)
				return columnHandler.old.getImageSrc(row, col);
			    else
				return null;
			}
		    },

		    getSortLongForRow: function(hdr) {
			if (columnHandler.old)
			    return columnHandler.old.getSortLongForRow(hdr);
			else
			    return null;
		    }
		};

		try {
		    columnHandler.old = gDBView.getColumnHandler("priorityCol");
		}
		catch (ex) {}
		gDBView.addColumnHandler("priorityCol", columnHandler);
		// var threadCols = document.getElementById("threadCols");
		// if (! threadCols)
		//     return;
		// var columns = threadCols.getElementsByTagName("treecol");
		// if (! columns)
		//     return;
		// for (var column in columns) {
		//     if (columns[column].id != "priorityCol") {
		// 	genericColumnHandler(columns[column].id);
		//     }
		// }
	    }
	}
    };

    window.addEventListener("load", priorityIconsOnLoad, false);
    window.addEventListener("unload", priorityIconsOnUnload, false);
};

enhancedPriorityDisplayIcons.apply();
