// 公共初始化js
function init(msgFrom, msgTo) {
	var fun_active = 1,
			fun_active_num = 1,
			funArr = [],
			boot_msgFrom_status = 0,
			boot_msgTo_status = 0,
			speed_status = {
				speed1: 1,
				speed3: 1,
				speed5: 1,
			},
			yellowAudio,
			yellowAudio1,
			speedTimeout,
			speedInterval;

	// 初始化容器高度
	var initWidth = function () {
		initSwiper();
	}

	initWidth();

	// 初始化轮播
	function initSwiper() {
		for(var i = 0; i < 6; i++) {
			if(i == 0) {
				funArr[i] = new Swiper ('#fun' + i, {
					effect : 'fade',
					fade: {
					  crossFade: false,
					}
				});	
			} else {
				funArr[i] = new Swiper ('#fun' + i, {
					direction: "vertical",
					effect : 'fade',
					fade: {
					  crossFade: false,
					}
			  });
			}
		}
	}

	// 初始化开机动画
	function initBoot() {
		clearInterval(speedInterval);
		clearInterval(yellowAudio);
		removeActive();
		document.querySelector(".boot-animation").style.visibility = "visible";
		document.getElementById("video").play();
		var $homeScreen = document.querySelector(".home-screen");
		$homeScreen.style.display = "block";
		wss.sendOper(msgFrom, msgTo, JSON.stringify({stop: 2}));
		funArr[0].slideTo(0, 0, false);
		funArr[1].slideTo(0, 0, false);
		
		clearTimeout(speedTimeout);
		speedTimeout = setTimeout(function(){
			document.querySelector(".boot-animation").style.visibility = "hidden";
			clearInterval(speedInterval);
			speedInterval = setInterval(function(){
				var $obj1 = document.querySelectorAll(".speed1");
				setSpeed($obj1, 40, 60, "speed1");
				var $obj3 = document.querySelectorAll(".speed3");
				setSpeed($obj3, 5, 9, "speed3");
				var $obj5 = document.querySelectorAll(".speed5");
				setSpeed($obj5, 0, 9, "speed5");
			}, 1000);
		}, 10000)
	}

	// 速度在40到60之间循环
	function setSpeed($obj, minSpeed, maxSpeed, speed) {
		var val = parseInt($obj[0].querySelector("span").innerHTML);
		var data = speed_status[speed];
		if (val == maxSpeed) {
			speed_status[speed] = -1;
		} else if (val == minSpeed) {
			speed_status[speed] = 1;
		}

		$obj.forEach(function(item){
			item.querySelector("span").innerHTML = val + speed_status[speed];
			
			if(item.querySelector("i")) {
				item.querySelector("i").style.width = (val + speed_status[speed])*0.7 + "%";
			}
		});
	}

	wss.init("ws://114.215.135.236:7397/websocket", msgFrom);

	wss.socket.onmessage = function(event) {
  	var data = JSON.parse(event.data);
		// // 开启动画
		if(data.startBoot == 1) {
			// 设置对方已准备好
			boot_msgTo_status = 1;
			if(boot_msgFrom_status == 1) {
				// 如果我已准备好，告诉对方
				wss.sendOper(msgFrom, msgTo, JSON.stringify({startBoot2: 1}));
			}
		}
		if(data.startBoot2 == 1) {
			// 设置对方准备好
			boot_msgTo_status = 1;
		}
		if(data.startBoot3 == 1) {
			// 对方知道，两方都准备好，开启动画
			initBoot();
		}

  	if(data.fun) {
	  	// var chosefun = data.fun == fun_active ? -1 : 0;
	  	if((data.fun != fun_active || data.num != fun_active_num) || data.funs == -1) {
		  	setBoardImg(data.funs, data.fun, data.num, 1);
	  	} 
  	}

  	if(data.speed) {
  		var $speed = document.getElementById("fun" + fun_active).querySelectorAll(".swiper-slide")[fun_active_num - 1].querySelector(".speed");
  		setSpeed($speed, data.speed)
  	}

  	if(data.stop) {
			var $homeScreen = document.querySelector(".home-screen");
  		if(data.stop == 1) {
  			funArr[0].slideTo(0, 0, false);
				funArr[1].slideTo(0, 0, false);
				clearInterval(yellowAudio);
				$homeScreen.style.display = "block";
  		} else if(data.stop == 2) {
  			funArr[0].slideTo(0, 0, false);
				funArr[1].slideTo(0, 0, false);
  			$homeScreen.style.display = "block";
  		} else {
  			$homeScreen.style.display = "none";
  		}
  	}

  	// 音频
  	if(data.audio) {
  		document.querySelector(data.audio).play();
  	}
  };

  wss.socket.onclose = function(event) {
  	console.log(event);
  };

  wss.socket.onclose = function(event) {
  	console.log("链接已断开");
  };

	var setBoardImg = function(funs, fun, num, others) {
		removeActive();
		clearInterval(yellowAudio);
		clearTimeout(yellowAudio1);
		// 关掉待机画面
		var $homeScreen = document.querySelector(".home-screen");
		$homeScreen.style.display = "none";
		wss.sendOper(msgFrom, msgTo, JSON.stringify({stop: 3}));
		// end

		// 功能4 特殊处理
		if (fun != 4) {
			if(msgFrom == "board") {
				document.querySelector(".board4-1").className = document.querySelector(".board4-1").className.replace(/active/g, "")
				document.querySelector(".board4-2").className = document.querySelector(".board4-2").className.replace(/active/g, "")
			} else {
				document.querySelector(".hud4-1").className = document.querySelector(".hud4-1").className.replace(/active/g, "")
				document.querySelector(".hud4-2").className = document.querySelector(".hud4-2").className.replace(/active/g, "")
			}
		} else {
			if(msgFrom == "board") {
				document.querySelector(".board4-1").className = document.querySelector(".board4-1").className.replace(/active/g, "")
				document.querySelector(".board4-2").className = document.querySelector(".board4-2").className.replace(/active/g, "")
			} else {
				document.querySelector(".hud4-1").className = document.querySelector(".hud4-1").className.replace(/active/g, "")
				document.querySelector(".hud4-2").className = document.querySelector(".hud4-2").className.replace(/active/g, "")
			}
		}
		// end
		
		if(fun_active != 5 || num != 2) {
			if(msgFrom == "board") {
				document.querySelector(".board5-2").className = document.querySelector(".board5-2").className.replace(/active/g, "");
			} else {
				document.querySelector(".hud5-2").className = document.querySelector(".hud5-2").className.replace(/active/g, "");
			}
		}

		if(fun == 5 && num != 2) {
			if(msgFrom == "board") {
				document.querySelector(".board5-1 .center").className = document.querySelector(".board5-1 .center").className + " active";
				clearTimeout(yellowAudio1);
				yellowAudio1 = setTimeout(function(){
					document.querySelector(".red-audio").play();
					setTimeout(function(){
						document.querySelector(".yellow-audio").play();
					},1000);
					clearInterval(yellowAudio);
					yellowAudio = setInterval(function(){
						document.querySelector(".red-audio").play();
						setTimeout(function(){
							document.querySelector(".yellow-audio").play();
						},1000);
					}, 3000);
				}, 0);
			} else {
				document.querySelector(".hud5-1 .center").className = document.querySelector(".hud5-1 .center").className + " active";
			}
		} else {
			if(msgFrom == "board") {
				document.querySelector(".board5-1 .center").className = document.querySelector(".board5-1 .center").className.replace(/active/g, "");
				clearInterval(yellowAudio);
			} else {
				document.querySelector(".hud5-1 .center").className = document.querySelector(".hud5-1 .center").className.replace(/active/g, "");
			}
		}

		if(fun == 3) {
			if(msgFrom == "board") {
				document.querySelector(".board3-1 .center").className = document.querySelector(".board3-1 .center").className + " active";
				clearTimeout(yellowAudio1);
				yellowAudio1 = setTimeout(function(){
					document.querySelector(".yellow-audio").play();
					setTimeout(function(){
						document.querySelector(".red-audio").play();
					},1000);
					clearInterval(yellowAudio);
					yellowAudio = setInterval(function(){
						document.querySelector(".yellow-audio").play();
						setTimeout(function(){
							document.querySelector(".red-audio").play();
						},1000);
					}, 3000);
				}, 1000);
				
			} else {
				document.querySelector(".hud3-1 .center").className = document.querySelector(".hud3-1 .center").className + " active";
			}
		} else {
			if(msgFrom == "board") {
				document.querySelector(".board3-1 .center").className = document.querySelector(".board3-1 .center").className.replace(/active/g, "");
				clearInterval(yellowAudio);
			} else {
				document.querySelector(".hud3-1 .center").className = document.querySelector(".hud3-1 .center").className.replace(/active/g, "");
			}
		}
		
		if(funs != 0) {
			if(num == 2) {
				if(fun_active == 1) {
					if(msgFrom == "board") {
						document.querySelector(".board1-2").className = document.querySelector(".board1-2").className + " active"
					} else if (msgFrom == "hud") {
						document.querySelector(".hud1-2").className = document.querySelector(".hud1-2").className + " active"
					}
				}

				if (fun_active == 4) {
					if(msgFrom == "board") {
						playAudio(".board4-2 audio");
						document.querySelector(".board4-1").className = document.querySelector(".board4-1").className.replace(/active/g, "");
						document.querySelector(".board4-2").className = document.querySelector(".board4-2").className + " active";
					} else {
						document.querySelector(".hud4-1").className = document.querySelector(".hud4-1").className.replace(/active/g, "");
						document.querySelector(".hud4-2").className = document.querySelector(".hud4-2").className + " active";
					}
				}

				if (fun_active == 5) {
					if(msgFrom == "board") {
						document.querySelector(".board5-2").className = document.querySelector(".board5-2").className + " active";
					} else {
						document.querySelector(".hud5-2").className = document.querySelector(".hud5-2").className + " active";
					}
				}
			} else {
				if(fun_active == 1) {
					if(msgFrom == "board") {
						document.querySelector(".board1-2").className = document.querySelector(".board1-2").className.replace(/active/g, "")
					} else if (msgFrom == "hud") {
						document.querySelector(".hud1-2").className = document.querySelector(".hud1-2").className.replace(/active/g, "")
					}
				}

				if (fun_active == 4) {
					playAudio(".board4-1 audio");
					if(msgFrom == "board") {
						document.querySelector(".board4-1").className = document.querySelector(".board4-1").className + " active";
					} else {
						document.querySelector(".hud4-1").className = document.querySelector(".hud4-1").className + " active";
					}
				}
			}
		}

		if(funs == 0) {
			funArr[fun].slideTo(0, 0, false);
			funArr[0].slideTo(fun - 1, 1000, false);
			fun_active = fun;
		} else {
			fun_active_num = num;
			funArr[fun].slideTo(num - 1, 1000, false);
		}

		var sendData = {
			funs: funs,
			fun: fun,
			num: num
		};
		if (others != 1) {
			wss.sendOper(msgFrom, msgTo, JSON.stringify(sendData));
		}
	};

	var playAudio = function(objStr) {
		if(msgFrom == "board") {
			document.querySelector(objStr).play();
		} else {
			wss.sendOper(msgFrom, msgTo, JSON.stringify({audio: objStr}));
		}
	}

	// 清楚所有js加的class
	function removeActive() {
		var $active = document.querySelectorAll(".active");
		$active.forEach(function(item){
			item.className = item.className.replace(/active/g, "");
		});
	}

	// 键盘按键事件
  document.onkeydown = function(event) {
		var e = event || window.event || arguments.callee.caller.arguments[0];
		removeActive();
		// 待机画面
		if(e && e.keyCode == 48) { // 0 待机画面
			var $obj = document.querySelector(".home-screen");
			$obj.style.display ="block";
			clearInterval(yellowAudio);
			funArr[0].slideTo(0, 0, false);
			funArr[1].slideTo(0, 0, false);
			wss.sendOper(msgFrom, msgTo, JSON.stringify({stop: 1}));
		}

		if(e && e.keyCode == 49) { // 功能1 
			fun_active = 1;
			setBoardImg(0, fun_active, 1, 0);
		} else if(e && e.keyCode == 50) { // 功能2
			playAudio(".board2-1 video");
			fun_active = 2;
			setBoardImg(0, fun_active, 1, 0);
		} else if(e && e.keyCode == 51) { // 功能3
			fun_active = 3;
			setBoardImg(0, fun_active, 1, 0);
		} else if(e && e.keyCode == 52) { // 功能4
			fun_active = 4;
			setBoardImg(0, fun_active, 1, 0);
		} else if(e && e.keyCode == 53) { // 功能5
			fun_active = 5;
			setBoardImg(0, fun_active, 1, 0);
		} else if(e && e.keyCode == 65) { // a
			if(fun_active == 4) {
				playAudio(".board4-1 audio");
			}
			
			if (fun_active == 2) {
				playAudio(".board2-1 video");
			}

			fun_active_num = 1;
			setBoardImg(-1, fun_active, fun_active_num, 0);
		} else if(e && e.keyCode == 83) { // s
			if(fun_active == 1) {
				playAudio(".board1-2 audio");
			}
			if(fun_active == 4) {
				playAudio(".board4-2 audio");
			}
			if (fun_active == 5) {
				playAudio(".board5-2 audio");
			}

			fun_active_num = 2;
			setBoardImg(-1, fun_active, fun_active_num, 0);
		} else if(e && e.keyCode == 13){ // enter键 是否全屏
			if(setFullScreen.isFullScreen()) {
				setFullScreen.exitFullScreen();
			} else {
				if(boot_msgFrom_status == 0) {
					boot_msgFrom_status = 1;
					wss.sendOper(msgFrom, msgTo, JSON.stringify({startBoot: 1}));
				}
				setFullScreen.launchFullScreen(document.body);
			}
		} else if(e && e.keyCode == 87){ // w键 是否全屏
			// 开启动画
			if(boot_msgFrom_status == 1 && boot_msgTo_status == 1) {
				initBoot();
				wss.sendOper(msgFrom, msgTo, JSON.stringify({startBoot3: 1}));
			}
		}
	};
}