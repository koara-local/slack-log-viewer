(function() {
  var channelInfo, channelList, channelMassages, channelName, dataPath;

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
        return channelMassages.onChangeChannel();
      }
    }
  });

  channelMassages = new Vue({
    el: '#channelMassages',
    data: {
      massages: [],
      massages_updated: [],
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
        var path;
        console.log("update channel messages");
        console.log("fileList.length : " + this.fileList.length);
        path = dataPath + channelName + "/" + this.fileList[this.fileListNum];
        console.log("load json data : " + path);
        $.ajax({
          type: "GET",
          url: path,
          async: false
        }).done(function(data) {
          var att, i, j, k, len, len1, len2, message, messages, ref, results, unixEpoch, value;
          messages = [];
          for (i = 0, len = data.length; i < len; i++) {
            message = data[i];
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
            unixEpoch = String(message.ts).split(".")[0];
            message.fixedTimestamp = moment.unix(unixEpoch).format('YYYY/MM/DD hh:mm');
            message.textFixed = marked(message.text);
            if (message.attachments !== void 0) {
              ref = message.attachments;
              for (j = 0, len1 = ref.length; j < len1; j++) {
                att = ref[j];
                att.textFixed = marked(att.text);
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
        return console.log("update channel messages done");
      },
      onChangeChannel: function() {
        this.$set('massages', []);
        this.$set('massages_updated', []);
        this.updateUserData();
        this.updateFileList(channelInfo.name);
        return this.tryUpdateMessages();
      },
      tryUpdateMessages: function() {
        console.log('checkNeedLoad: ' + this.checkNeedLoad());
        while (this.massages.length < 15 && this.fileListNum < this.fileList.length) {
          this.updateMessages();
        }
        return this.$set('massages_updated', this.massages);
      },
      updateMessages: function() {
        this.updateChannelMassages(channelInfo.name);
        this.fileListNum++;
        console.log("fileListNum: " + this.fileListNum);
        return console.log('checkNeedLoad: ' + this.checkNeedLoad());
      },
      checkNeedLoad: function() {
        var y_height, y_offset, y_position;
        y_position = document.documentElement.scrollTop || document.body.scrollTop;
        y_offset = document.documentElement.offsetHeight || document.body.offsetHeight;
        y_height = document.documentElement.scrollHeight || document.body.scrollHeight;
        return (y_position + y_offset + 80) >= y_height;
      }
    },
    watch: {
      'massages_updated': function() {
        return console.log('massages updated');
      },
      'loadMessage': function() {
        console.log('loadMessage: ' + this.loadMessage);
        if (this.loadMessage === true && this.fileListNum < this.fileList.length) {
          this.updateMessages();
          return this.$set('massages_updated', this.massages);
        }
      }
    },
    created: function() {
      return console.log("channelMassages created");
    }
  });

  document.onscroll = function() {
    return channelMassages.loadMessage = channelMassages.checkNeedLoad();
  };

}).call(this);
