var wss = {
	ws: window.WebSocket || window.MozWebSocket,
	socket: "",
	config: {
		msgType: "registe",
  	body: {}
	},
	sendMsg: function(msg) {
		if(!this.ws) return;
		if(this.socket.readyState == WebSocket.OPEN){
		  this.socket.send(msg);
		}else{
		  alert("WebSocket 连接没有建立成功！");
		}
	},
	sendOper: function(from, target, msg) {
		if(!this.socket) return;
		if(this.socket.readyState == WebSocket.OPEN){
			this.config.msgType = "operate";
			this.config.body.command = msg;
			this.config.body.from = from;
  		this.config.body.target = target;

			var str = JSON.stringify(this.config);
		  this.socket.send(str);
		}else{
		  alert("WebSocket 连接没有建立成功！");
		}
	},
	init: function(url, productType) {
		var _this = this;
		if(_this.ws) {
			_this.socket = new _this.ws(url)
		
			// 建立连接
			_this.socket.onopen = function(event){
				_this.config.body.productType = productType;
			  var str = JSON.stringify(_this.config);
		    _this.sendMsg(str);
			}
		} else {
			alert("您的浏览器不支持WebSocket协议！");
		}
	}
}