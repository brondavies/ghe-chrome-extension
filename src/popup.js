
function setEatFood(event) {
  var script = 'ai && ai.toggleEatFood();';
  chrome.tabs.executeScript({code: script});
}

function setParanoia(event) {
  var paranoia = 0;
  var script = 'ai && ai.setParanoia(' + paranoia + ');';
  chrome.tabs.executeScript({code: script});
}

function setDebugging(event) {
  var debuglevel = 0;
  var script = 'ai && ai.setDebugging(' + debuglevel + ');';

  chrome.tabs.executeScript({code: script});
}

function setZoomLevel(event) {
  var script = 'ai && ai.toggleZoom();';
  chrome.tabs.executeScript({code: script});
}

function setDetailLevel(event) {
  var script = 'ai && ai.toggleRenderMode();';
  chrome.tabs.executeScript({code: script});
}
