问题:
	1、开机动画换为pud动画（welcome）
	2、仪表速度大小和档位P一样大（调大）（ok）
	3、速度变化（5s变一次）(ok)
	4、功能1，bus没有闪，hud右侧功能公交车居中，箭头去掉(ok)
	5、功能2，按照之前的制作，在红色区域内播放（地图只在中间）
	6、功能3，车的前后雷达的颜色改一下
	7、功能4，初始没有黄线（有蓝线），按a以后黄线遮掉蓝线，按s以后黄线和蓝线都没有，箭头同步
	8、功能5，效果优化


	1、开机视频在播放期间不能按其他键可以吗
	2、


# 一个简单的有关socket的demo

备注：
		开机动画过三秒钟切换到功能页面，功能播放完以后按0切换到待机画面

		功能3：闪烁的常量

# 开发环境

## 开发环境
以nodejs为基础，gulp+webpack+typings搭建前端自动化模块，并采用bower进行包模块管理

### 需安装nodejs 、 gulp 、webpack 、bower

* 'npm install -g gulp'
* 'npm install -g webpack'
* 'npm install -g bower'

### gulpfile 主要模块

* gulp start 启动项目
	* browser-sync 启动服务器
	* watch 监听修改
	* sass scss翻译
	* html 静态模板渲染
* gulp test js和css检查
	* jshint js校验
	* css-lint css校验
* gulp 生成压缩包
	* image 图片压缩
	* dist js和css压缩及生成压缩包

## 项目运行

* 'npm install'
* 'bower install'
* 'gulp start'

## 备注

### 如果使用typescript开发js，在'gulp start'之前

* 'npm install -g typescript typings'
* 'npm link typescript'


### SCSS 文件说明

* 参考https://github.com/marvin1023/sandal.git 和 https://github.com/jimyuan/tmpl.git