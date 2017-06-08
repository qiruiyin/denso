调整方式：
1、js: main.js第9行开始
		fun1: 功能1
			frameInit：初始保留时间
			frameA: 原状态a键保留时间
			frameS: 原状态s键保留时间
		fun2: 功能2
			frameInit：初始保留时间
			frameA: 原状态a键保留时间
			frameS: 原状态s键保留时间
		其他同上
2、html：
	board.html和hud.html:
		第18行开机动画时间：data-swiper-autoplay="10000"
		第25行待机动画时间：data-swiper-autoplay="3000"
		第31行功能1时间：data-swiper-autoplay="6000" 为js里面对应功能的frameInit + frameA + frameS之和
		第38行功能2时间：data-swiper-autoplay="6000" 为js里面对应功能的frameInit + frameA + frameS之和
		第49行功能3时间：data-swiper-autoplay="6000" 为js里面对应功能的frameInit + frameA + frameS之和
		第57行功能4时间：data-swiper-autoplay="9000" 为js里面对应功能的frameInit + frameA + frameS之和
		第71行功能5时间：data-swiper-autoplay="6000" 为js里面对应功能的frameInit + frameA + frameS之和
	
备注：一个修改影响全部都要修改