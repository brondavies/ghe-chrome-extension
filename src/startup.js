(function() {
  window.addEventListener('load', loaded, false);

  function loaded(evt) {
    chrome.storage.local.get(null, function(output) {
      if (output) {
        if (output.enabled == 'true' || output.enabled == null || output.enabled == undefined) {
          addScript('ghe.api.js');
          addScript('ghe.js');
          addCSS('ghe.css');
        }
      }
    });
  }

  function addScript(name) {
    var script = document.createElement('SCRIPT');
    script.src = chrome.extension.getURL(name);
    document.body.appendChild(script);
  }

  function addCSS(name) {
    var link = document.createElement('LINK');
    link.href = chrome.extension.getURL(name);
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
})();
