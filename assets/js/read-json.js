(function(){var e,t,s,n,a;$(".sidebar").mCustomScrollbar({mouseWheel:{deltaFactor:100},autoHideScrollbar:!0}),a="data/",n="general/",t=new Vue({el:"#channelList",data:{channels:[]},methods:{onClick:function(t){return e.name=t.target.innerHTML.slice(1)},onLoad:function(){return e.name=this.channels[0].name},updateChannelList:function(){return $.getJSON(a+"channels.json",function(e){var s,n,a;for(s=0,n=e.length;n>s;s++)a=e[s],t.channels.push(a);return t.onLoad()})}},created:function(){return console.log("channelList created"),this.updateChannelList()}}),e=new Vue({el:"#channelInfo",data:{name:""},watch:{name:function(){return s.onChangeChannel()}}}),s=new Vue({el:"#channelMessages",data:{messages:[],messages_update:[],fileList:[],fileListNum:0,userData:[],loadMessage:!1},methods:{updateUserData:function(){var e;if(!(this.userData.length>0))return e=a+"users.json",console.log("load user data : "+e),$.ajax({type:"GET",url:e,async:!1}).done(function(e){return s.$set("userData",e)}),console.log("update user data done")},updateFileList:function(e){var t;return t=a+e+"/filelist.json",console.log("load channel filelist : "+t),$.ajax({type:"GET",url:t,async:!1}).done(function(e){return s.$set("fileList",e)}),console.log("update channel filelist done")},updateChannelMessages:function(e){var t;return console.log("update channel messages"),console.log("fileList.length : "+this.fileList.length),t=a+e+"/"+this.fileList[this.fileListNum],console.log("load json data : "+t),$.ajax({type:"GET",url:t,async:!1}).done(function(e){var t,n,a,o,i,l,u,r,c,d,h,g,m;for(c=[],n=0,i=e.length;i>n;n++){if(r=e[n],void 0===r.icons&&(void 0===r.user?r.icons={image_48:"assets/icon/dummy.png"}:s.userData.filter(function(e,t){return e.id===r.user?r.icons={image_48:e.profile.image_48}:void 0})),void 0===r.username&&(void 0===r.user?r.username="unknown":s.userData.filter(function(e,t){return e.id===r.user&&void 0!==e.name?r.username=e.name:void 0})),g=String(r.ts).split(".")[0],r.fixedTimestamp=moment.unix(g).format("YYYY/MM/DD hh:mm"),r.textFixed=marked(r.text),void 0!==r.attachments)for(d=r.attachments,a=0,l=d.length;l>a;a++)t=d[a],t.textFixed=marked(t.text);c.push(r)}for(h=[],o=0,u=c.length;u>o;o++)m=c[o],h.push(s.messages.push(m));return h}),console.log("update channel messages done")},onChangeChannel:function(){return this.$set("messages",[]),this.$set("messages_update",[]),this.updateUserData(),this.updateFileList(e.name),this.tryUpdateMessages()},tryUpdateMessages:function(){for(console.log("checkNeedLoad: "+this.checkNeedLoad());this.messages.length<15&&this.fileListNum<this.fileList.length;)this.updateMessages();return this.$set("messages_update",this.messages)},updateMessages:function(){return this.updateChannelMessages(e.name),this.fileListNum++,console.log("fileListNum: "+this.fileListNum),console.log("checkNeedLoad: "+this.checkNeedLoad())},checkNeedLoad:function(){var e,t,s;return s=document.documentElement.scrollTop||document.body.scrollTop,t=document.documentElement.offsetHeight||document.body.offsetHeight,e=document.documentElement.scrollHeight||document.body.scrollHeight,s+t+80>=e}},watch:{messages_update:function(){return console.log("messages updated")},loadMessage:function(){return console.log("loadMessage: "+this.loadMessage),this.loadMessage===!0&&this.fileListNum<this.fileList.length?(this.updateMessages(),this.$set("messages_update",this.messages)):void 0}},created:function(){return console.log("channelMessages created")}}),document.onscroll=function(){return s.loadMessage=s.checkNeedLoad()}}).call(this);