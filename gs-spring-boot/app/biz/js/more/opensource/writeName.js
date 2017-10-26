require(["mobile","wadeMobile","jquery","common"],function(Mobile,WadeMobile,jQuery,Common){
	
	$("#get-image").click(function(){
    	var dataUrl= jQuery('.literally').canvasForExport().toDataURL();
    	//var arr = dataUrl.split(",");
    	//var data = new Wade.DataMap();
    	//data.put("actionName","WriteName");
    	//data.put("nameBase",arr[1]);
    	//Common.openTemplate("WriteNameResult",data);
    	
    	$("#mainContent").hide();
    	$("#resultContent").show();
    	$("#writeNameImg").attr("src", dataUrl);
	});
});