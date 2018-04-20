/// <reference path="../lib/jquery/jquery-1.7.2-vsdoc.js" />
;
$(function () {
    $('#user').focus();
    $("#userLogin").submit(function (e) {
        var username = $('#user').val();
        var pwd = $('#pwd').val();
        var result = $.mvcData.get('User.Login', { username: username, pwd: pwd });
        if (result.success) {
            window.location.href = '../';
            return false;
        }
        layer.msg('用户名或密码错误，请重试。');
        $('#user').focus();
        return false;
    });
});