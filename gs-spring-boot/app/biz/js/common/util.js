/**
 * util用于将模块化变量全局化,方便使用
 * 如果每个js都需要引入的相同模块,则绑定到window对象即可
 */
define(["jcl","iScroll","tap"],function($,iScroll) {
	window.$ = window.Wade = $;
	window.iScroll = iScroll;
});