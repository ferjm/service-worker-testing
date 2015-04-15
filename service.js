'use strict';

var DEBUG = true;
var CACHE_NAME = 'foo';
var cached = [
  '/index.html',
  '/test.html',
  '/css/app.css',
  '/js/app.js',
  '/img/mozilla.png'
];

if (!self.debug) {
  self.debug = function debug(message) {
    dump("Execution context: " + message + "\n");
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

  function delaysAsInstalled() {
    debug('opening cache...');
    return caches.open(CACHE_NAME).then((cache) => {
      debug('opened cache so adding content!');
      return cache.addAll(cached);
    });
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

  evt.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(request);
      }
    })
  );
});
