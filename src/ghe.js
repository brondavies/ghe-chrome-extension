(function() {
  var ariaLabel = 'aria-label';
  function lookupUsernames() {
    var elements = document.querySelectorAll(
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
      ',.review-status-item strong'
    );
    var usermap = {};
    elements.forEach (element => {
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
    });
    for (var userid in usermap) {
      ghe.api.getUsername(userid, (uid, name) => {
        usermap[uid].forEach(element => {
          var capitalized = name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
          if (element.hasAttribute(ariaLabel)) {
            element.setAttribute(ariaLabel, element.getAttribute(ariaLabel)
              .replace('@' + userid, capitalized)
              .replace(userid, capitalized));
          }
          if (element.innerText.trim().replace('@', '') === userid) {
            element.innerText = capitalized;
          }
        });
      });
    }
  }

  function isUserId(userid) {
    return userid && userid.match(/[aA-Z0]{1}[0-9]{6,8}/g);
  }

  setTimeout(lookupUsernames, 250);
  setTimeout(lookupUsernames, 1000);
  setTimeout(lookupUsernames, 2000);
  setInterval(lookupUsernames, 5000);
})();
