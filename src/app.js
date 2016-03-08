//import modules
var http = require('http'); //http hosting 
var path = require('path'); //file system path library
var fs = require('fs'); //file system I/O library
var socketio = require('socket.io'); //require socket.io
//var sockets = require('./socket.js'); //pull in our custom socket module

//process.env lines for heroku or other hosting services
var port = process.env.PORT || process.env.NODE_PORT || 20000; 

//Filenames to load into memory. We will automatically assume for this is example that these are in our /client folder
var fileNames = ['/client.html', '/canvas.js'];

//object to store our files in memory by key. We will load all of these files into memory to cache them
//Then we will serve our files from here.
var cachedFiles = {};

//synchronously load each client file into memory so that we know they are cached before starting the server
//Otherwise there might be errors if a user tries to access a file that isn't loaded yet.
/**ONLY DO SYNCHRONOUS OPERATIONS ON STARTUP & SHUTDOWN. DOING SYNCH OPERATIONS DURING NORMAL SERVER OPERATION WILL DESTROY PERFORMANCE **/
for(var i = 0; i < fileNames.length; i++) {
    var currentName = fileNames[i]; //current file name
    /** SEE ABOVE COMMENT ON SYNCHRONOUS OPERATIONS **/
    //load the file into memory and cache the buffer into our cached file object under the same name
    cachedFiles[currentName] = fs.readFileSync(__dirname + "/../client/" + fileNames[i]);
}

//our HTTP request callback
var onRequest = function(req, res) {
    if(fileNames.indexOf(req.url) > -1) {
        res.writeHead(200); //200 status okay
        res.end(cachedFiles[req.url]); //return the requested file
    }
    else {
        res.writeHead(200); //200 status okay
        res.end(cachedFiles['/client.html']); //send back our viewer.html
    }
};

//Start our HTTP server and get the server reference
var server = http.createServer(onRequest).listen(port); 

//start a socket io server and pass in our HTTP server so socket.io can host itself on the same port
var io = socketio.listen(server);

//sockets.configureSockets(io);

console.log('started on port ' + port);