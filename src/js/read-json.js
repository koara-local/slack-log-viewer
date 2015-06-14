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
        updateChannelList: function() {
            $.getJSON(dataPath + "channels.json", function(data) {
                var len = data.length;
                for(var i = 0; i < len; i++) {
                    channelList.channels.push(data[i]);
                }
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
        massages: []
    },
    methods: {
        updateChannelMassages: function() {
            var path = dataPath + channelMassages.channel.name + "/" + "2015-06-12.json";
            console.log("load json data : " + path);

            $.getJSON(path, function(data) {
                var len = data.length;
                for(var i = 0; i < len; i++) {
                    var message = data[i];

                    // if no icon image, add dummy icon
                    if (message.icons === undefined) {
                        message.icons = { image_48: 'assets/icon/dummy.png' };
                    }

                    channelMassages.massages.push(message);
                }
            });

        },
        changeChannel: function() {
            // clear channel messages
            channelMassages.massages = [];
            this.updateChannelMassages();
        }
    },
    watch: {
        'channel.name' : function() {
            this.changeChannel();
        }
    },
    created: function() {
        console.log("channelMassages created");
    }
})
