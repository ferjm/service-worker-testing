'use strict';

var DEBUG = true;

if (!self.debug) {
  self.debug = function debug(message) {
    dump("Execution context: " + message + "\n");
  };
}

self.addEventListener('install', evt => {
  if (DEBUG) {
    debug('install event fired!');
  }

  function delaysAsInstalled() {
    if (DEBUG) {
      debug('delaying treating the installing worker as installed!');
    }
    return Promise.resolve();
  }
  evt.waitUntil(delaysAsInstalled());
});

self.addEventListener('activate', evt => {
  if (DEBUG) {
    debug('activate event fired!');
  }
  function delaysAsActivated() {
    if (DEBUG) {
      debug('delaying treating the installing worker as activated!');
    }
    return Promise.resolve();
  }
  evt.waitUntil(delaysAsActivated());
});

self.addEventListener('fetch', evt => {
  var request = evt.request;
  var url = new URL(request.url);
  
  if (DEBUG) {
    debug('fetching ' + url.pathname);
  }

  evt.respondWith(fetch(request));
});