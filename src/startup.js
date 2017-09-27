(function() {
  window.addEventListener('load', loaded, false);

  function loaded(evt) {
    chrome.storage.local.get(null, function(output) {
      if (output) {
        if (output.enabled == 'true' || output.enabled == null || output.enabled == undefined) {
          addScript('ghe.api.js');
          addScript('ghe.js');
        }
      }
    });
  }

  function addScript(name) {
    var script = document.createElement('SCRIPT');
    script.src = chrome.extension.getURL(name);
    document.body.appendChild(script);
  }
})();
