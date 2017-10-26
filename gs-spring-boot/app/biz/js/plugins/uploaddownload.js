require(["domReady!","wadeMobile", "jcl","iScroll","tap"], function(doc,WadeMobile,$,iScroll) {
	var iscroll = new iScroll("scroll-container");
	//服务器存储文件路径：webapp/ picture/my.png
	var picPath = "picture/my.png";

	/**
	 * 上传 
	 */
	$("#upload").tap(function() {
		//① 选择图片
		WadeMobile.getPicture(function(filePath){
			$("#uploadFilePath").html(filePath);

			//②上传
			var uploadFile = $("#uploadFilePath").html();
			if(!uploadFile){
				alert("请先选择上传文件!");
				return;
			}
			/*单文件上传*/
			var params = $.DataMap();
			params.put("FILE_PATH",picPath);
			
			WadeMobile.loadingStart("正在上传...");
			WadeMobile.uploadWithServlet(uploadFile, "UploadDownloadBean.upload", params.toString(), function(result){
				WadeMobile.loadingStop();
				
				var data = new $.DataMap(result);
				$("#remoteFilePath").html(data.get("FILE_PATH"));
			});
			/*多文件上传*/
			//有待补充
		});
	});
	
	/**
	 * 下载
	 * 常用相对路径,如果只有android,可使用绝对路径
	 */
	$("#download").tap(function() {
		var params = new $.DataMap();
		params.put("FILE_PATH", picPath); //下载文件的路径
		
		WadeMobile.loadingStart("正在下载...");
		WadeMobile.downloadWithServlet(picPath, "UploadDownloadBean.download", params.toString(), function(savePath){
			WadeMobile.loadingStop();
			
//			alert("下载成功:"+savePath);
			$("#downloadFilePath").html(savePath);
			
			var width = $("#downloadPicture").width();
			var height = $("#downloadPicture").height();
			$("#downloadPicture").removeClass("fa").removeClass("fa-image");
			$("#downloadPicture").html("<img height='" + height + "' width='" + width + "' src='" + savePath + "'/>");
			iscroll.refresh();
		}, function(error){
			WadeMobile.loadingStop();
			WadeMobile.alert("下载错误:"+error);
		});
	});
});
