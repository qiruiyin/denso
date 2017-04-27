// 目前不支持ie
var setFullScreen = {
	isFullScreen: function() {
		// 是否全屏
		if(document.webkitIsFullScreen || document.mozFullScreen || document.fullScreen) {
			return true;
		} else {
			return false;
		}
	},
	launchFullScreen: function(element) {
		// 设置全屏
		element = element || document.body;
		var requestMethod = element.requestFullScreen || //W3C
	  										element.webkitRequestFullScreen ||  //Chrome等
	  										element.mozRequestFullScreen || //FireFox
	  										element.msRequestFullScreen; //IE11
	  
	  if (requestMethod) {
	    requestMethod.call(element);
	  } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
	    var wscript = new ActiveXObject("WScript.Shell");
	    if (wscript !== null) {
	      wscript.SendKeys("{F11}");
	    }
	  }
	},
	exitFullScreen: function() {
		// 退出全屏
		var exitMethod = document.exitFullscreen || //W3C
										 document.mozCancelFullScreen ||  //Chrome等
										 document.webkitExitFullscreen || //FireFox
										 document.msExitFullscreen; //IE11
	  if (exitMethod) {
	    exitMethod.call(document);
	  } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
	    var wscript = new ActiveXObject("WScript.Shell");
	    if (wscript !== null) {
	      wscript.SendKeys("{F11}");
	    }
	  }
	},
	fullScreenChange: function() {
		document.querySelector("header").className = document.querySelector("header").className == "" ? "active" : "";
	},
	init: function(){
		var _this = this;
		document.addEventListener("fullscreenchange", function() {
			_this.fullScreenChange()
		});

		document.addEventListener("mozfullscreenchange", function() {
			_this.fullScreenChange()
		});

		document.addEventListener("webkitfullscreenchange", function() {
			_this.fullScreenChange()
		});
	}
}