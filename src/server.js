var http = require('http');
var fs = require('fs');
var path = require('path');
var socketio = require('socket.io');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var fileNames = ['/client.html', '/canvas.js'];

var cachedFiles = {};

for(var i = 0; i < fileNames.length; i++) {
    var currentName = fileNames[i]; 
    cachedFiles[currentName] = fs.readFileSync(__dirname + "/../client" + fileNames[i]);
}


var onRequest = function(request, response){
	if(fileNames.indexOf(request.url) > -1) {
        response.writeHead(200);
        response.end(cachedFiles[request.url]);
    }
    else {
        response.writeHead(200);
        response.end(cachedFiles['/client.html']);
    }
}

var app = http.createServer(onRequest).listen(port);

var io = socketio(app);

var allLines = [];

var onJoined = function(socket){
    socket.on('join', function(){
        // socket.emit('clientDraw', allLines); 

/*        var keys = Object.keys(allLines);
        console.log(keys);*/

        if(allLines.length > 0){
            for(var i = 0; i < allLines.length; i++){
                socket.emit('clientDraw', allLines[i]);
            }
        }

    })

    socket.on('serverDraw', function(data){
        allLines.push(data);

        io.emit('clientDraw', data);
    });
};
    

io.sockets.on("connection", function(socket){
    onJoined(socket);
});

console.log("Listening on 127.0.0.1:" + port);