'use strict';

var DEBUG = true;
var GLOBAL = this;

if (!this.debug) {
  this.debug = function debug(message) {
    dump("Service worker thread: " + message + "\n");
  };
}

this.addEventListener('install', evt => {
  if (DEBUG) {
    GLOBAL.debug('service worker installed!');
  }
});

this.addEventListener('fetch', evt => {
  var request = evt.request;
  var url = new URL(request.url);
  
  if (DEBUG) {
    GLOBAL.debug('fetching ' + url.pathname);
  }
});
