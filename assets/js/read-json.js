var dataPath="data/",channelName="general/",channelList,channelMassages;channelList=new Vue({el:"#channelList",data:{channels:[]},methods:{onClick:function(a){channelMassages.channel.name=a.target.innerHTML.slice(1),console.log("channel switched : "+channelMassages.channel.name)},onLoad:function(){channelMassages.channel.name=this.channels[0].name,console.log("channel onLoad : "+channelMassages.channel.name)},updateChannelList:function(){$.getJSON(dataPath+"channels.json",function(a){for(var n=a.length,e=0;n>e;e++)channelList.channels.push(a[e]);channelList.onLoad()})}},created:function(){console.log("channelList created"),this.updateChannelList()}}),channelMassages=new Vue({el:"#channelMassages",data:{channel:{name:""},massages:[],fileList:[],userData:[]},methods:{updateUserData:function(){var a=dataPath+"users.json";console.log("load user data : "+a),$.ajax({type:"GET",url:a,async:!1}).done(function(a){channelMassages.userData=[],channelMassages.userData=a,console.log(a)}),console.log("update user data done")},updateFileList:function(a){var n=dataPath+a+"/filelist.json";console.log("load channel filelist : "+n),$.ajax({type:"GET",url:n,async:!1}).done(function(a){channelMassages.fileList=[],channelMassages.fileList=a,console.log(a)}),console.log("update channel filelist done")},updateChannelMassages:function(a){channelMassages.massages=[],console.log("fileList.length : "+this.fileList.length);for(var n=0;n<this.fileList.length;n++){var e=dataPath+a+"/"+this.fileList[n];console.log("load json data : "+e),$.ajax({type:"GET",url:e,async:!1}).done(function(a){for(var n=a.length,e=[],s=0;n>s;s++){var l=a[s];void 0===l.icons&&(void 0===l.user?l.icons={image_48:"assets/icon/dummy.png"}:channelMassages.userData.filter(function(a,n){a.id===l.user&&(l.icons={image_48:a.profile.image_48})})),e.push(l)}for(var s=0;s<e.length;s++)channelMassages.massages.push(e[s])})}},onChangeChannel:function(){var a=channelMassages.channel.name;this.updateUserData(),this.updateFileList(a),this.updateChannelMassages(a),this.$set("massages_updated",this.massages)}},watch:{"channel.name":function(){this.onChangeChannel()},massages:function(){console.log("massages updated")}},created:function(){console.log("channelMassages created")}});