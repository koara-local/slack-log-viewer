var dataPath = "data/";
var channelName = "general/";

var channelList, channelMassages;

channelList = new Vue({
    el: '#channelList',
    data: {
        channels: []
    },
    methods: {
        onClick: function(e) {
            channelMassages.channel.name = e.target.innerHTML.slice(1);
            console.log("channel switched : " + channelMassages.channel.name);
        },
        onLoad: function() {
            channelMassages.channel.name = this.channels[0].name;
            console.log("channel onLoad : " + channelMassages.channel.name);
        },
        updateChannelList: function() {
            $.getJSON(dataPath + "channels.json", function(data) {
                var len = data.length;
                for(var i = 0; i < len; i++) {
                    channelList.channels.push(data[i]);
                }

                channelList.onLoad();
            });
        }
    },
    created: function() {
        console.log("channelList created");
        this.updateChannelList();
    }
})

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
            if (this.userData.length > 0) {
                // allready updated
                return;
            }

            var path = dataPath + "users.json";
            console.log("load user data : " + path);

            $.ajax({
                type: "GET",
                url: path,
                async: false
            }).done(function(data){
                // update
                channelMassages.$set('userData', data);
            });

            console.log("update user data done");
        },
        updateFileList: function(channelName) {
            var path = dataPath + channelName + "/" + "filelist.json";
            console.log("load channel filelist : " + path);

            $.ajax({
                type: "GET",
                url: path,
                async: false
            }).done(function(data){
                // clear userdata
                channelMassages.fileList = [];
                // update
                channelMassages.fileList = data;
                console.log(data);
            });
            console.log("update channel filelist done");
        },
        updateChannelMassages: function(channelName) {
            // clear channel messages
            channelMassages.massages = [];

            console.log("fileList.length : " + this.fileList.length);
            for(var j = 0; j < this.fileList.length; j++) {
                var path = dataPath + channelName + "/" + this.fileList[j];
                console.log("load json data : " + path);

                $.ajax({
                    type: "GET",
                    url: path,
                    async: false
                }).done(function(data){
                    var len = data.length;
                    var massages = [];

                    for(var i = 0; i < len; i++) {
                        var message = data[i];

                        if (message.icons === undefined) {
                            if (message.user === undefined) {
                                // if no icon image, add dummy icon
                                message.icons = { image_48: 'assets/icon/dummy.png' };
                            } else {
                                // FIXME
                                // update user icom
                                channelMassages.userData.filter(function(item, index) {
                                    if (item.id === message.user) {
                                        message.icons = { image_48:  item.profile.image_48 };
                                    }
                                });
                            }
                        }

                        massages.push(message);
                    }

                    // update
                    for (var i = 0; i < massages.length; i++) {
                        channelMassages.massages.push(massages[i]);
                    }
                });
            }
        },
        onChangeChannel: function() {
            var channelName = channelMassages.channel.name;
            this.updateUserData();
            this.updateFileList(channelName);
            this.updateChannelMassages(channelName);
            this.$set('massages_updated', this.massages)
        }
    },
    watch: {
        'channel.name' : function() {
            this.onChangeChannel();
        },
        'massages' : function() {
            console.log('massages updated');
        }
    },
    created: function() {
        console.log("channelMassages created");
    }
})
