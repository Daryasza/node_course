const path = require('path');
const cors = require('cors');
const express = require('express');
const socket = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbConfig = require('./config/db.config.js');
const serverConfig = require('./config/server.config.js');

mongoose.Promise = global.Promise;

console.log(`Trying to connect to MongoDB at ${dbConfig.url}...`)
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB.");
    require('./models/socket.js').deleteMany()
      .then(() => console.log("Old sockets have been removed"))
      .catch(err => console.error(err));
})
.catch(err => {
    console.log('MongoDB connection error:\n', err);
    process.exit();
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('./public'));

require('./routes/news.js')(app);
require('./routes/user.js')(app);

app.get("/*", (_, res) => {
  res.sendFile(path.resolve(__dirname, './public', 'index.html'));
})

const server = app.listen(serverConfig.port, serverConfig.host, () => {
  console.log(`App listening on ${serverConfig.host}:${serverConfig.port}`)
});

const io = socket(server, {
  path: '/socket.io',
  allowEIO3: true,
  cors: {
    origin: 'http://34.76.206.110',
    credentials: true
  }
});

require('./sockets/gateway.js')(io);
