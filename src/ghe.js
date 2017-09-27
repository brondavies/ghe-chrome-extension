(function() {
  function lookupUsernames() {
    var elements = document.querySelectorAll('a.author,a.assignee,a.user-mention,a span.discussion-item-entity');
    var usermap = {};
    elements.forEach (element => {
      if (element && element.innerText) {
        var userid = element.innerText.replace('@', '');
        if (userid.match(/[A-Z,0]{1}[0-9]{7,8}/g)) {
          usermap[userid] = usermap[userid] || [];
          usermap[userid].push(element);
        }
      }
    });
    for (var userid in usermap) {
      ghe.api.getUsername(userid, (name) => {
        usermap[userid].forEach(element => {
          element.innerText = name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        });
      });
    }
  }
  lookupUsernames();
  setInterval(lookupUsernames, 5000);
})();
