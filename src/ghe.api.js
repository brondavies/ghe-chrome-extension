(function() {
  var cacheTimer = 0;
  function cache() {
    clearTimeout(cacheTimer);
    cacheTimer = setTimeout(cacheAsync, 1000);
  }
  function cacheAsync() {
    localStorage.setItem('usernameCache', JSON.stringify(ghe.usernames));
  }
  window.ghe = {
    usernames: JSON.parse(localStorage.getItem('usernameCache') || '{}'),
    api: {
      getUsername: (userid, after) => {
        if (ghe.usernames[userid]) {
          after(userid, ghe.usernames[userid]);
          return;
        }
        fetch('/' + userid, {
          credentials: 'same-origin'
        }).then(response => {
          return response.text();
        }).then(text => {
          var matches = text.match('(.*)<title>' + userid + ' \\((.+)\\)<\\/title>');
          if (matches && matches.length > 2) {
            var name = matches[2];
            ghe.usernames[userid] = name;
            after(userid, name);
            cache();
          }
        })
      }
    }
  };
})();
