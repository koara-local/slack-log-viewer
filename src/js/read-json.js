(function() {
  var channelInfo, channelList, channelMessages, channelName, dataPath;

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
        return channelInfo.name = e.target.innerHTML.slice(1);
      },
      onLoad: function() {
        return channelInfo.name = this.channels[0].name;
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

  channelInfo = new Vue({
    el: '#channelInfo',
    data: {
      name: ''
    },
    watch: {
      'name': function() {
        return channelMessages.onChangeChannel();
      }
    }
  });

  channelMessages = new Vue({
    el: '#channelMessages',
    data: {
      messages: [],
      messages_update: [],
      fileList: [],
      fileListNum: 0,
      userData: [],
      loadMessage: false
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
          return channelMessages.$set('userData', data);
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
          return channelMessages.$set('fileList', data);
        });
        return console.log("update channel filelist done");
      },
      updateChannelMessages: function(channelName) {
        var path;
        console.log("update channel messages");
        console.log("fileList.length : " + this.fileList.length);
        path = dataPath + channelName + "/" + this.fileList[this.fileList.length - this.fileListNum];
        console.log("load json data : " + path);
        $.ajax({
          type: "GET",
          url: path,
          async: false
        }).done(function(data) {
          var att, error, i, j, k, len, len1, message, messages, ref, results, unixEpoch, value;
          messages = [];
          for (i = 0, len = data.length; i < len; i++) {
            message = data[i];
            if (message.icons === void 0) {
              if (message.user === void 0) {
                message.icons = {
                  image_48: 'assets/icon/dummy.png'
                };
              } else {
                channelMessages.userData.filter(function(item, index) {
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
                channelMessages.userData.filter(function(item, index) {
                  if (item.id === message.user && item.name !== void 0) {
                    return message.username = item.name;
                  }
                });
              }
            }
            unixEpoch = String(message.ts).split(".")[0];
            message.fixedTimestamp = moment.unix(unixEpoch).format('YYYY/MM/DD hh:mm');
            try {
              message.textFixed = marked(message.text);
            } catch (_error) {
              error = _error;
              message.textFixed = "markdown parse error : " + error;
            }
            if (message.attachments !== void 0) {
              ref = message.attachments;
              for (j = 0, len1 = ref.length; j < len1; j++) {
                att = ref[j];
                try {
                  att.textFixed = marked(att.text);
                } catch (_error) {
                  error = _error;
                  att.textFixed = "markdown parse error : " + error;
                }
              }
            }
            messages.push(message);
          }
          results = [];
          for (k = messages.length - 1; k >= 0; k += -1) {
            value = messages[k];
            results.push(channelMessages.messages.unshift(value));
          }
          return results;
        });
        return console.log("update channel messages done");
      },
      onChangeChannel: function() {
        this.$set('messages', []);
        this.$set('messages_update', []);
        this.updateUserData();
        this.updateFileList(channelInfo.name);
        this.tryUpdateMessages();
        return document.documentElement.scrollTop = document.documentElement.scrollHeight;
      },
      tryUpdateMessages: function() {
        console.log('checkNeedLoad: ' + this.checkNeedLoad());
        while (this.messages.length < 15 && this.fileListNum < this.fileList.length) {
          this.updateMessages();
        }
        return this.$set('messages_update', this.messages);
      },
      updateMessages: function() {
        this.updateChannelMessages(channelInfo.name);
        this.fileListNum++;
        console.log("fileListNum: " + this.fileListNum);
        return console.log('checkNeedLoad: ' + this.checkNeedLoad());
      },
      checkNeedLoad: function() {
        return document.documentElement.scrollTop === 0;
      }
    },
    watch: {
      'messages_update': function() {
        return console.log('messages updated');
      },
      'loadMessage': function() {
        var sh;
        console.log('loadMessage: ' + this.loadMessage);
        if (this.loadMessage === true && this.fileListNum < this.fileList.length) {
          sh = document.documentElement.scrollHeight;
          this.updateMessages();
          this.$set('messages_update', this.messages);
          return document.documentElement.scrollTop = document.documentElement.scrollHeight - sh;
        }
      }
    },
    created: function() {
      return console.log("channelMessages created");
    }
  });

  document.onscroll = function() {
    return channelMessages.loadMessage = channelMessages.checkNeedLoad();
  };

}).call(this);
