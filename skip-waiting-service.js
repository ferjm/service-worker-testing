'use strict';

var DEBUG = true;

if (!self.debug) {
  self.debug = function debug(message) {
    if (!DEBUG) {
      return;
    }
    dump("Execution context(skip-waiting-service): " + message + "\n");
    console.log(message);
  };
}

self.addEventListener('message', msg => {
  debug('event from client - ' + msg.data);
  self.clients.matchAll().then(function(res) {
    if (!res.length) {
      debug("no clients are currently controlled!");
      return;
    }
    res[0].postMessage(msg.data === 'ping' ? 'pong' : msg.data);
  });
});

self.addEventListener('install', evt => {
  if (DEBUG) {
    debug('install event fired!');
  }

  self.skipWaiting().then(() => {
    debug("skipWaiting promise resolves correctly");
  });

  function delaysAsInstalled() {
    return Promise.resolve();
  }
  evt.waitUntil(delaysAsInstalled());
});

self.addEventListener('activate', evt => {
  if (DEBUG) {
    debug('activate event fired!');
  }
  function delaysAsActivated() {
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
