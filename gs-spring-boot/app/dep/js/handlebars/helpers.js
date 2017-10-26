/* Handlebars Helpers - Dan Harper (http://github.com/danharper) */

/**
 * 是否显示审批按钮
 */
Handlebars.registerHelper("isApproved", function(txt,txt2,txt3,fn) {
	var buffer = "";
	if(txt3=='0'){
		return buffer;
	}
	if(txt=="1"){
		buffer = '<div class=" current-item"><a class="item-text" href="javascript:;" onclick="prodPriceCheck('+txt2+', event);return false;">审批</a></div>';
	}else if(txt=="2"){
		buffer = '';
	}
	return new Handlebars.SafeString(buffer);
});
/**
 * 是否显示修改按钮
 */
Handlebars.registerHelper("isModify", function(txt,txt2,txt3,txt4,txt5,txt6,txt7,txt8,fn) {
	var buffer = "";
	if(txt8=='0'){
		return buffer;
	}
	if(txt=="1"){
		buffer = '<div class=" current-item"><a class="item-text" href="javascript:;" onclick="modifyIt(\''+ txt2 +'\', \''+txt3+'\', \''+txt4+'\', \''+txt5+'\', \''+txt6+'\',\''+txt7+'\', event);return false;">修改</a></div>';
	}else if(txt=="10"){
		buffer = '<div class=" current-item"><a class="item-text" href="javascript:;" onclick="modifyIt(\''+ txt2 +'\', \''+txt3+'\', \''+txt4+'\', \''+txt5+'\', \''+txt6+'\',\''+txt7+'\', event);return false;">修改</a></div>';
	}else{
		buffer = "";
	}
	return new Handlebars.SafeString(buffer);
});
/**
 * 是否显示修改按钮(活动价,采购价)
 */
Handlebars.registerHelper("isModifyTwo", function(txt,txt2,txt3,fn) {
	var buffer = "";
	if(txt3=='0'){
		return buffer;
	}
	if(txt=="1"){
		buffer = '<div class=" current-item"><a class="item-text" href="javascript:;" onclick="modifyIt(\''+ txt2 +'\', event);return false;">修改</a></div>';
	}else if(txt=="10"){
		buffer = '<div class=" current-item"><a class="item-text" href="javascript:;" onclick="modifyIt(\''+ txt2 +'\', event);return false;">修改</a></div>';
	}else{
		buffer = "";
	}
	return new Handlebars.SafeString(buffer);
});
/**
 * 是否显示设置优惠按钮(采购价)
 */
Handlebars.registerHelper("isAddPromotion", function(txt,txt2,txt3,txt4,txt5,fn) {
	var buffer = "";
	if(txt5=='0'){
		return buffer;
	}
	if(txt=="1" && txt2 == '10000002' && txt3==''){
		buffer = '<div class=" current-item"><a class="item-text" href="javascript:;" onclick="addPromotion(\''+ txt4 +'\', event);return false;">设置优惠</a></div>';
	}else{
		buffer = "";
	}
	return new Handlebars.SafeString(buffer);
});
/**
 * 是否显示确认按钮（返充金额）
 */
Handlebars.registerHelper("isReverseConfirm", function(txt,txt2,txt3,fn) {
	var buffer = "";
	if(txt3=='0'){
		return buffer;
	}
	if(txt=="10"){
		buffer = '<div class=" current-item"><a class="item-text" href="javascript:;" onclick="confirm('+txt2+', event)">确认</a></div>';
	}else if(txt=="11"){
		buffer = '<div class=" current-item"><a class="item-text" href="javascript:;" onclick="unConfirm('+txt2+', event)">取消确认</a></div>';
	}
	return new Handlebars.SafeString(buffer);
});
/**
 * 是否显示审批按钮（返充金额）
 */
Handlebars.registerHelper("isReverseApprove", function(txt,txt2,txt3,fn) {
	var buffer = "";
	if(txt=="11"){
		buffer = '<div class=" current-item"><a class="item-text" href="javascript:;" onclick="prodPriceCheck('+txt2+', event);return false;">审批</a></div>';
	}else{
		buffer = '';
	}
	return new Handlebars.SafeString(buffer);
});
/**
 * 是否显示删除按钮（返充金额）
 */
Handlebars.registerHelper("isReverseDel", function(txt,txt2,txt3,fn) {
	var buffer = "";
	if(txt3=='0'){
		return buffer;
	}
	if(txt3=='0'){
		return buffer;
	}
	if(txt=="10"){
		buffer = '<div class=" current-item"><a class="item-text" href="javascript:;" onclick="del('+txt2+', event)">删除</a></div>';
	}else{
		buffer = '';
	}
	return new Handlebars.SafeString(buffer);
});
/**
 * 是否显示审批按钮（返充金额）
 */
Handlebars.registerHelper("isReverseModify", function(txt,txt2,fn) {
	var buffer = "";
	if(txt=="10"){
		buffer = '<div class="current-item"><a class="item-text" href="javascript:;" onclick="showRows('+txt2+', event);return false;">修改</a></div>';
	}else{
		buffer = '';
	}
	return new Handlebars.SafeString(buffer);
});


