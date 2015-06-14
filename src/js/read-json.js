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
        massages: []
    },
    methods: {
        updateChannelMassages: function(channelname) {
            var path = dataPath + channelname + "/" + "2015-06-12.json";
            console.log("load json data : " + path);

            $.getJSON(path, function(data) {
                var len = data.length;
                var massages = [];

                for(var i = 0; i < len; i++) {
                    var message = data[i];

                    // if no icon image, add dummy icon
                    if (message.icons === undefined) {
                        message.icons = { image_48: 'assets/icon/dummy.png' };
                    }

                    massages.push(message);
                }

                // clear channel messages
                channelMassages.massages = [];
                // update
                channelMassages.massages = massages;
            });
        },
        onChangeChannel: function() {
            this.updateChannelMassages(channelMassages.channel.name);
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
