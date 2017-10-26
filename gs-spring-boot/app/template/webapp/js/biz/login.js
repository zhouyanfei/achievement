require(["ipu", "jquery"], function (ipu, $) {
    $(function () {
        function checkInput() {
            if ($.trim($(this).val()) != "") {
                $(this).siblings("a").show();
            } else {
                $(this).siblings("a").hide();
            }
            var validate = true;
            $(".login-form-row").each(function () {
                if ($.trim($(".login-form-input", this).val()) == '') {
                    validate = false;
                    return false;
                }
            });
            // 登录按钮是否激活
            $(".login-form-button").prop("disabled", !validate);
        }

        // 输入变化事件
        $(".login-form-row .login-form-input").on('keyup blur', checkInput);

        // 清除输入
        $(".login-form-row .login-input-clear").click(function () {
            var input = $(this).siblings("input").val("");
            checkInput.apply(input);
        });

        // 是否记住密码,扩大点击区域
        $(".login-form-savepass").click(function (e) {
            if($(e.target).attr("type") != "checkbox"){ // 单击的是标题但不是勾选框，也自动构选
                $("input[type='checkbox']", this).prop("checked", function( i, val ) {
                    return !val;
                });
            }
        });

        //登录
        $("#login_btn").click(function(){
            var userNT = $("#login_NT").val();
            var userPwd = $("#login_pwd").val();
            $.ajax({
                type:"POST",
                url:"/login/index",
                data:{"userNT": userNT,"password" : userPwd},
                async:false,
                success:function(data){
                    if(data && data.state=="asiainfo_error"){
                        alert("登录失败，请输入正确的NT账号及NT密码！");
                    }else if(data && data.state=="success"){
                        console.log("登录成功！");
                        window.location.href = "/firstpage";
                    }
                },
                error:function(XMLHttpRequest, textStatus, data) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
                    alert(data);
                }
            });
        });
        // 密码是否明文显示
        $(".pass-text").click(function () {
            $(this).toggleClass("pass-pass");
            if ($(this).hasClass("pass-pass")) {
                $(this).siblings("input").attr("type", "text");
            } else {
                $(this).siblings("input").attr("type", "password");
            }
        });
    });
});
