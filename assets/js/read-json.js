var dataPath="data/",channelName="general/",channelList,channelMassages;channelList=new Vue({el:"#channelList",data:{channels:[]},methods:{onClick:function(n){channelMassages.channel.name=n.target.innerHTML.slice(1),console.log("channel switched : "+channelMassages.channel.name)},onLoad:function(){channelMassages.channel.name=this.channels[0].name,console.log("channel onLoad : "+channelMassages.channel.name)},updateChannelList:function(){$.getJSON(dataPath+"channels.json",function(n){for(var a=n.length,e=0;a>e;e++)channelList.channels.push(n[e]);channelList.onLoad()})}},created:function(){console.log("channelList created"),this.updateChannelList()}}),channelMassages=new Vue({el:"#channelMassages",data:{channel:{name:""},massages:[]},methods:{updateChannelMassages:function(n){var a=dataPath+n+"/2015-06-12.json";console.log("load json data : "+a),$.getJSON(a,function(n){for(var a=n.length,e=0;a>e;e++){var s=n[e];void 0===s.icons&&(s.icons={image_48:"assets/icon/dummy.png"}),channelMassages.massages.push(s)}})},changeChannel:function(){channelMassages.massages=[],this.updateChannelMassages(channelMassages.channel.name)}},watch:{"channel.name":function(){this.changeChannel()}},created:function(){console.log("channelMassages created")}});