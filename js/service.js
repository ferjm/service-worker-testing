'use strict';

var DEBUG = true;

if (!self.debug) {
  self.debug = function debug(message) {
    dump("Service worker thread: " + message + "\n");
  };
}

self.addEventListener('install', evt => {
  if (DEBUG) {
    debug('service worker installed!');
  }
});

self.addEventListener('activate', evt => {
  if (DEBUG) {
    debug('service worker activated!');
  }
});

self.addEventListener('fetch', evt => {
  var request = evt.request;
  var url = new URL(request.url);
  
  if (DEBUG) {
    debug('fetching ' + url.pathname);
  }

  evt.respondWith(fetch(request));
});