/**
 * 返回供货商出入库状态
 */
Handlebars.registerHelper("inventoryState", function(txt,fn) {
	var buffer = "";
	if(txt=="1"){
		buffer = '备案';
	}else if(txt=="2"){
		buffer = '出库';
	}else if(txt=="3"){
		buffer = '入库';
	}
	return buffer;
});
/**
 * 索引是否是第一个
 */
Handlebars.registerHelper("indexFirst", function(txt , txt1 , txt2 , fn) {
	var buffer="";
	if(txt==txt1){
		buffer = txt2;
	}
	return buffer;
});
/**
 * 返回索引
 */
Handlebars.registerHelper("indexAdd", function(txt,fn) {
	var buffer = txt+1;
	return buffer;
});
/**
 * 定义表格隔行变色
 */
Handlebars.registerHelper("splitClass", function(txt,fn) {
	var buffer = "split";
	if( txt % 2 == 0  ){  
		buffer = "";
	}
	return buffer;
});
/**
 * 定义下拉框选中默认值
 */
Handlebars.registerHelper("isSelect", function(txt,txt2,fn) {
	var buffer = "";
	if( txt == txt2   ){  
		buffer = "selected='selected'";
	}
	return buffer;
});

/**
 * 定义checkbox勾选状态
 */
Handlebars.registerHelper("isChecked", function(txt,txt2,fn) {
	var buffer = "";
	if( txt == txt2   ){  
		buffer = "checked='checked'";
	}
	return buffer;
});
/**
 * 自定义方法：跳转地址
 * eg ：
 * href="{{isFolder1 adPic colorID modelID brandID}}" 
 */
Handlebars.registerHelper("isFolder1", function(adPic ,colorID ,modelID,brandID,fn) {
	var buffer = "";
	if( adPic.indexOf(".jpg") < 0 && adPic.indexOf(".png") < 0 && adPic.indexOf(".gif") < 0 && adPic.indexOf(".jpeg") < 0   ){  //是文件夹
		 buffer = adPic+"/index.html";
	}else{//是图片
		 buffer = "product.jsp?uid=b00001&colorID="+colorID+"&modelID="+modelID+"&brandID="+brandID;

	}
	return buffer;
});
/**
 * 自定义方法：图片地址
 * eg ：
 * href="{{isFolder2 adPic}}" 
 */
Handlebars.registerHelper("isFolder2", function(adPic , fn) {
	var buffer = "";
	if( adPic.indexOf(".jpg") < 0 && adPic.indexOf(".png") < 0 && adPic.indexOf(".gif") < 0 && adPic.indexOf(".jpeg") < 0   ){  //是文件夹
		 buffer = adPic+"/index.jpg";
	}else{//是图片
		 buffer = adPic;
	}
	return buffer;
});


/**
 * 自定义方法：主要解决在广告里放其他连接
 * eg ：
 * href="{{ishttp colorID modelID brandID}}" 
 */
Handlebars.registerHelper("ishttp", function(colorID ,modelID ,brandID, fn) {
	colorID = colorID+"";
	var buffer = "";
	if( colorID.indexOf("http") < 0 ){  //没有连接
		buffer = "product.jsp?uid=b00001&colorID="+colorID+"&modelID="+modelID+"&brandID="+brandID;
	}else{  
		buffer = colorID;
	}
	return buffer;
});
/**
 * 自定义方法：主要解决在#if_eq里面不能../../这种方式
 * eg ：
 * {{#rebetas ../../this.model}}{{/rebetas}}
 */
Handlebars.registerHelper("sumexceed", function(array, fn) {
	var buffer = "";
	if(array[10]==0||array[10]==0){
		buffer = "无优惠";
	}else{
		buffer = "满"+array[10]+"立减"+array[11];
	}
	return buffer;
});
Handlebars.registerHelper("sumtatol", function(array, fn) {
	var buffer = "";
	if(array[1]==0||array[2]==0){
		buffer = "无优惠";
	}else{
		buffer = "满"+array[1]+"立减"+array[2];
	}
	return buffer;
});
Handlebars.registerHelper("prosum", function(str1,str2, fn) {
	var buffer = "";
	if(str1==0||str2==0){
		buffer = "无优惠";
	}else{
		buffer = "满"+(str1/100)+"元立减"+(str2/100)+"元。";
	}
	return buffer;
});
/**
 * 自定义方法：主要解决在#if_eq里面不能../../这种方式
 * eg ：
 * {{#rebetas ../../this.model}}{{/rebetas}}
 */
Handlebars.registerHelper("rebetas", function(array, fn) {
	var buffer = "";
	if(array[4]==0){
		buffer = "";
	}else{
		buffer = "-";
	}
	return buffer;
});
/**
 * 带序号的循环
 * {{index}}为序号。
 * eg ：
 * {{#each_with_index array}}
 * 		{{index}}
 * {{/each_with_index}}
 */
