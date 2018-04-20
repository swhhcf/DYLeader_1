<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
    <script src="lib/jquery/jquery-1.11.3.min.js"></script>
    <script src="lib/common.js"></script>
    <script>
        var userInfo = $.mvcData.get('User.Get');
        if (!userInfo.success) {
            window.location.href = 'user/login.aspx';
        }
    </script>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <iframe src="Personal/default.aspx" style="border: none; height: 100%; width: 100%; overflow: hidden;"></iframe>
</body>
</html>