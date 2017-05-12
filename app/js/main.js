// 公共初始化js
function init(msgFrom, msgTo) {
	var fun_active = 1,
			fun_active_num = 1,
			funArr = [],
			boot_status = 0;

	// 初始化容器高度
	var initWidth = function () {
		var bodyW = document.body.clientWidth;
		if(msgFrom == "board") {
			if(bodyW > 1280) {
				document.querySelector(".board").style.height = 1280 * 0.625 + "px";
			} else if(bodyW > 320) {
				document.querySelector(".board").style.height = bodyW * 0.625 + "px";
			} else {
				document.querySelector(".board").style.height = 320 * 0.625 + "px";
			}
		} else {
			if(bodyW > 1280) {
				document.querySelector(".hud").style.height = 1280 * 0.26 + "px";
			} else if(bodyW > 320) {
				document.querySelector(".hud").style.height = bodyW * 0.26 + "px";
			} else {
				document.querySelector(".hud").style.height = 320 * 0.26 + "px";
			}
		}

		initSwiper();
	}

	initWidth();

	// 初始化轮播
	function initSwiper() {
		for(var i = 0; i < 6; i++) {
			if(i == 0) {
				funArr[i] = new Swiper ('#fun' + i, {
					effect : 'fade',
				});	
			} else {
				funArr[i] = new Swiper ('#fun' + i, {
					direction: "vertical",
					effect : 'fade',
			  });
			}
		}
	}

	// 初始化开机动画
	function initBoot() {
		document.getElementById("video").play();
			
		setTimeout(function(){
			document.querySelector(".boot-animation").style.display = "none"
		}, 3000)
	}

	wss.init("ws://114.215.135.236:7397/websocket", msgFrom);

	wss.socket.onmessage = function(event) {
  	var data = JSON.parse(event.data);
		// 开启动画
		if(data.startBoot && boot_status == 1) {
			initBoot();
			wss.sendOper(msgFrom, msgTo, JSON.stringify({startBoot2: 1}));
		}

		if(data.startBoot2 && boot_status == 1) {
			initBoot();
		}

  	if(data.fun) {
	  	var chosefun = data.fun == fun_active ? -1 : 0;
	  	if(data.fun != fun_active || data.num != fun_active_num) {
		  	setBoardImg(chosefun, data.fun, data.num);
	  	}
  	}

  	if(data.speed) {
  		var $speed = document.getElementById("fun" + fun_active).querySelectorAll(".swiper-slide")[fun_active_num - 1].querySelector(".speed");
  		setSpeed($speed, data.speed)
  	}

  	if(data.stop) {
  		var $obj = document.querySelector(".home-screen");
			$obj.style.display = $obj.style.display == "block" ? "none" : "block";
  	}
  };

  wss.socket.onclose = function(event) {
  	console.log(event);
  };

  wss.socket.onclose = function(event) {
  	console.log("链接已断开");
  };

	var setBoardImg = function(funs, fun, num) {
		if(funs == 0) {
			funArr[fun].slideTo(0, 0, false);
			funArr[0].slideTo(fun - 1, 1000, false);
			fun_active = fun;
		} else {
			fun_active_num = num;
			funArr[fun].slideTo(num - 1, 1000, false);
		}
		var sendData = {
			fun: fun,
			num: num
		};

		wss.sendOper(msgFrom, msgTo, JSON.stringify(sendData));
	};

	var setSpeed = function($obj, data) {
		// $obj 对象，up是否加
		var val = parseInt($obj.querySelector("span").innerHTML);
		if((data == 1 && val < 100) || (data == -1 && val > 0)) {
			$obj.querySelector("span").innerHTML = val + data;
			if($obj.querySelector("i")) {
				$obj.querySelector("i").style.width = (val + data) + "%";
			}
		}
	}

	// 键盘按键事件
  document.onkeydown = function(event) {
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if(e && e.keyCode == 49) { // 功能1 
			fun_active = 1;
			setBoardImg(0, fun_active, 1);
		} else if(e && e.keyCode == 50) { // 功能2
			fun_active = 2;
			setBoardImg(0, fun_active, 1);
		} else if(e && e.keyCode == 51) { // 功能3
			fun_active = 3;
			setBoardImg(0, fun_active, 1);
		} else if(e && e.keyCode == 52) { // 功能4
			fun_active = 4;
			setBoardImg(0, fun_active, 1);
		} else if(e && e.keyCode == 53) { // 功能5
			fun_active = 5;
			setBoardImg(0, fun_active, 1);
		} else if(e && e.keyCode == 65) { // a
			fun_active_num = 1;
			setBoardImg(-1, fun_active, fun_active_num);
		} else if(e && e.keyCode == 66) { // b
			fun_active_num = 2;
			setBoardImg(-1, fun_active, fun_active_num);
		} else if(e && e.keyCode == 13){ // enter键 是否全屏
			if(setFullScreen.isFullScreen()) {
				setFullScreen.exitFullScreen();
			} else {
				if(boot_status == 0) {
					boot_status = 1;
					wss.sendOper(msgFrom, msgTo, JSON.stringify({startBoot: 1}));
				}
				setFullScreen.launchFullScreen(document.body);
			}
		} else if(e && e.keyCode == 38) { // up 加速
			var $speed = document.getElementById("fun" + fun_active).querySelectorAll(".swiper-slide")[fun_active_num - 1].querySelector(".speed");
			setSpeed($speed, 1);
			wss.sendOper(msgFrom, msgTo, JSON.stringify({speed: 1}));
		} else if(e && e.keyCode == 40) { // down 减速
			var $speed = document.getElementById("fun" + fun_active).querySelectorAll(".swiper-slide")[fun_active_num - 1].querySelector(".speed");
			setSpeed($speed, -1);
			wss.sendOper(msgFrom, msgTo, JSON.stringify({speed: -1}));
		} else if(e && e.keyCode == 48) { // 0 待机画面
			var $obj = document.querySelector(".home-screen");
			$obj.style.display = $obj.style.display == "block" ? "none" : "block";
			wss.sendOper(msgFrom, msgTo, JSON.stringify({stop: 1}));
		}
	};
}