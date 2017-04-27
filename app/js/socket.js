// websocket
var wss = window.WebSocket || window.MozWebSocket,
		socketConfig = {
	  	type: "register",
	  	body: {
	  		from: "hud",
	  		target: "board",
	  		command: "",
	  		productType: "hud"
	  	}
	  };

if(wss){
  socket = new wss("ws://localhost:9001?userId=weukwk");
  // socket = new WebSocket("ws://114.215.135.236:7397/websocket");

  // 建立连接
  socket.onopen = function(event){
	  var str = JSON.stringify(socketConfig);
    send(str);
	}

	// 接受到消息
  socket.onmessage = function(event){
  	$(".textarea")[0].value += event.data + "\r\n";
  };

  // 关闭连接
  socket.onclose = function(event){
  	$(".textarea")[0].value += event.data + "\r\n";
  };
}else{
  alert("您的浏览器不支持WebSocket协议！");
}

// 发送消息
function send(message){
	if(!socket) return;
	if(socket.readyState == WebSocket.OPEN){
	  socket.send(message);
	}else{
	  alert("WebSocket 连接没有建立成功！");
	}
}

// 发送操作
function sendOper(message){
	if(!socket) return;
	if(socket.readyState == WebSocket.OPEN){
		socketConfig.type = "operate";
		socketConfig.body.command = message;
		var str = JSON.stringify(socketConfig);
	  socket.send(str);
	}else{
	  alert("WebSocket 连接没有建立成功！");
	}
}