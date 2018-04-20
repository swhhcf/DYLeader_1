<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <link href="../lib/Validform/style.css" rel="stylesheet" />
    <title></title>
    <link href="../lib/controls/btctable/style.css" rel="stylesheet" />
    <style>
        body, form {
            text-align: left;
            width: 99%;
            background: #a9a9a9;
        }

        .w-300 {
            width: 300px;
        }

        .tab-div {
            width: 100%;
            clear: both;
            /*margin: auto;*/
        }

            .tab-div div {
                margin-top: 10px;
            }

        label {
            float: left;
            width: 100px;
            text-align: right;
            display: block;
            margin-right: 5px;
            margin-top: 2px;
        }

        .lbl-check {
            width: 90px;
            cursor: pointer;
        }

        .mt-0 {
            margin-top: 0 !important;
        }

        .ml-12 {
            margin-left: 13px;
        }

        input[type="radio"] {
            margin-right: 3px;
        }

        form input[type="button"], form input[type="submit"] {
            margin-left: 351px;
            clear: both;
        }
    </style>
</head>
<body>
    <input id="btn1" type="button" value="load提交" />
    <input id="btn2" type="button" value="load提交" />
    <input id="btn21" type="button" value="submit提交" />
    <form action="default.aspx">
        <input type="text" name="personalId" value="88" />
        <input type="text" name="table" value="FamilyMember" />
        <input id="btn3" type="button" value="form提交" />
        <input id="btn4" type="button" value="form提交2" />
        <div id="aa"></div>
    </form>
    <div id="box1"></div>
    <div id="box2"></div>
    <script src="../lib/jquery/jquery-1.11.3.min.js"></script>
    <script src="../lib/layer/layer.js"></script>
    <script src="../lib/common.js"></script>
    <script src="../lib/jquery.ext.js"></script>
    <script src="../lib/jquery.form.js"></script>
    <script src="../lib/controls/btctable/control.js"></script>
    <script src="../lib/Validform/Validform_v5.3.2.js"></script>
    <script src="../lib/Validform/Validform_Datatype.js"></script>
    <script>
        $(function () {
            $("form").submit(function () {
                alert("阻止submit的提交。");
                returnFalse;
            });

            alert($("form input[name=table]").val());
            $("#btn1").click(function () {
                $("form").submit(function () {
                    alert("submit表单提交");
                });
            });
            $("#btn2").click(function () {
                $.get(
                    "/AjaxMethod/GetList.cspx",
                    { table: 'FamilyMember', personalId: 88 },
                    function (response, status, xhr) {
                        alert(response.rows[0]);
                    }
                );
            });
            $("#btn3").click(function () {
                $.ajax({
                    type: 'POST',
                    url: '/AjaxMethod/GetList.cspx',
                    data: $('form').serialize(),// {
                    /* table: 'FamilyMember', personalId: 88 */

                    /* table : $("form input[name=table]").val(),
                     personalId: $("form input[name=personalId]").val() */

                    // },
                    success: function (response, status, xhr) {
                        alert(response);
                    }
                });
            });
            var option = {
                url: '/AjaxMethod/GetList.cspx',
                parms: { PersonalId: 84, table: 'FamilyMember' },
                //heightDiff: 0,
                radio: true,
                cols: [
                    { display: '关系', name: 'Relation', width: 150, align: 'left' },
                    { display: '姓名', name: 'Fullname', width: 150, align: 'left' },
                    { display: '身份证号', name: 'IdCard', width: 100, align: 'left' },
                    { display: '政治面貌', name: 'PoliticsStatus', width: 100, align: 'left' },
                    { display: '工作单位', name: 'WorkUnit', width: 90 },
                    { display: '职务', name: 'Duty', width: 90 }
                ]
            };

            $("#btn4").click(function () {
                $("#aa").btcTable(option);//要调用control.js,/lib/controls/btctable/style.css,  ../lib/controls/btctable/control.js",
            });
        });
    </script>
</body>
</html>