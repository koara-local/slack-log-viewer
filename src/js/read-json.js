(function() {
  var channelList, channelMassages, channelName, dataPath;

  $(".sidebar").mCustomScrollbar({
    mouseWheel: {
      deltaFactor: 100
    },
    autoHideScrollbar: true
  });

  dataPath = "data/";

  channelName = "general/";

  channelList = new Vue({
    el: '#channelList',
    data: {
      channels: []
    },
    methods: {
      onClick: function(e) {
        channelMassages.channel.name = e.target.innerHTML.slice(1);
        return console.log("channel switched : " + channelMassages.channel.name);
      },
      onLoad: function() {
        channelMassages.channel.name = this.channels[0].name;
        return console.log("channel onLoad : " + channelMassages.channel.name);
      },
      updateChannelList: function() {
        return $.getJSON(dataPath + "channels.json", function(data) {
          var i, len, value;
          for (i = 0, len = data.length; i < len; i++) {
            value = data[i];
            channelList.channels.push(value);
          }
          return channelList.onLoad();
        });
      }
    },
    created: function() {
      console.log("channelList created");
      return this.updateChannelList();
    }
  });

  channelMassages = new Vue({
    el: '#channelMassages',
    data: {
      channel: {
        name: ''
      },
      massages: [],
      massages_updated: [],
      fileList: [],
      userData: []
    },
    methods: {
      updateUserData: function() {
        var path;
        if (this.userData.length > 0) {
          return;
        }
        path = dataPath + "users.json";
        console.log("load user data : " + path);
        $.ajax({
          type: "GET",
          url: path,
          async: false
        }).done(function(data) {
          return channelMassages.$set('userData', data);
        });
        return console.log("update user data done");
      },
      updateFileList: function(channelName) {
        var path;
        path = dataPath + channelName + "/" + "filelist.json";
        console.log("load channel filelist : " + path);
        $.ajax({
          type: "GET",
          url: path,
          async: false
        }).done(function(data) {
          return channelMassages.$set('fileList', data);
        });
        return console.log("update channel filelist done");
      },
      updateChannelMassages: function(channelName) {
        var deferreds, filename, i, len, path, readfile, ref;
        console.log("update channel messages");
        console.log("fileList.length : " + this.fileList.length);
        this.$set('massages_updated', []);
        this.massages = [];
        deferreds = [];
        ref = this.fileList;
        for (i = 0, len = ref.length; i < len; i++) {
          filename = ref[i];
          path = dataPath + channelName + "/" + filename;
          console.log("load json data : " + path);
          readfile = $.ajax({
            type: "GET",
            url: path,
            async: true
          }).done(function(data) {
            var j, k, len1, len2, message, messages, results, value;
            messages = [];
            for (j = 0, len1 = data.length; j < len1; j++) {
              message = data[j];
              if (message.icons === void 0) {
                if (message.user === void 0) {
                  message.icons = {
                    image_48: 'assets/icon/dummy.png'
                  };
                } else {
                  channelMassages.userData.filter(function(item, index) {
                    if (item.id === message.user) {
                      return message.icons = {
                        image_48: item.profile.image_48
                      };
                    }
                  });
                }
              }
              if (message.username === void 0) {
                if (message.user === void 0) {
                  message.username = 'unknown';
                } else {
                  channelMassages.userData.filter(function(item, index) {
                    if (item.id === message.user && item.name !== void 0) {
                      return message.username = item.name;
                    }
                  });
                }
              }
              messages.push(message);
            }
            results = [];
            for (k = 0, len2 = messages.length; k < len2; k++) {
              value = messages[k];
              results.push(channelMassages.massages.push(value));
            }
            return results;
          });
          deferreds.push(readfile);
        }
        $.when.apply($, deferreds).done(function() {
          return channelMassages.$set('massages_updated', channelMassages.massages);
        });
        return console.log("update channel messages done");
      },
      onChangeChannel: function() {
        channelName = this.channel.name;
        this.updateUserData();
        this.updateFileList(channelName);
        return this.updateChannelMassages(channelName);
      }
    },
    watch: {
      'channel.name': function() {
        return this.onChangeChannel();
      },
      'massages': function() {
        return console.log('massages updated');
      }
    },
    created: function() {
      return console.log("channelMassages created");
    }
  });

}).call(this);
