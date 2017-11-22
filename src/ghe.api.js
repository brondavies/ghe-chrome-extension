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
    temp: {},
    api: {
      getUsername: (userid, after) => {
        var value = ghe.usernames[userid] || ghe.temp[userid];
        if (value) {
          after(userid, value);
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
            if (name != userid) {
              ghe.usernames[userid] = name;
              cache();
            } else {
              ghe.temp[userid] = name;
            }
            after(userid, name);
          } else {
            ghe.temp[userid] = userid;
          }
        })
      }
    }
  };
})();
