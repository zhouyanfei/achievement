/**
 * baseUrl的优先级:require.config>data-main>html文件路径
 * 如果模块包含如下的字符,不按照baseUrl+paths的方式来寻找模块,而是采用全路径(URL)的方式:
 * 1.如果以".js"结尾
 * 2.如果以"/"开头
 * 3.如果以"http:"或者"https:"开头
 */
require.config({
    paths:{
    	/**第三方开源**/
    	'zepto' : 'dep/js/zepto/zepto.min-1.1.6',
    	'jquery':'dep/js/jquery/jquery-2.2.4',
    	'domReady' : 'dep/js/requirejs/domReady-2.0.1',
        
    	'iScroll':'dep/js/iscroll/iscroll',
        'Hammer':'dep/js/hammer/hammer',
		'handlebars' : 'dep/js/handlebars/handlebars-4.0.5',
		'highcharts' : 'dep/js/chart/highchart/highcharts',
		'highcharts-3d' : 'dep/js/chart/highchart/highcharts-3d',
		'highcharts-more' : 'dep/js/chart/highchart/highcharts-more',
		"echarts": 'dep/js/chart/echart/echarts.common.min',
		"icharts": 'dep/js/chart/ichart/ichart.1.2.1.min',
		"fastclick":"dep/js/fastclick/fastclick",
		"FastClick":"dep/js/fastclick/fastclick",
		"gesturePassword":"dep/js/gesture.password",
		
		/**ipu框架**/
		'jcl' : 'ipu/js/base/jcl',
		'tap' : 'ipu/js/frame/tap',
        'ipu' : 'ipu/js/ipu',
        'browserTool' : 'ipu/js/mobile/browser-toolkit',
		'clientTool' : 'ipu/js/mobile/client-toolkit',
		'mobileBrowser' : 'ipu/js/mobile/mobile-browser',
		'mobileClient' : 'ipu/js/mobile/mobile-client',
		'wadeMobile' : 'ipu/js/mobile/wade-mobile',//这里同时会引入expand-mobile和biz-mobile
		'mobile' : 'ipu/js/mobile/mobile',
		'base64' : 'ipu/js/mobile/base64',

		'humUI':'dep/js/hum'
		
    },

	shim:{
		'humUI':{
			deps: ['zepto'],
			exports: 'Zepto'
		}
	},
     //缓存
     urlArgs: "urlArgs="
});
