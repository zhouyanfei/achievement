require(["domReady!","wadeMobile","jcl","iScroll","tap"], function(doc,WadeMobile,$,iScroll) {
	var iscroll=new iScroll("scroll-container");
	
	$("#getContactDetail").tap(function(){
		WadeMobile.getContacts(function(str){
			var data=new $.DataMap(str);
			console.log(data);
			
			//① 添加姓名
			$("#name").html(data.get("name"));
			
			//② 添加号码
			var phoneJSON = JSON.parse(data.get("phoneNumber"));
			//移除元素
			$("#phone").empty();
			//添加元素
			for(var key in phoneJSON){
				var htmlStr = '<div class="ipu-content ipu-border-tb">' +
								'<div class="label">电话(' + key + ')</div>' + 
								'<div class="info">' + phoneJSON[key] + '</div>' + 
							'</div>';
				$("#phone").append(htmlStr);
			}
			//③ 添加邮箱
			var emailJSON = JSON.parse(data.get("email"));
			//移除元素
			$("#email").empty();
			//添加元素
			for(var key in emailJSON){
				var htmlStr = '<div class="ipu-content ipu-border-tb">' +
								'<div class="label">邮件(' + key + ')</div>' + 
								'<div class="info">' + emailJSON[key] + '</div>' + 
							'</div>';
				$("#email").append(htmlStr);
			}
			//④ 添加公司信息
			$("#company").html(data.get("company"));
			//⑤ 添加备注
			$("#remark").html(data.get("remark"));
			
			iscroll.refresh();
		});
	});
});
