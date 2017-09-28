(function() {
  var ariaLabel = 'aria-label';
  function lookupUsernames() {
    var elements = document.querySelectorAll(
      'a.author' +
      ',a.assignee' +
      ',a.user-mention' +
      ',a span.discussion-item-entity' +
      ',.sidebar-assignee span p span.css-truncate-target.text-bold' +
      ',a.participant-avatar.tooltipped'
    );
    var usermap = {};
    elements.forEach (element => {
      var userid = null;
      if (element && element.hasAttribute(ariaLabel)) {
        userid = element.getAttribute(ariaLabel);
      } else if (element && element.innerText) {
        userid = element.innerText.replace('@', '');
      }
      if (userid && userid.match(/[A-Z,0]{1}[0-9]{7,8}/g)) {
        usermap[userid] = usermap[userid] || [];
        usermap[userid].push(element);
      }
    });
    for (var userid in usermap) {
      ghe.api.getUsername(userid, (uid, name) => {
        usermap[uid].forEach(element => {
          var capitalized = name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
          if (element.hasAttribute(ariaLabel)) {
            element.setAttribute(ariaLabel, capitalized);
          } else {
            element.innerText = capitalized;
          }
        });
      });
    }
  }
  setTimeout(lookupUsernames, 250);
  setInterval(lookupUsernames, 5000);
})();
