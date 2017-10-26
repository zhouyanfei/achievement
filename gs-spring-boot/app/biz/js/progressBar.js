require(["ipu"], function (ipu) {
    $(function () {
        var progressBar = ipu.progressBar("#myProgressBar", {
            level: 'default',
            progress: '80'
        });

        $(".pro-btn").click(function () {
            var pro = $(this).val();
            progressBar.setProgress(pro);
        });
        $("#set2").click(function () {
            progressBar.setLevel("defualt");
        });
        $("#set3").click(function () {
            progressBar.setLevel("success");
        });
        $("#set4").click(function () {
            progressBar.setLevel("warning");
        });
        $("#set5").click(function () {
            progressBar.setLevel("highlight");
        });
        $("#set6").click(function () {
            var pro = progressBar.getProgress();
            $("#input2").text(pro);
        });
    });
});
