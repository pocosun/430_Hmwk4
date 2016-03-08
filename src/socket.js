var io; //our socket.io server (passed in from the app)

var configureSockets = function(socketio) {
	io = socketio; 
	
    //on new socket connections
    //new socket connection is passed in
	io.sockets.on('connection', function(socket) { 
    
        //join them all into the same socket room
        //at least for the purpose of this demo
        socket.join('livefeed');
		
        //when we receive a stream message (presumably from the person streaming only)
        //we didn't add any logic in, we are just assuming stream messages only come from the streamer
        //This will cause weird behavior if multiple try to stream
        socket.on('stream', function(buffer) {
            //broadcast the video frame to everyone else (except the streamer) 
            socket.broadcast.to('livefeed').emit("stream", buffer);
        });
        
        //when the client disconnects from the server
		socket.on('disconnect', function(data){
            //remove them from the 'livefeed' room
            socket.leave('livefeed'); 
		});
	});
};

//export our public function
module.exports.configureSockets = configureSockets;