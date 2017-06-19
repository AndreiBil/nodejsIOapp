var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
users = [];
connections = [];


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

/* io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
  socket.on('disconnect', function(){
      console.log('user disconnected');
    });
});

io.emit('some event', { for: 'everyone' });
io.on('connection', function(socket){
  socket.broadcast.emit('hi');
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
*/
io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // disconnect
  socket.on('disconnect', function(data){
  //  if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateusernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('disconnected: %s sockets connected', connections.length);
  });

  // Send Message
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg:data, user: socket.username});
  });

  // New User
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateusernames();
  });

  function updateusernames(){
    io.sockets.emit('get users', users);
  }

});

http.listen(3000, function(){
  console.log('Process is live..altitude is 3000 feet');
});
