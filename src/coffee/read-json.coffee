$(".sidebar").mCustomScrollbar 
  mouseWheel:
    deltaFactor: 100
  autoHideScrollbar: true

dataPath    = "data/"
channelName = "general/"

channelList = new Vue
  el: '#channelList'
  data:
    channels: []
  methods:
    onClick: (e) ->
      channelInfo.name = e.target.innerHTML.slice(1)
    onLoad: () ->
      channelInfo.name = @channels[0].name
    updateChannelList: () ->
      $.getJSON dataPath + "channels.json", (data) ->
        for value in data
          channelList.channels.push(value)
        channelList.onLoad()
  created: () ->
    console.log("channelList created")
    @updateChannelList()

channelInfo = new Vue
  el: '#channelInfo'
  data:
    name: ''
  watch:
    'name' : () ->
      channelMessages.onChangeChannel()

channelMessages = new Vue
  el: '#channelMessages'
  data:
    messages: []
    messages_update: []
    fileList: []
    fileListNum: 0
    userData: []
    loadMessage: false
  methods:
    updateUserData: () ->
      if @userData.length > 0
        # allready updated
        return
      path = dataPath + "users.json"
      console.log("load user data : " + path)
      $.ajax
        type: "GET"
        url: path
        async: false
      .done (data) ->
        # update
        channelMessages.$set('userData', data)
      console.log("update user data done")
    updateFileList: (channelName) ->
      path = dataPath + channelName + "/" + "filelist.json"
      console.log("load channel filelist : " + path)
      $.ajax
        type: "GET"
        url: path
        async: false
      .done (data) ->
        # update
        channelMessages.$set('fileList', data)
      console.log("update channel filelist done")
    updateChannelMessages: (channelName) ->
      console.log("update channel messages")
      console.log("fileList.length : " + @fileList.length)
      path = dataPath + channelName + "/" + @fileList[@fileList.length - @fileListNum]
      console.log("load json data : " + path)
      $.ajax
        type: "GET"
        url: path
        async: false
      .done (data) ->
        messages = []
        for message in data
          # !! fix icon
          if message.icons == undefined
            if message.user == undefined
              # if no icon image & no user -> add dummy icon
              message.icons = { image_48: 'assets/icon/dummy.png' }
            else
              # exist user -> update user icom
              channelMessages.userData.filter (item, index) ->
                if item.id == message.user
                  message.icons = { image_48: item.profile.image_48 }
          # !! fix username
          if message.username == undefined
            # check & update name
            if message.user == undefined
              # if no user
              # FIXME
              message.username = 'unknown' 
            else
              # exist user -> update user.name
              channelMessages.userData.filter (item, index) ->
                if item.id == message.user && item.name != undefined
                    message.username = item.name
          # !! fix timestamp
          unixEpoch = String(message.ts).split(".")[0]
          message.fixedTimestamp =
            moment.unix(unixEpoch).format('YYYY/MM/DD hh:mm')
          # !! fix text
          try
            message.textFixed = marked(message.text)
          catch error
            message.textFixed = "markdown parse error : " + error
          if message.attachments != undefined
            for att in message.attachments
              try
                att.textFixed = marked(att.text)
              catch error
                att.textFixed = "markdown parse error : " + error
          messages.push(message)
        # update
        for value in messages by -1
          channelMessages.messages.unshift(value)
      console.log("update channel messages done")
    onChangeChannel: () ->
      @$set('messages', [])
      @$set('messages_update', [])
      @updateUserData()
      @updateFileList(channelInfo.name)
      @tryUpdateMessages()
      document.documentElement.scrollTop = document.documentElement.scrollHeight
    tryUpdateMessages: () ->
      console.log('checkNeedLoad: ' + @checkNeedLoad())
      while @messages.length < 15 && @fileListNum < @fileList.length
        @updateMessages()
      @$set('messages_update', @messages)
    updateMessages: () ->
      @updateChannelMessages(channelInfo.name)
      @fileListNum++
      console.log("fileListNum: " + @fileListNum)
      console.log('checkNeedLoad: ' + @checkNeedLoad())
    checkNeedLoad: () ->
      return document.documentElement.scrollTop == 0
  watch:
    'messages_update' : () ->
      console.log('messages updated')
    'loadMessage' : () ->
      console.log('loadMessage: ' + @loadMessage)
      if @loadMessage == true && @fileListNum < @fileList.length
        sh = document.documentElement.scrollHeight
        @updateMessages()
        @$set('messages_update', @messages)
        document.documentElement.scrollTop = document.documentElement.scrollHeight - sh
  created: () ->
    console.log("channelMessages created")

document.onscroll = () ->
  channelMessages.loadMessage = channelMessages.checkNeedLoad()
