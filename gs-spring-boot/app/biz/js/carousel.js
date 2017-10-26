require(["ipu"], function (ipu) {
    $(function () {
        var carousel = ipu.carousel(".ipu-carousel",
            { // 第一页设置幻灯片
                autoPlay: false,  //是否自动播放，默认为FALSE
                indicator: true,  //是否生成指示器(右下角的小圆点)
                callBack: function (nowIndex)  //每次执行动作的回调。返回的是当前运行到第几张
                {
                    console.log("nowIndxe:【" + nowIndex + "】");
                }
            });


        var hammerCarousel = ipu.hammerCarousel(".ipu-hammer-carousel",
            { // 第一页设置幻灯片
                autoPlay: false,
                indicator: true,
                callBack: function (nowIndex) {
                    console.log("nowIndxe:【" + nowIndex + "】");
                }
            });

        $("#prev1").on("click", function () {
            console.log("点了上一张");
            carousel.prev();
        });
        $("#next1").on("click", function () {
            console.log("点了下一张");
            carousel.next();
        });
        $("#play1").on("click", function () {
            console.log("点了自动播放");
            carousel.autoPlay = true;
            carousel.play();
        });
        $("#stop1").on("click", function () {
            console.log("点了暂停");
            carousel.stop();
        });

        $("#forward1").on("click", function () {
            console.log("点了跳转");
            carousel.show(2);
        });

        $("#prev").on("click", function () {
            console.log("点了上一张");
            hammerCarousel.prev();
        });
        $("#next").on("click", function () {
            console.log("点了下一张");
            hammerCarousel.next();
        });
        $("#play").on("click", function () {
            console.log("点了自动播放");
            hammerCarousel.autoPlay = true;
            hammerCarousel.play();
        });
        $("#stop").on("click", function () {
            console.log("点了停止");
            hammerCarousel.stop();
        });
        $("#forward").on("click", function () {
            console.log("点了跳转");
            hammerCarousel.show(2);
        });
    });
});
