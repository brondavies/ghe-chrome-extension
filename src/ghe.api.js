var ghe = {
  usernames: {},
  api: {
    getUsername: (userid, after) => {
      if (ghe.usernames[userid]) {
        after(ghe.usernames[userid]);
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
          after(name);
        }
      })
    }
  }
};
