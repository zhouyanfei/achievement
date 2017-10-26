require(["domReady!","mobile","wadeMobile","jcl","tap"], function(doc,Mobile,WadeMobile,$) {
	var isSdcard=$("#isSdcard").val();
	var fileName=$("#fileName").val();
	
	// 读文件
	WadeMobile.readFile(function(str){
		$("#f-content").val(str);
	},fileName,"file",isSdcard,true);
	
	// 写文件
	$("#save").tap(function(){
		var content=$("#f-content").val();
		WadeMobile.writeFile(content,fileName,"file",isSdcard);
		//Mobile.openTemplate("File");
		Mobile.closeWindow();
	});
	
	$("#left-btn").tap(function(){
		Mobile.closeWindow("");
		return;
	});
});