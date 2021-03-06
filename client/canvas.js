"use strict"

// GLOBALS
var canvas,ctx,lineWidth,strokeStyle;

var mouseInfo = {
	click: false,
	moving: false,
	pos: {x:0, y:0},
	pre_pos: false
};

//On page load
var init = function(){

	//Default Settings
	canvas = document.querySelector('#mainCanvas');
	ctx = canvas.getContext('2d');
	lineWidth = 3;
	strokeStyle = 'red';

	//Event Listeners
	canvas.onmousedown = function(e){
		mouseInfo.click = true;
	};
	canvas.onmouseup = function(e){
		mouseInfo.click = false;
	};
	canvas.onmouseout = function(e){
		mouseInfo.click = false;
	};

	canvas.onmousemove = function(e){
		mouseInfo.moving = true;
		mouseInfo.pos.x = e.pageX - e.target.offsetLeft;
		mouseInfo.pos.y = e.pageY - e.target.offsetTop;
	}

	document.querySelector("#strokeStyleChooser").onchange = function(e){
		strokeStyle = e.target.value;
	};

	document.querySelector("#lineWidthChooser").onchange = function(e){
		lineWidth = e.target.value;
	};

	//Socket Connection
	var socket = io.connect(); 

	socket.on('connect', function(){
		console.log('Connected to canvas')
	})

	socket.emit('join');

	//Recieiving lines from server
	socket.on('clientDraw', function(data){
		var line = data.line;
		ctx.beginPath();
		ctx.strokeStyle = data.strokeStyle;
		ctx.lineWidth = data.lineWidth;
		ctx.moveTo(line[0].x, line[0].y);
		ctx.lineTo(line[1].x, line[1].y);
		ctx.stroke();
	})

	//Constant loop to check if client is drawing
	//If drawing, send line info to server as an object
	var loop = function(){
		if(mouseInfo.click && mouseInfo.moving){

			socket.emit('serverDraw', {lineWidth: lineWidth, strokeStyle: strokeStyle, line: [mouseInfo.pos, mouseInfo.pre_pos]});

			mouseInfo.moving = false;

		}
		mouseInfo.pre_pos = {x: mouseInfo.pos.x, y: mouseInfo.pos.y};
		setTimeout(loop, 20);
	}
	loop();

}

window.onload = init;