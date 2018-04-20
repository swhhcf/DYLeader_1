<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="../static/h-ui/css/H-ui.min.css" rel="stylesheet" />
    <script src="../lib/jquery/jquery-1.11.3.min.js"></script>
    <script src="../lib/common.js"></script>
    <script src="../lib/layer/layer.js"></script>
    <script src="Login.js"></script>
    <style type="text/css">
        html {
            height: 760px;
            overflow: hidden;
        }

        body {
            font-size: 14px;
            height: 100%;
            text-align: center;
            overflow: hidden;
        }

        #content {
            /*
            height: 768px;*/
            width: 1200px;
            margin-left: auto;
            margin-right: auto;
            background: url('bgpic.jpg') no-repeat;
        }

        #formheight {
            width: 1200px;
            height: 150px;
        }

        label {
            display: block;
            float: left;
            padding-right: 6px;
            text-align: right;
            width: 54px;
        }

        .centerDiv {
            margin: auto;
            background-color: cadetblue;
            border: 1px solid #f60;
            margin-bottom: 15%;
            margin-left: 760px;
            padding: 20px;
            text-align: left;
            width: 280px;
            zoom: 1;
        }

        .hiddenDiv {
            display: inline-block;
            *display: inline;
            height: 100%;
            margin-left: -1px;
            *margin-top: -1px;
            overflow: hidden;
            vertical-align: middle;
            width: 1px;
            zoom: 1;
            _margin-top: 0;
        }

        .oneLine {
            display: block;
            height: 40px;
            line-height: 40px;
        }

        input[type="text"], input[type="password"], input[type="number"] {
            vertical-align: middle;
            /*height: 30px;*/
            width: 179px;
            margin-top: -4px;
            background-color: darkcyan;
        }

        img {
            cursor: pointer;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div id="content">
        <div id="formheight"></div>
        <div class="centerDiv">
            <div style="width: 100%; font-size: 18px; text-align: center;">东阳市组织部干部管理信息化系统</div>
            <form id="userLogin" style="margin-top: 20px;">
                <div>
                    <label style="width: 48px">用户名</label>
                    <input placeholder="用户名" id="user" name="username" class="input-text size-M"
                        type="text" />
                </div>
                <div style="margin-top: 20px;">
                    <label style="width: 48px">密码</label>
                    <input placeholder="密码" id="pwd" class="input-text size-M"
                        name="password" type="password" />
                </div>
                <div style="text-align: right; width: 233px; margin-top: 15px;">
                    <input type="submit" value="登录" class="btn btn-primary size-M" />
                </div>
            </form>
        </div>
        <div class="hiddenDiv"></div>
    </div>
</body>
</html>