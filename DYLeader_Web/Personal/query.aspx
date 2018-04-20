<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title></title>
    <link href="../lib/h-ui/css/H-ui.min.css" rel="stylesheet" />
    <link href="../lib/Hui-iconfont/1.0.8/iconfont.css" rel="stylesheet" />
    <link href="../lib/controls/btctable/style.css" rel="stylesheet" />
    <link href="../lib/controls/NameBox/style.css" rel="stylesheet" />
    <link href="../static/common.css" rel="stylesheet" />
    <style>
        html, body, form {
            text-align: left;
            font-size: 14px;
            /*width: 99%;*/
            padding: 0 !important;
            margin: 0 !important;
        }

        .w-1 {
            width: 90%;
        }

        .w-2 {
            width: 45%;
        }

        .w-300 {
            width: 300px;
        }

        .w-500 {
            width: 500px;
        }

        .w-900 {
            width: 900px;
        }

        .tab-div {
            width: 100%;
            clear: both;
            /*margin: auto;*/
        }

        .lbl-title {
            text-align: right;
            display: block;
            width: 60px;
            margin-right: 5px;
            margin-left: 5px;
            margin-top: 0;
            float: left;
        }

        .lbl-check {
            /*width: 90px;*/
            margin-left: 2px;
            margin-right: 10px;
            display: inline;
            cursor: pointer;
            float: left;
        }

        .mt-0 {
            margin-top: 0 !important;
        }

        .ml-12 {
            margin-left: 13px;
        }

        input[type="radio"] {
            margin-right: 1px;
        }

        form input[type="submit"] {
            margin-left: 288px;
            clear: both;
        }

        hr {
            border: none;
            border-top: 1px solid #ccc;
            margin-top: 10px;
        }

        #divToolBar {
            width: 100%;
            background-color: #e5e5e5;
        }

        .tab-div > div {
            margin-left: 10px;
        }

        #divToolBar > div {
            width: 758px;
            height: 32px;
            line-height: 32px;
            /*text-align: right;*/
        }

        #divToolBar span {
            color: #515151 !important;
        }

            #divToolBar span:hover {
                color: #333 !important;
                font-weight: bold;
            }

        form td, form th {
            background-color: #fff !important;
        }

        form th {
            border: 1px #c9c9c9 solid;
            text-align: right;
            background-color: #f0f0f0 !important;
        }

        form span {
            margin: 5px 3px 0px 3px !important;
            float: left;
        }
    </style>
