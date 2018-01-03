(function() {
  var ariaLabel = 'aria-label';
  var selector =
    'a.author' +
    ',a.assignee' +
    ',a.user-mention' +
    ',a span.discussion-item-entity' +
    ',.sidebar-assignee span p span.css-truncate-target.text-bold' +
    ',a.participant-avatar.tooltipped' +
    ',.opened-by a.muted-link' +
    ',a.avatar-link.tooltipped' +
    ',li.facebox-user-list-item a' +
    ',.comment-reactions-options .reaction-summary-item.tooltipped' +
    ',.branch-meta a.muted-link' +
    ',.contrib-data a.aname' +
    ',.blame-commit-meta a[rel="contributor"]' +
    ',.flash a.text-emphasized' +
    ',.merge-status-item > a.tooltipped' +
    ',.review-status-item strong';
  function lookupUsernames() {
    var elements = document.querySelectorAll(selector);
    var usermap = {};
    for (var elindex = elements.length - 1; elindex >= 0; elindex--) {
      var element = elements[elindex];
      var userid = null;
      if (element && element.hasAttribute(ariaLabel)) {
        var words = element.getAttribute(ariaLabel).split(' ');
        userid = words.pop().replace('@', '');
        if (!isUserId(userid)) {
          userid = words[0].replace('@', '');
        }
      } else if (element && element.innerText) {
        userid = element.innerText.trim().replace('@', '');
      }
      if (isUserId(userid)) {
        usermap[userid] = usermap[userid] || [];
        usermap[userid].push(element);
      }
    }
    var userids = Object.keys(usermap);
    for (var i = userids.length - 1; i >= 0; i--) {
      var userid = userids[i];
      ghe.api.getUsername(userid, (uid, name) => {
        for (var mapindex = usermap[uid].length - 1; mapindex >= 0; mapindex--) {
          var element = usermap[uid][mapindex];
          var capitalized = name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
          if (element.hasAttribute(ariaLabel)) {
            element.setAttribute(ariaLabel, element.getAttribute(ariaLabel)
              .replace('@' + userid, capitalized)
              .replace(userid, capitalized));
          }
          if (element.innerText.trim().replace('@', '') === userid) {
            element.innerText = capitalized;
          }
        }
      });
    }
  }

  function isUserId(userid) {
    return userid && userid.match(/[aA-Z0]{1}[0-9]{6,8}/g);
  }

  setTimeout(lookupUsernames, 250);
  setTimeout(lookupUsernames, 1000);
  setTimeout(lookupUsernames, 2000);
  var updateTimer = 0;
  var observer = new MutationObserver(() => {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(lookupUsernames, 100);
  });
  observer.observe(document.body, {attributes: true, childList: true, subtree: true});
})();