Handlebars.registerHelper("each_with_index", function(array, options) {
	var buffer = "";
	for (var i = 0, j = array.length; i < j; i++) {
		var item = array[i];
	
		// stick an index property onto the item, starting with 1, may make configurable later
		item.index = i+1;
	
		// show the inside of the block
		buffer += options.fn(item);
	}
	// return the finished buffer
	return buffer;
});

Handlebars.registerHelper('divide100', function(value){
	return value/100;
});
Handlebars.registerHelper('add', function(value, addition){
	return value + addition;
});
Handlebars.registerHelper('subtract', function(value, substraction){
	return value - substraction;
});
Handlebars.registerHelper('divide', function(value, divisor){
	return value / divisor
});
Handlebars.registerHelper('multiply', function(value, multiplier){
	return value * multiplier
});
Handlebars.registerHelper('floor', function(value){
	return Math.floor(value);
});
Handlebars.registerHelper('ceil', function(value){
	return Math.ceil(value);
});
Handlebars.registerHelper('round', function(value){
	return Math.round(value);
});
/**
 * If Equals
 * if_eq this compare=that
 */
Handlebars.registerHelper('if_eq', function(context, options) {
  if (context == options.hash.compare)
    return options.fn(this);
  return options.inverse(this);
});

/**
 * Unless Equals
 * unless_eq this compare=that
 */
Handlebars.registerHelper('unless_eq', function(context, options) {
  if (context == options.hash.compare)
    return options.inverse(this);
  return options.fn(this);
});


/**
 * If Greater Than
 * if_gt this compare=that
 */
Handlebars.registerHelper('if_gt', function(context, options) {
  if (context > options.hash.compare)
    return options.fn(this);
  return options.inverse(this);
});

/**
 * Unless Greater Than
 * unless_gt this compare=that
 */
Handlebars.registerHelper('unless_gt', function(context, options) {
  if (context > options.hash.compare)
    return options.inverse(this);
  return options.fn(this);
});


/**
 * If Less Than
 * if_lt this compare=that
 */
Handlebars.registerHelper('if_lt', function(context, options) {
  if (context < options.hash.compare)
    return options.fn(this);
  return options.inverse(this);
});

/**
 * Unless Less Than
 * unless_lt this compare=that
 */
Handlebars.registerHelper('unless_lt', function(context, options) {
  if (context < options.hash.compare)
    return options.inverse(this);
  return options.fn(this);
});


/**
 * If Greater Than or Equal To
 * if_gteq this compare=that
 */
Handlebars.registerHelper('if_gteq', function(context, options) {
  if (context >= options.hash.compare)
    return options.fn(this);
  return options.inverse(this);
});

/**
 * Unless Greater Than or Equal To
 * unless_gteq this compare=that
 */
Handlebars.registerHelper('unless_gteq', function(context, options) {
  if (context >= options.hash.compare)
    return options.inverse(this);
  return options.fn(this);
});


/**
 * If Less Than or Equal To
 * if_lteq this compare=that
 */
Handlebars.registerHelper('if_lteq', function(context, options) {
  if (context <= options.hash.compare)
    return options.fn(this);
  return options.inverse(this);
});

/**
 * Unless Less Than or Equal To
 * unless_lteq this compare=that
 */
Handlebars.registerHelper('unless_lteq', function(context, options) {
  if (context <= options.hash.compare)
    return options.inverse(this);
  return options.fn(this);
});

/**
 * Convert new line (\n\r) to <br>
 * from http://phpjs.org/functions/nl2br:480
 */
Handlebars.registerHelper('nl2br', function(text) {
  var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
  return new Handlebars.SafeString(nl2br);
});

/*
 *字符串过长的时候切除字符串
*/
Handlebars.registerHelper("subStrIfTL", function(strIn,num) {
	if(!num)num=25;
	var str=strIn||"";
	if(strIn && strIn.length>num){
		if(!window.showTLInfo){
			window.showTLInfo=function(obj){
				art.dialog({
					  title: "详细信息",
					  content: '<p style="font-size:14px;min-width:200px;max-width:500px;*width:500px;word-wrap:break-word;word-break: break-all;color:#808080;">'+$(obj).attr("title")+'</p>',
					  drag:false,
					  cancel: false,
					  lock:true,
					  opacity:0,
					  button :[
					      {
					          name: '确定',
					          callback: function () {
					          	this.close();
					            return false;
					          },
					          focus: true
					      }
					  ]
				});
			}
		}
		str=strIn.substring(0,num);
		str+='<a href="javascript:void(0)" title="'+strIn.replace(/'/g, '&#x2019;').replace(/"/g, '&#x201d;')+'" onclick="showTLInfo(this);return false;">...</a>';
	}
 	return new Handlebars.SafeString(str);
});

//json转换str
Handlebars.registerHelper('retJson2Str', function(json, options) {
	return JSON.stringify(json);
});
