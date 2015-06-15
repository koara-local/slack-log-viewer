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
    userData: []
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
      @massages = []
      for filename in @fileList
        path = dataPath + channelName + "/" + filename
        console.log("load json data : " + path)
        $.ajax
          type: "GET"
          url: path
          async: false
        .done (data) ->
          messages = []
          for message in data
            if message.icons == undefined
              # check & update icon
              if message.user == undefined
                # if no icon image & no user -> add dummy icon
                message.icons = { image_48: 'assets/icon/dummy.png' }
              else
                # exist user -> update user icom
                channelMassages.userData.filter (item, index) ->
                  if item.id == message.user
                    message.icons = { image_48: item.profile.image_48 }
            messages.push(message)
          # update
          for value in messages
            channelMassages.massages.push(value)
      @$set('massages_updated', @massages)
      console.log("update channel messages done")
    onChangeChannel: () ->
      channelName = @channel.name
      @updateUserData()
      @updateFileList(channelName)
      @updateChannelMassages(channelName)
  watch:
    'channel.name' : () ->
      @onChangeChannel()
    'massages' : () ->
      console.log('massages updated')
  created: () ->
    console.log("channelMassages created")