var dataPath="data/",channelName="general/",channelList,channelMassages;channelList=new Vue({el:"#channelList",data:{channels:[]},methods:{onClick:function(a){channelMassages.channel.name=a.target.innerHTML.slice(1),console.log(channelMassages.channel.name)}},created:function(){$.getJSON(dataPath+"channels.json",function(a){for(var n=a.length,e=0;n>e;e++)channelList.channels.push(a[e])})}}),channelMassages=new Vue({el:"#channelMassages",data:{channel:{name:""},massages:[]},watch:{"channel.name":function(){var a=dataPath+channelMassages.channel.name+"/2015-06-12.json";console.log(a),channelMassages.massages=[],$.getJSON(a,function(a){for(var n=a.length,e=0;n>e;e++){var s=a[e];void 0===s.icons&&(s.icons={image_48:"assets/icon/dummy.png"}),channelMassages.massages.push(s)}})}}});