fs         = require 'fs'
express    = require 'express'
bodyParser = require 'body-parser'
mongodb    = require 'mongodb'

app = express()

app.use(express.static('.'))
app.use(bodyParser.json())
app.listen(8000)

data_users    = fs.readFileSync('data/users.json', 'utf-8')
data_channels = fs.readFileSync('data/channels.json', 'utf-8')

# mongodb.MongoClient.connect "mongodb://localhost:27017/slack-log-viewer", (err, database) ->
#   users = database.collection("users")
#
app.get "/api/channels", (req, res) ->
  res.contentType('application/json')
  res.send(data_channels)

app.get "/api/users", (req, res) ->
  res.contentType('application/json')
  res.send(data_users)

app.get "/api/channel/:_channelname", (req, res) ->
  path = 'data/' + req.params._channelname + '/' + 'filelist.json'
  items = fs.readFileSync(path, 'utf-8')
  res.contentType('application/json')
  res.send(items)
#   users.find().toArray (err, items) ->
#     res.send(items)
#
# app.post "/api/users", (req, res) ->
#   user = req.body
#   user._id = mongodb.ObjectID(user._id) if user._id
#   users.save user, () ->
#     res.send("insert or update")
