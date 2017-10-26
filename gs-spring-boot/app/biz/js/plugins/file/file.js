require(["domReady!","ipu","wadeMobile","Hammer","handlebars","mobile","jcl","iScroll","tap"],function(doc,ipu,WadeMobile,Hammer,Handlebars,Mobile,$,iScroll){
	new iScroll("scroll-container");
	var tab = new ipu.tab(".ipu-tab");
	tab.show(0);
	
	// base path
	WadeMobile.getRelativePath(function(dir){
		$("#files_dir").html(dir);
		$("#sdcard_dir").html(dir);
	},"","file");
	
	
	// 获取files和sdcard/files下面所有的文件
	// true:sdcard
	getAllFileItem(true);
	getAllFileItem(false);
	
	// 打开新建文件窗口
	$(".file-add").tap(function(){
		$("#fileName").val("");
		ipu.prompt('新建文件', function (value) {
	        WadeMobile.writeFile("",value,"file",isSdcard);
			createFileItem(value,isSdcard);
	    });
	});
	
	var isSdcard = true;
	$(".ipu-tab-title li").each(function(index, item) {
		$(item).tap(function() {
			if(index == 0) {
				isSdcard = true;
			} else {
				isSdcard = false;
			}
		});
	});
	
	// 所有的文件
	function getAllFileItem(isSdcard){
		WadeMobile.getAllFile(function(fileNames){
			var arr=$.parseJSON(fileNames);
			$.each(arr,function(index,fileName){
				createFileItem(fileName,isSdcard);
			});
		},"","file",isSdcard);
	}

	// 获取所有的文件列表,true:sdcard
	function createFileItem(fileName,isSdcard) {
		var json=new Object();
		json.fileName = fileName;
		json.isSdcard = isSdcard;
		var html = Handlebars.compile($("#fileList").val())(json);
		var li = $(html);
		if(isSdcard) {
			$("#fileListSdcard").append(li);
		} else {
			$("#fileListData").append(li);
		}
		
		// 为文本列表绑定事件
		var file = new Hammer(li.get(0));
		// 长按删除
		file.on("press", function (ev) {
			if (confirm("确认要删除？")) {
				var fileName = $(ev.target).parents("li").data("filename");
				var isSdcard = $(ev.target).parents("li").data("issdcard");
				WadeMobile.deleteFile(fileName,"file",isSdcard);
				$(ev.target).parents("li")[0].remove();
				WadeMobile.tip("删除成功！");
			}
		});	
 		// 单击显示详情
		file.on("tap", function (ev) {
 			var fileName = $(ev.target).parents("li").data("filename");
			var isSdcard = $(ev.target).parents("li").data("issdcard");
			var values = new $.DataMap();
			values.put("isSdcard", isSdcard);
			values.put("fileName", fileName);
//			Mobile.openTemplate("FileDetail", values);
			Mobile.openWindow("FileDetail", values);
		});	
	}
	
	
	
});