// YouTube Mobile Redirector - IamJony
// basilisk & Pale Moon compatible

var YouTubeMobileRedirector = {
  init: function() {
    // Load when browser is ready
    window.removeEventListener('load', YouTubeMobileRedirector.init, false);
    
    // Add progress listener for tab navigation
    if (typeof gBrowser !== 'undefined') {
      gBrowser.addTabsProgressListener(YouTubeMobileRedirector.ProgressListener);
    }
  },

  ProgressListener: {
    QueryInterface: function(aIID) {
      if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
          aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
          aIID.equals(Components.interfaces.nsISupports)) {
        return this;
      }
      throw Components.results.NS_NOINTERFACE;
    },

    onLocationChange: function(aBrowser, aProgress, aRequest, aURI, aFlags) {
      // Only process YouTube URLs
      if (!aURI || aURI.asciiHost !== 'www.youtube.com') return;
      
      // Skip if already has mobile app parameter
      if (aURI.query && aURI.query.indexOf('app=m') > -1) return;
      
      // Build mobile URL with proper parameters
      var mobileURL = aURI.scheme + '://m.youtube.com' + aURI.filePath;
      
      // Add mobile parameters - KEY PART FROM ORIGINAL
      mobileURL += '?persist_app=1&app=m';
      
      // Preserve original query parameters
      if (aURI.query && aURI.query.length > 0) {
        mobileURL += '&' + aURI.query;
      }
      
      // Preserve URL fragment
      if (aURI.ref && aURI.ref.length > 0) {
        mobileURL += '#' + aURI.ref;
      }
      
      // Log for debugging (remove in production)
      console.log('YouTube Mobile Redirector: Redirecting to', mobileURL);
      
      // Cancel original request
      if (aRequest) {
        try {
          aRequest.cancel(Components.results.NS_BINDING_ABORTED);
        } catch(e) {
          console.error('Failed to cancel request:', e);
        }
      }
      
      // Redirect to mobile site
      try {
        if (aProgress && aProgress.DOMWindow) {
          aProgress.DOMWindow.location.replace(mobileURL);
        } else if (aBrowser && aBrowser.contentWindow) {
          aBrowser.contentWindow.location.replace(mobileURL);
        }
      } catch(e) {
        console.error('Redirect failed:', e);
      }
    },

    // Empty required methods
    onStateChange: function() {},
    onProgressChange: function() {},
    onStatusChange: function() {},
    onSecurityChange: function() {},
    onLinkIconAvailable: function() {}
  }
};

// Start the extension
window.addEventListener('load', YouTubeMobileRedirector.init, false);
