// 公共初始化js
function init(msgFrom, msgTo) {
	var boot_msgFrom_status = 0,
			boot_msgTo_status = 0,
			status = false,
			audioStatus = false,
			mySwiper,
			stayTime = 10000,
			timeObj = {
				fun1: {
					frameInit: 0,
					frameA: stayTime,
					frameS: stayTime
				},
				fun2: {
					frameInit: 0,
					frameA: stayTime + 5000,
					frameS: stayTime + 5000
				},
				fun3: {
					frameInit: 0,
					frameA: stayTime,
					frameS: stayTime
				},
				fun4: {
					frameInit: stayTime,
					frameA: stayTime,
					frameS: stayTime
				},
				fun5: {
					frameInit: 0,
					frameA: stayTime,
					frameS: stayTime
				}
			},
			frameInitTimeout,
			frameATimeout,
			frameBTimeout,
			yellowAudioTimeout,
			yellowAudioInterval,
			speedTimeout,
			speedInterval,
			speed_status = {
				speed1: 1,
				speed3: 1,
				speed5: 1,
			};
	
	

	wss.init("ws://114.215.135.236:7397/websocket", msgFrom);

	wss.socket.onmessage = function(event) {
  	var data = JSON.parse(event.data);
  	console.log(data, event)
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
		// 开启end
		if(data.stopBoot == 1) {
			mySwiper.stopAutoplay();
		}
  }

  wss.socket.onclose = function(event) {
  	console.log(event);
  };

  wss.socket.onclose = function(event) {
  	console.log("链接已断开");
  };

	// 初始化轮播
	function initSwiper() {
		mySwiper = new Swiper ('.swiper-container', {
			effect : 'fade',
			fade: {
			  crossFade: false,
			},
			autoplay: 6000,
			loop: true,
			onSlideNextStart: function(swiper) {
				var num = swiper.realIndex - 1,
						$boardImg = swiper.slides[swiper.activeIndex].querySelector("." + msgFrom + "-img"),
						$boardImgInit = swiper.slides[swiper.activeIndex - 1].querySelector("." + msgFrom + "-img");
				if(num == -1 && status ) {
					document.querySelectorAll("." + msgFrom + "5").forEach(function(item){
						item.className = item.className.replace(/active-s/g, "");
					});
					$boardImg.querySelector("video").play();
				}
				if(num > 0) {
					frameChange(num,$boardImg, $boardImgInit);					
				}
			}
		});
		// mySwiper.stopAutoplay();
	}

	// 页面切换
	function frameChange(ind, $obj, $objInit) {
		$objInit.className = $objInit.className.replace(/active-s/g, "");
		clearTimeout(frameInitTimeout);
		if(ind == 4 && audioStatus) {
			clearTimeout(yellowAudioTimeout);
			clearInterval(yellowAudioInterval);
		}
		frameInitTimeout = setTimeout(function(){
			if(ind == 2 && audioStatus) {
				$obj.querySelector("video").play();
			} else if (ind == 4 && audioStatus) {
				$obj.querySelector(".audio4-1").play();
			} if (ind == 3 && audioStatus) {
				rayAudio(1000, 1000, 3);
			} else if (ind == 5 && audioStatus) {
				rayAudio(0, 1000, 3);
			}
			$obj.className = $obj.className + " active-a";
			clearTimeout(frameATimeout);
			frameATimeout = setTimeout(function(){
				$obj.className = $obj.className.replace(/active-a/g, "active-s");
				if(ind == 1 && audioStatus) {
					$obj.querySelector("audio").play();
				} else if (ind == 4 && audioStatus) {
					$obj.querySelector(".audio4-2").play();
				} else if(ind == 5 && audioStatus) {
					clearTimeout(yellowAudioTimeout);
					clearTimeout(yellowAudioInterval);
					$obj.querySelector("audio").play();
				}
			}, timeObj["fun" + ind].frameA);
		}, timeObj["fun" + ind].frameInit);
	}

	// 速度在minSpeed到maxSpeed之间循环
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

	// 雷达红色和黄色声音切换
	function rayAudio(outTime, speedTime, num){
		clearTimeout(yellowAudioTimeout);
		yellowAudioTimeout = setTimeout(function(){
			document.querySelector(".red-audio").play();
			setTimeout(function(){
				document.querySelector(".yellow-audio").play();
			}, speedTime);
			clearInterval(yellowAudioInterval);
			yellowAudioInterval = setInterval(function(){
				document.querySelector(".red-audio").play();
				setTimeout(function(){
					document.querySelector(".yellow-audio").play();
				}, speedTime);
			}, speedTime*num);
		}, outTime);
	}

	// 键盘按键事件
  document.onkeydown = function(event) {
		var e = event || window.event || arguments.callee.caller.arguments[0];

		if(e && e.keyCode == 49) { // 1 暂停轮播
			mySwiper.stopAutoplay();
			wss.sendOper(msgFrom, msgTo, JSON.stringify({stopBoot: 1}));
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
		} else if(e && e.keyCode == 87) { // w 开启轮播
			// 开启动画
			if(boot_msgFrom_status == 1 && boot_msgTo_status == 1) {
				initBoot();
				wss.sendOper(msgFrom, msgTo, JSON.stringify({startBoot3: 1}));
			}
		} 
	}

	// 开始轮播
	function initBoot() {
		initSwiper();
		status = true;
		if(msgFrom == "board") audioStatus = true;
		document.querySelector("." + msgFrom + "-boot video").play();

		clearTimeout(speedTimeout);
		speedTimeout = setTimeout(function(){
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
}