'use strict';

window.addEventListener('DOMContentLoaded', function load() {
  window.removeEventListener('DOMContentLoaded', load);

  if ('serviceWorker' in navigator) {
    document.getElementById('check-controller').onclick = function() {
      if (!navigator.serviceWorker.controller) {
        dump('Client context: no navigator.serviceWorker.controller object!\n');
        return;
      }
      dump('Client context: navigator.serviceWorker.controller.state is ' +
           (navigator.serviceWorker.controller.state)+ '\n');
      navigator.serviceWorker.getRegistration().then(swr => {
        if (!swr) {
          return;
        }
        if (swr.active) {
          dump('Client context (register): registration has an installed' +
               'worker (' + swr.active.state + ')!\n');
        }
      });
    };

    document.getElementById('unregister-registration').onclick = function() {
      navigator.serviceWorker.getRegistration().then(swr => {
        if (!swr) {
          return;
        }
        swr.unregister().then(result => {
          dump('Client context: unregister registration ' +
               (result ? 'succeed' : 'failed') + '!\n');
        });
      });
    };

    if (navigator.serviceWorker.controller) {
      return;
    }

    navigator.serviceWorker.register('js/service.js').then(
      swr => {
        if (swr.installing) {
          dump('Client context: registration has an installing' +
               ' worker (' + swr.installing.state + ')!\n');
          // Once the installing worker is set and it changes is because
          // either the waiting worker or the active one is set.
          swr.installing.addEventListener('statechange', evt => {
            if (swr.waiting) {
              dump('Client context: registration has an waiting worker' +
                   '(' + swr.waiting.state + ')!\n');
            }
            if (swr.active) {
              dump('Client context: registration has an active worker ' +
                   '(' + swr.active.state + ')!\n');
            }
          });
        }
      },
      error => {
        dump('Client context: ' + error + '\n');
      });
  }
});
