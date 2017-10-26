require(["ipu", "jquery"], function (ipu, $) {
    // 通用
    $(function () {
        $(".ipu-fn-left").click(function () {

        });
    });
    //开始挑战
    $("#challenge_btn").click(function(){
        $.ajax({
            type:"POST",
            url:"/challenge",
            data:{"ach_id":ach_id, "ach_name":ach_name},
            async:false,
            success:function(data) {
                if(data=="nologin")
                    window.location.href = "login.html";
                if(data=="error"){
                    alert("你已经参加过该挑战！");
                }else if(data=="success"){
                    alert("挑战成功");
                }
            }

        });
    });
    //完成挑战
    $("#finised_btn").click(function(){
        $.ajax({
            type:"POST",
            url:"/finished",
            data:{"ach_id":ach_id},
            async:false,
            success:function(data){
                if(data=="nologin")
                    window.location.href = "login.html";
                else window.location.href = "/firstpage";
            }
        });
    });
    //放弃挑战
    $("#quit_btn").click(function(){
       $.ajax({
           type:"POST",
           url:"/quit",
           data:{"ach_id":ach_id},
           async:false,
           success:function(data){
               if(data=="nologin")
                   window.location.href = "login.html";
               else window.location.href = "/firstpage";
           }
       }) ;
    });
    //分享成就
    var configdata = null;
    $("#share_btn").click(function(){
        $.ajax({
            type:"POST",
            url:"/wxconfig",
            async:false,
            success:function(data){
                configdata = data;
            }
        });
    });

    wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: configdata.appid, // 必填，公众号的唯一标识
        timestamp:configdata.timestamp, // 必填，生成签名的时间戳
        nonceStr: configdata.noncestr, // 必填，生成签名的随机串
        signature: configdata.signature,// 必填，签名，见附录1
        jsApiList: ['checkJsApi',
            'onMenuShareTimeline',
            'hideOptionMenu',
            'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
});