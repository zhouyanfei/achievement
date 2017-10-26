/**
 * baseUrl的优先级:require.config>data-main>html文件路径
 * 如果模块包含如下的字符,不按照baseUrl+paths的方式来寻找模块,而是采用全路径(URL)的方式:
 * 1.如果以".js"结尾
 * 2.如果以"/"开头
 * 3.如果以"http:"或者"https:"开头
 */
require.config({
    baseUrl:'js', //也是个相对路径？是的,看你的写法 ../demo/js
    //指定别名. zepto.event如果不使用引号,会导致异常
    paths:{
        'iScroll':'lib/iscroll/iscroll',
        'Hammer':'lib/hammer/hammer',
        'jquery':'lib/jquery/jquery-2.2.4',
        'ipu':'../ipu/js/ipu',
        'FastClick':'lib/fastclick/fastclick'
    },
    shim:{
        'dragsort': { deps: ['jquery'] },
        'tap': { deps: ['jquery'] }
    },
    // 避免浏览器缓存
    urlArgs: "urlArgs="+new Date().getTime()
});
