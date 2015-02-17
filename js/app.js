'use strict';

window.addEventListener('DOMContentLoaded', function load() {
  window.removeEventListener('DOMContentLoaded', load);

  if ('serviceWorker' in navigator) {
    if (!navigator.serviceWorker.active) {
      navigator.serviceWorker.register('js/service.js').then(
        sw => {
        },
        error => {
          console.log(error);
        });
    }
  }
});
