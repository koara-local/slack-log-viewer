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
      channelMassages.channel.name = e.target.innerHTML.slice(1)
      console.log("channel switched : " + channelMassages.channel.name)
    onLoad: () ->
      channelMassages.channel.name = @channels[0].name
      console.log("channel onLoad : " + channelMassages.channel.name)
    updateChannelList: () ->
      $.getJSON dataPath + "channels.json", (data) ->
        for value in data
          channelList.channels.push(value)
        channelList.onLoad()
  created: () ->
    console.log("channelList created")
    @updateChannelList()

channelMassages = new Vue
  el: '#channelMassages'
  data:
    channel:
      name: ''
    massages: []
    massages_updated: []
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
        channelMassages.$set('userData', data)
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
        channelMassages.$set('fileList', data)
      console.log("update channel filelist done")
    updateChannelMassages: (channelName) ->
      console.log("update channel messages")
      console.log("fileList.length : " + @fileList.length)
      path = dataPath + channelName + "/" + @fileList[@fileListNum]
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
              channelMassages.userData.filter (item, index) ->
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
              channelMassages.userData.filter (item, index) ->
                if item.id == message.user && item.name != undefined
                    message.username = item.name
          # !! fix timestamp
          unixEpoch = String(message.ts).split(".")[0]
          message.fixedTimestamp =
            moment.unix(unixEpoch).format('YYYY/MM/DD hh:mm')
          # !! fix text
          message.textFixed = marked(message.text)
          if message.attachments != undefined
            for att in message.attachments
              att.textFixed = marked(att.text)
          messages.push(message)
        # update
        for value in messages
          channelMassages.massages.push(value)
      console.log("update channel messages done")
    onChangeChannel: () ->
      @$set('massages', [])
      @$set('massages_updated', [])
      @updateUserData()
      @updateFileList(@channel.name)
      @tryUpdateMessages()
    tryUpdateMessages: () ->
      console.log('checkNeedLoad: ' + @checkNeedLoad())
      while @massages.length < 15 && @fileListNum < @fileList.length
        @updateMessages()
      @$set('massages_updated', @massages)
    updateMessages: () ->
      @updateChannelMassages(@channel.name)
      @fileListNum++
      console.log("fileListNum: " + @fileListNum)
      console.log('checkNeedLoad: ' + @checkNeedLoad())
    checkNeedLoad: () ->
      y_position = document.documentElement.scrollTop || document.body.scrollTop
      y_offset   = document.documentElement.offsetHeight || document.body.offsetHeight
      y_height   = document.documentElement.scrollHeight || document.body.scrollHeight
      return (y_position + y_offset + 80) >= y_height
  watch:
    'channel.name' : () ->
      @onChangeChannel()
    'massages_updated' : () ->
      console.log('massages updated')
    'loadMessage' : () ->
      console.log('loadMessage: ' + @loadMessage)
      if @loadMessage == true && @fileListNum < @fileList.length
        @updateMessages()
        @$set('massages_updated', @massages)
  created: () ->
    console.log("channelMassages created")

document.onscroll = () ->
  channelMassages.loadMessage = channelMassages.checkNeedLoad()
