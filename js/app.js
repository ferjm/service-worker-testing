'use strict';

var DEBUG = true;

window.addEventListener('DOMContentLoaded', function load() {
  window.removeEventListener('DOMContentLoaded', load);

  if (!('serviceWorker' in navigator)) {
    return;
  }

  function debug(msg) {
    if (DEBUG) {
      dump(msg + '\n');
      console.log(msg);
    }
  }

  function debugSwr(swr) {
    if (swr.installing) {
      debug('Client context: registration has an installing worker (' +
           swr.installing.state + ')!');
    }
    if (swr.waiting) {
      debug('Client context: registration has an waiting worker (' +
           swr.waiting.state + ')!');
    }
    if (swr.active) {
      debug('Client context: registration has an active worker (' +
           swr.active.state + ')!');
    }
  }

  function required(what, error) {
    if (!what) {
      throw new Error(error);
    }
  }

  document.getElementById('register-worker').onclick = function() {
    navigator.serviceWorker.register('service.js', {scope: './'}).then(
      swr => {
        debugSwr(swr);
      },
      error => {
        debug('Client context: ' + error);
    });
  };

  document.getElementById('post-message').onclick = function() {
    navigator.serviceWorker.getRegistration().then(swr => {
      required(swr, 'Client context: no ServiceWorkerRegistration!');
      var content, iframe;
      window.onmessage = function(msg) {
        if (msg.data === 'READY') {
          swr.active.postMessage('ping');
        } else {
          debug('Client context. Message from service worker: ' + msg.data);
          content.removeChild(iframe);
        }
      };
      content = document.getElementById('content');
      iframe = document.createElement('iframe');
      iframe.setAttribute('src', 'test.html');
      if (!content) {
        debug('Client context: unable to append child!');
        return;
      }
      content.appendChild(iframe);
    });
  };

  document.getElementById('register-sync').onclick = () => {
    navigator.serviceWorker.getRegistration().then(swr => {
      required(swr, 'Client context: no ServiceWorkerRegistration!');
      swr.sync.register('test').then(() => {
        debug('Sync request successfully registered');
      }).catch(error => {
        debug('Could not register sync request ' + error);
      });
    });
  };

  document.getElementById('update-worker').onclick = function() {
    navigator.serviceWorker.getRegistration().then(swr => {
      required(swr, 'Client context: no ServiceWorkerRegistration!');
      swr.update();
      debug('Client context: service worker registration updated!');
    });
  };

  document.getElementById('register-skip-waiting-worker').onclick = function() {
    navigator.serviceWorker.register('skip-waiting-service.js', {scope: './'}).then(
      swr => {
        debugSwr(swr);
      },
      error => {
        debug('Client context: ' + error);
    });
  };

  document.getElementById('check-controller').onclick = function() {
    if (!navigator.serviceWorker.controller) {
      debug('Client context: no navigator.serviceWorker.controller object!');
      return;
    }
    debug('Client context: navigator.serviceWorker.controller.state is ' +
         (navigator.serviceWorker.controller.state));
  };

  document.getElementById('check-registration').onclick = function() {
    navigator.serviceWorker.getRegistration().then(swr => {
      required(swr, 'Client context: no ServiceWorkerRegistration!');
      debugSwr(swr);
    });
  };

  document.getElementById('unregister-registration').onclick = function() {
    navigator.serviceWorker.getRegistration().then(swr => {
      required(swr, 'Client context: no ServiceWorkerRegistration!');
      debugSwr(swr);
      swr.unregister().then(result => {
        debug('Client context: unregister registration ' +
             (result ? 'succeed' : 'failed'));
      });
    });
  };
});