</head>
<body>
    <div id="content">
        <form id="frmSearch">
            <table>
                <tr>
                    <th style="width: 70px;">单位</th>
                    <td style="width: 172px;"><input type="text" name="WorkUnit" style="width: 145px" class="input-text f-l" placeholder="单位名称" /></td>
                    <th style="width: 70px;">性别</th>
                    <td style="width: 230px;">
                        <label class="lbl-check">
                            <input type="radio" name="Gender" value="1" />
                            男
                        </label>
                        <label class="lbl-check">
                            <input type="radio" name="Gender" value="0" />
                            女
                        </label>
                        <label class="lbl-check">
                            <input type="radio" name="Gender" value="" />
                            全部
                        </label>
                    </td>
                    <th style="width: 70px;">出生年月</th>
                    <td style="width: 224px;">
                        <input type="text" name="StartDate" class="input-text w-100 f-l " placeholder="起始时间" />
                        <span> 至 </span>
                        <input type="text" name="EndDate" class="input-text w-100 f-l " placeholder="终止时间" />
                    </td>
                </tr>
                <tr>
                    <th>政治面貌</th>
                    <td>
                        <label class="lbl-check">
                            <input type="checkbox" value="中共党员" name="Politics" />
                            中共党员
                        </label>
                        <label class="lbl-check">
                            <input type="checkbox" value="民主党派,群众" name="Politics" />
                            党外人士
                        </label>
                    </td>
                    <th>学历</th>
                    <td>
                        <label class="lbl-check">
                            <input type="checkbox" value="博士" name="EduDegree" />
                            博士
                        </label>
                        <label class="lbl-check">
                            <input type="checkbox" value="硕士" name="EduDegree" />
                            硕士
                        </label>
                        <label class="lbl-check">
                            <input type="checkbox" value="本科" name="EduDegree" />
                            本科
                        </label>
                        <label class="lbl-check">
                            <input type="checkbox" value="大专" name="EduDegree" />
                            大专
                        </label>
                    </td>
                    <th style="width: 70px;">专业名称</th>
                    <td style="width: 150px;"><input type="text" name="Major" class="f-l input-text" /></td>
                </tr>
                <tr>
                    <th>身份类别</th>
                    <td colspan="5">
                        <label class="lbl-check">
                            <input id="Identity1" value="公务员" type="checkbox" name="Identity" />
                            公务员
                        </label>
                        <label class="lbl-check">
                            <input id="Identity2" value="事业" type="checkbox" name="Identity" />
                            事业
                        </label>
                        <label class="lbl-check">
                            <input id="Identity3" value="参公" type="checkbox" name="Identity" />
                            参公
                        </label>
                    </td>
                </tr>
                <tr>
                    <th>考察情况</th>
                    <td colspan="3">
                        <label class="lbl-check">
                            <input value="OrdinaryInspection" type="radio" name="Inspection" />
                            平时考察
                        </label>
                        <label class="lbl-check">
                            <input value="SpecialInspection" type="radio" name="Inspection" />
                            专项考察
                        </label>
                        <label class="lbl-check">
                            <input value="AnnualAppraisal" type="radio" name="Inspection" />
                            年度考核
                        </label>
                        <label class="lbl-check">
                            <input value="DemocraticEvaluation" type="radio" name="Inspection" />
                            民主测评
                        </label>
                        <label class="lbl-check">
                            <input value="DemocraticRecommendation" type="radio" name="Inspection">
                            民主推荐
                        </label>
                        <label class="lbl-check">
                            <input value="" type="radio" name="Inspection" />
                            不选
                        </label>
                    </td>
                    <th>考察年月</th>
                    <td>
                        <input type="text" name="iStartDate" class="input-text w-100 f-l " placeholder="起始时间" />
                        <span> 至 </span>
                        <input type="text" name="iEndDate" class="input-text w-100 f-l " placeholder="终止时间" />
                    </td>
                </tr>
                <tr>
                    <th>专项督查</th>
                    <td colspan="3">
                        <label class="lbl-check">
                            <input value="PatrolInspection" type="checkbox" name="PatrolInspection" />
                            巡察巡查
                        </label>
                        <label class="lbl-check">
                            <input value="PostsAndStaff" type="checkbox" name="PostsAndStaff" />
                            “定岗定职”专项督导
                        </label>
                    </td>
                    <th>督查年月</th>
                    <td>
                        <input type="text" name="sStartDate" class="input-text w-100 f-l " placeholder="起始时间" />
                        <span> 至 </span>
                        <input type="text" name="sEndDate" class="input-text w-100 f-l " placeholder="终止时间" />
                    </td>
                </tr>
                <tr>
                    <td colspan="6">
                        <input type="submit" class="btn btn-primary f-r mr-5" value="查询" />
                    </td>
                </tr>
            </table>
        </form>
    </div>
    <div class="cl"></div>
    <hr class="w-900 f-l " />
    <div id="divPsntForQuery" class="mt-10">
        <div id="psntForQuery"></div>
    </div>
    <script src="../lib/jquery/jquery-1.11.3.min.js"></script>
    <script src="../lib/h-ui/js/H-ui.min.js"></script>
    <script src="../lib/layer/layer.js"></script>
    <script src="../lib/Validform/Validform_v5.3.2.js"></script>
    <script src="../lib/Validform/Validform_Datatype.js"></script>
    <script src="../lib/My97DatePicker/WdatePicker.js"></script>
    <script src="../lib/controls/NameBox/namebox.js"></script>
    <script src="../lib/jquery.form.js"></script>
    <script src="../lib/common.js"></script>
    <script src="../lib/jquery.ext.js"></script>
    <script src="../script/common.js"></script>
    <script src="../lib/controls/btctable/control.js"></script>
    <script src="query.js"></script>
</body>
</html>