//Basic imports and vars
var http = require('http');
var fs = require('fs');
var path = require('path');
var socketio = require('socket.io');
var allLines = [];

//Create Port
var port = process.env.PORT || process.env.NODE_PORT || 3000;

//Bring in client files
var fileNames = ['/client.html', '/canvas.js'];


//Store Client files for easy access
var cachedFiles = {};
for(var i = 0; i < fileNames.length; i++) {
    var currentName = fileNames[i]; 
    cachedFiles[currentName] = fs.readFileSync(__dirname + "/../client" + fileNames[i]);
}

//URL request fucntion
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

//What to do onJoin
var onJoined = function(socket){
    socket.on('join', function(){

        //Send all lines on current canvas
        if(allLines.length > 0){
            for(var i = 0; i < allLines.length; i++){
                socket.emit('clientDraw', allLines[i]);
            }
        }

    })

    //Recieving lines from client canvas
    //Update allLines array and push line to all current clients
    socket.on('serverDraw', function(data){
        allLines.push(data);

        io.emit('clientDraw', data);
    });
};
    
//Listen for connections on ports
var app = http.createServer(onRequest).listen(port);

var io = socketio(app);

io.sockets.on("connection", function(socket){
    onJoined(socket);
});


console.log("Listening on 127.0.0.1:" + port);