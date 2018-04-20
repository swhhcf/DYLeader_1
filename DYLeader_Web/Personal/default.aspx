<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
    <link href="../lib/h-ui/css/H-ui.min.css" rel="stylesheet" />
    <link href="../lib/Hui-iconfont/1.0.8/iconfont.css" rel="stylesheet" />
    <link href="../lib/zTree/css/metroStyle/metroStyle.css" rel="stylesheet" />
    <link href="../lib/controls/btctable/style.css" rel="stylesheet" />
    <link href="../lib/controls/NameBox/style.css" rel="stylesheet" />
    <link href="../static/common.css" rel="stylesheet" />
    <style>
        body, html {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        }

        .h-40 {
            height: 40px;
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

        #frmQuerySearch span {
            margin: 5px 3px 0 3px !important;
            float: left;
        }

        form td {
            background-color: #fff !important;
        }

        form th {
            border: 1px #c9c9c9 solid;
            text-align: right;
            background-color: #f0f0f0 !important;
        }

        input[type="radio"], input[type="checkbox"] {
            cursor: pointer;
            width: 16px;
            height: 16px;
        }

        #divDeptMgr form label {
            margin-top: 10px;
        }

        #divDeptMgr form input[type="submit"] {
            margin-left: 307px;
        }

        #divDeptMgr label {
            cursor: pointer;
        }

        .w-300 {
            width: 300px !important;
        }

        .w-120 {
            width: 120px;
        }

        .w-92 {
            width: 92px;
        }

        .b-t-1 {
            border-top: 1px solid #c8c8c8;
            background-color: #f9f9f9;
        }

        .mt-12 {
            margin-top: 12px;
        }

        .h-100 {
            height: 100px;
        }

        .w-188 {
            width: 185px;
        }

        .w-100 {
            width: 100px;
        }

        .ml-3 {
            margin-left: 3px;
        }

        .mt--1 {
            margin-top: -1px;
        }

        .w-300 {
            width: 300px;
        }

        .ml-28 {
            margin-left: 28px;
        }

        #left {
            background-color: #efefef;
            margin: 0;
            padding: 10px;
            padding-right: 0;
            box-shadow: 5px 0 10px #999;
            width: 240px;
            /*font-size: 14px !important;*/
        }

        .ztree span {
            font-size: 14px !important;
        }

        .ztree li a.curSelectedNode {
            padding-top: 0;
            background-color: #999;
            color: #fff;
            height: 21px;
            opacity: 0.8;
        }

        #content {
            position: absolute;
            top: 80px;
            left: 260px;
            background-color: #f9f9f9;
        }

        #tool {
            width: 100%;
            margin-top: 8px;
            /*margin-left: -10px;*/
            background-color: #aeebff;
            height: 30px;
            line-height: 30px;
            box-shadow: 0 0 5px #999;
            z-index: 999 !important;
        }

        #divList {
            z-index: 80;
        }

        table {
            z-index: 70;
        }

        .container {
            margin-left: 260px;
        }

        .li-selected {
            background-color: #999999;
        }

        .navbar-nav > ul > li, .navbar-nav > ul > li > a {
            line-height: 30px;
            font-size: 14px;
        }

        .btn-link {
            color: #004ac4;
        }

        .btcSCOption:hover {
            background-color: #59abff !important;
            color: white !important;
        }

        .navbar-black {
            background-color: #4fabb6;
            border-bottom: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: none;
        }

        .navbar-black {
            background-color: #4fabb6;
        }

        .navbar {
            position: relative;
            z-index: 1030;
            background-color: #4fabb6;
        }

        .btn-link:hover,
        .btn-link:focus,
        .btn-link:active,
        .btn-link.active {
            color: #002b73;
        }

        form > div {
            margin-top: 10px;
        }

        .ml-244 {
            margin-left: 244px;
        }

        /*超编数为正数时的颜色*/
        .dy-color1 {
            color: red;
            background-color: white;
        }

        /*超编数为 0 时的颜色*/
        .dy-color0 {
            color: black;
            background-color: white;
        }

        /*超编数为负数时的颜色*/
        .dy-color-1 {
            color: blue;
            background-color: white;
        }
    </style>
    <script src="../lib/jquery/jquery-1.11.3.min.js"></script>
    <script src="../static/h-ui/js/H-ui.min.js"></script>
    <script src="../lib/zTree/js/jquery.ztree.core.min.js"></script>
    <script src="../lib/jquery.form.js"></script>
    <script src="../lib/common.js"></script>
    <script src="../lib/jquery.ext.js"></script>
    <script src="../script/common.js"></script>
    <script src="../lib/controls/btctable/control.js"></script>
    <script src="../lib/controls/NameBox/namebox.js"></script>
    <script src="../lib/layer/layer.js"></script>
    <script src="../lib/jquery.ext.js"></script>
</head>
<body>
    <div style="width: 100%; height: 44px; line-height: 44px; color: #fff; background-color: #9A9A9B; font-size: 19px; padding-left: 20px;">
        <div class="f-l">东阳市干部管理信息系统</div>
        <div class="f-r mr-30"><span style="cursor: pointer;" onclick="logout()"><i class="Hui-iconfont">&#xe726;</i></span></div>
    </div>
    <div style="width: 100%; height: 22px;">
        <header class="navbar-wrapper">
            <div class="navbar navbar-black">
                <div class="container cl">
                    <nav class="nav navbar-nav nav-collapse" role="navigation" id="Hui-navbar">
                        <ul class="cl">
                            <li class="li-selected"><a href="#" onclick="changeType(0,this)">基本情况</a></li>
                            <li><a href="#" onclick="changeType(1,this)">督查信息</a></li>
                            <li><a href="#" onclick="changeType(2,this)">分管情况</a></li>
                            <li><a href="#" onclick="changeType(3,this)">考察情况</a></li>
                            <li><a href="#" onclick="changeType(4,this)">专项督查</a></li>
                            <li><a href="#" onclick="changeType(5,this)">培训信息</a></li>
                            <li><a href="#" onclick="changeType(7,this)">编制情况</a></li>
                            <li><a href="#" onclick="changeType(6,this)">综合查询</a></li>
                            <li><a href="#" onclick="changeType(8,this)">单位管理</a></li>
                        </ul>
                    </nav>
                    <nav class="navbar-userbar hidden-xs">
                    </nav>
                </div>
            </div>
        </header>
    </div>
    <div class="cl"></div>
    <div id="left" class="f-l ztree f-14" style="overflow-y: auto;">
        <%--<div id="divDeptTree"></div>--%>
    </div>

    <div id="content">
        <div id="list">
            <!--搜索用-->
            <div class="mt-5 ml-20">
                <form id="frmSearch">
                    <label>姓名<input type="text" name="Fullname" class="input-text w-100 ml-5" /></label>
                    <label id="seDate" class="ml-10">
                        起止日期<input type="text" name="StartDate" class="input-text w-100 ml-5" placeholder="起始时间" />
                        <span>至 </span>
                        <input type="text" name="EndDate" class="input-text w-100" placeholder="终止时间" /></label>
                    <label id="lblTrain" class="hide">
                        <input type="checkbox" name="NoTrain" class="input-text w-100 ml-5" value="1" />未参加培训</label>
                    <%--<label class="ml-5">性别：<input name="Gender" type="text" class="input-text size-S w-100" /></label>--%>
                    <input type="submit" value="查询" class="btn btn-primary ml-10 mt--1" />
                    <input type="reset" value="重置" class="btn btn-primary ml-10 mt--1" />
                </form>
            </div>
            <div class="cl"></div>

            <!--工具条-->
            <div id="tool">
                <div class="ml-10">
                    <span class="btn btn-link" title="导出所有查询结果" onclick="operate(0)"><i class="Hui-iconfont">&#xe644;</i>导出</span>
                    <span class="btn btn-link" title="导入信息" onclick="importPersonal()"><i class="Hui-iconfont">&#xe645;</i>导入</span>
                    <span class="btn btn-link" title="" onclick="operate(1)"><i class="Hui-iconfont">&#xe627;</i>查看</span>
                    <span class="btn btn-link hide" title="" onclick="operate(2)"><i class="Hui-iconfont">&#xe600;</i>新增</span>
                    <%--<span class="btn btn-link hide" title="" onclick="operate(3)"><i class="Hui-iconfont">&#xe6df;</i>修改</span>--%>
                    <span class="btn btn-link hide" title="" onclick="operate(4)"><i class="Hui-iconfont">&#xe6ee;</i>调动</span>
                    <span class="btn btn-link hide" title="" onclick="operate(5)"><i class="Hui-iconfont">&#xe67a;</i>调离</span>
                    <span class="btn btn-link hide" title="" onclick="operate(6)"><i class="Hui-iconfont">&#xe726;</i>退休</span>
                    <span class="btn btn-link hide" title="" onclick="downTemplate()"><i class="Hui-iconfont">&#xe640;</i>下载模板</span>
                </div>
            </div>

            <!--数据表格-->
            <div id="divList">

                <div id="personal" class="ml-20 hide">
                </div>
                <div id="inspection" class="ml-20 hide">
                </div>
                <%--                <div id="divsion" class="ml-20 hide">
                </div>--%>

                <%--                <div id="ivestigate" class="ml-20 hide">
                </div>--%>
                <%--                <div id="special" class="ml-20 hide">
                </div>--%>
                <div id="other" class="ml-20 hide">
                </div>
            </div>
            <!--分管情况-->
            <div id="div02" class="HuiTab hide ml-20 b-t-1" role="tablist">
                <div class="tabBar clearfix">
                    <span onclick="loadDivitionTable(0)">分管工作</span>
                    <span onclick="loadDivitionTable(1)">重点工程及重点工作</span>
                </div>
                <!--公用工具栏-->
                <%--   <div id="divToolBar">
                    <!--真实内容-->
                    <div>
                        <span class="btn btn-link hide" title="" onclick="showThisDlg(false)"><i class="Hui-iconfont">&#xe600;</i>新增</span>
                        <span class="btn btn-link hide" title="" onclick="showThisDlg(true)"><i class="Hui-iconfont">&#xe6df;</i>修改</span>
                        <span class="btn btn-link hide" title="" onclick="delInfo()"><i class="Hui-iconfont">&#xe609;</i>删除</span>
                        <span class="btn btn-link" title="" onclick="$('#frmpersonal').submit()"><i class="Hui-iconfont">&#xe632;</i>保存</span>
                        <span class="btn btn-link" title="" onclick="parent.layer.closeAll()"><i class="Hui-iconfont">&#xe6a6;</i>关闭</span>
                    </div>
                </div>--%>

                <!--分管工作 list-->
                <div class="tabCon tab-div">
                    <div id="divitionList"></div>
                </div>
                <!--重点工程及重点工作 list-->
                <div class="tabCon tab-div">
                    <div id="keyProjectList"></div>
                </div>
                <!--平时考察dlg-->
            </div>

            <!--考察情况-->
            <div id="div03" class="HuiTab hide ml-20 b-t-1" role="tablist">
                <div class="tabBar clearfix">
                    <span onclick="loadInstTable_Investigate(2)">平时考察</span>
                    <span onclick="loadInstTable_Investigate(3)">专项考察</span>
                    <span onclick="loadInstTable_Investigate(4)">年度考核</span>
                    <span onclick="loadInstTable_Investigate(5)">民主测评</span>
                    <span onclick="loadInstTable_Investigate(6)">民主推荐</span>
                </div>
                <!--公用工具栏-->
                <%--   <div id="divToolBar">
                    <!--真实内容-->
                    <div>
                        <span class="btn btn-link hide" title="" onclick="showThisDlg(false)"><i class="Hui-iconfont">&#xe600;</i>新增</span>
                        <span class="btn btn-link hide" title="" onclick="showThisDlg(true)"><i class="Hui-iconfont">&#xe6df;</i>修改</span>
                        <span class="btn btn-link hide" title="" onclick="delInfo()"><i class="Hui-iconfont">&#xe609;</i>删除</span>
                        <span class="btn btn-link" title="" onclick="$('#frmpersonal').submit()"><i class="Hui-iconfont">&#xe632;</i>保存</span>
                        <span class="btn btn-link" title="" onclick="parent.layer.closeAll()"><i class="Hui-iconfont">&#xe6a6;</i>关闭</span>
                    </div>
                </div>--%>

                <!--平时考察 list-->
                <div class="tabCon tab-div" id="divOrdinaryInspection">
                    <div id="OrdinaryInspectionList"></div>
                </div>
                <!--专项考察div list-->
                <div class="tabCon tab-div" id="divSpecialInspection">
                    <div id="SpecialInspectionList"></div>
                </div>
                <!--年度考核div list-->
                <div class="tabCon tab-div" id="divAnnualAppraisal">
                    <div id="AnnualAppraisalList"></div>
                </div>
                <!--民主测评div list-->
                <div class="tabCon tab-div" id="divDemocraticEvaluation">
                    <div id="DemocraticEvaluationList"></div>
                </div>
                <!--民主推荐div list-->
                <div class="tabCon tab-div" id="divDemocraticRecommendation">
                    <div id="DemocraticRecommendationList"></div>
                </div>

                <!--平时考察dlg-->
            </div>

            <div id="div04" class="HuiTab hide ml-20 b-t-1" role="tablist">
                <div class="tabBar clearfix">
                    <span onclick="loadSpecailTable(0)">巡察巡查</span>
                    <span onclick="loadSpecailTable(1)">定岗定职</span>
                </div>
                <!--巡察巡查-->
                <div class="tabCon tab-div" id="divPatrolInspection">
                    <div id="PatrolInspectionList"></div>
                </div>

                <!--2.“定岗定职”专项督导-->
                <div class="tabCon tab-div" id="divPostsAndStaff">
                    <div id="PostsAndStaffList"></div>
                </div>
                <!--平时考察dlg-->
            </div>
        </div>
        <div id="div0" class="HuiTab hide ml-20 b-t-1" role="tablist">
            <div class="tabBar clearfix">
                <span onclick="setVisabledTabIndex(0)">干部编制情况</span>
                <span onclick="setVisabledTabIndex(1)">年龄结构</span>
                <span onclick="setVisabledTabIndex(2)">性别结构</span>
                <%--<span onclick="setVisabledTabIndex(3)">学历结构</span>--%>
                <%--<span onclick="setVisabledTabIndex(4)">经历结构</span>--%>
                <%--<span onclick="setVisabledTabIndex(5)">专业结构</span>--%>
            </div>

            <!--干部编制情况div list-->
            <div class="tabCon tab-div" id="divInstitutions">
                <div id="InstitutionsList"></div>
            </div>
            <!--年龄结构div list-->
            <div class="tabCon tab-div" id="divAgeStructure">
                <div id="AgeStructureList"></div>
            </div>
            <!--性别结构div list-->
            <div class="tabCon tab-div" id="divGenderStructure">
                <div id="GenderStructureList"></div>
            </div>
            <!--学历结构div list-->
            <%--<div class="tabCon tab-div" id="divEducationStructure">
                <div id="EducationStructureList"></div>
            </div>--%>
            <!--经历结构div list-->
            <%--<div class="tabCon tab-div" id="divLeaderStructure">
                <div id="LeaderStructureList"></div>
            </div>--%>
            <!--专业结构div list-->
            <%--<div class="tabCon tab-div" id="divMajorStructure">
                <div id="MajorStructureList"></div>
            </div>--%>

            <!--干部编制情况dlg-->
            <div id="dlgInstitutions" class="hide pl-10">
                <form id="frmInstitutions" action="/AjaxMethod/Save.cspx?table=Institutions" method="post">
                    <!--<div>
                     <input type="hidden" name="ID" value="" />
                 </div>
                 <div>
                     <input type="hidden" name="PersonalIdCard" value="88" />
                 </div>-->

                    <div>
                        <label>单位名称</label>
                        <input type="text" name="UnitName" value="" class="input-text w-300" />
                    </div>
                    <div>
                        <label>领导正职人数</label>
                        <input type="text" name="Leadership" value="" class="input-text w-300" />
                    </div>
                    <div>
                        <label>领导副职人数</label>
                        <input type="text" name="LeaderDeputy" value="" class="input-text w-300" />
                    </div>
                    <div>
                        <label>中层人数</label>
                        <input type="text" name="MiddleLvel" value="" class="input-text w-300" onfocus="$.dyDatePicker()" />
                    </div>

                    <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                    <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
                </form>
            </div>
        </div>

        <div id="query" class="hide ml-20">
            <div id="queryContent">
                <form id="frmQuerySearch">
                    <table>
                        <tr>
                            <th style="width: 70px;">单位</th>
                            <td style="width: 195px;">
                                <input type="text" name="WorkUnit" class="input-text f-l" placeholder="单位名称" /></td>
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
                                <span>至 </span>
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
                            <td colspan="3">
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
                            <%--<th style="width: 70px;">专业名称</th>
                            <td style="width: 150px;">
                                <input type="text" name="Major" class="f-l input-text" /></td>--%>
                        </tr>
                        <tr>
                            <th>身份类别</th>
                            <td colspan="1">
                                <label class="lbl-check">
                                    <input value="公务员" type="checkbox" name="Identity" />
                                    公务员
                                </label>
                                <label class="lbl-check">
                                    <input value="参公" type="checkbox" name="Identity" />
                                    参公
                                </label>
                                <label class="lbl-check">
                                    <input value="事业" type="checkbox" name="Identity" />
                                    事业
                                </label>
                            </td>
                            <th>职级</th>
                            <td colspan="3">
                                <label class="lbl-check">
                                    <input value="正科" type="checkbox" name="DutyDegree" />
                                    正科
                                </label>
                                <label class="lbl-check">
                                    <input value="副科" type="checkbox" name="DutyDegree" />
                                    副科
                                </label>
                                <label class="lbl-check">
                                    <input value="中层正职" type="checkbox" name="DutyDegree" />
                                    中层正职
                                </label>
                                <label class="lbl-check">
                                    <input value="中层副职" type="checkbox" name="DutyDegree" />
                                    中层副职
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>专业名称</th>
                            <td colspan="5">
                                <input type="text" name="Major" class="f-l input-text w-300" />
                                <label class="lbl-check ml-5 mt-5">
                                    <input value="major" type="checkbox" class="ml-5" name="MajorTable" />
                                    专业
                                </label>
                                <label class="lbl-check mt-5">
                                    <input value="speciality" type="checkbox" name="MajorTable" />
                                    特长
                                </label>
                                <label class="lbl-check mt-5">
                                    <input value="work" type="checkbox" name="MajorTable" />
                                    分管工作和重点工程
                                </label>
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
        </div>

        <!--单位管理-->
        <div id="divDeptMgr" class="hide ml-20 b-t-1">
            <div class="tabBar clearfix">
                <span>修改</span>
                <span>新增同级单位</span>
                <span>新增下级单位</span>
            </div>
            <div class="mt-10">单位编码请在已有的编码后面再次输入三位数字</div>
            <!--修改-->
            <div class="tabCon tab-div">
                <form id="frmEditDept" action="/AjaxDept/Edit.cspx" method="post">
                    <input type="hidden" name="id" />
                    <%--<div>单位名称<input type="text" name="fullName"  required="required" class="input-text ml-5 w-300" /></div>--%>
                    <div>单位名称<input type="text" name="name" required="required" class="input-text ml-5 w-300" /></div>
                    <div>
                        是否有效
                        <label>
                            <input type="radio" name="isUsing" value="1" checked="checked" />是</label>
                        <label>
                            <input type="radio" name="isUsing" value="0" />否</label>
                    </div>
                    <input class="mt-10 btn btn-primary" type="submit" value="确定" />
                </form>
            </div>

            <!--新增同级单位-->
            <div class="tabCon tab-div">
                <form id="frmNewDept" action="/AjaxDept/New.cspx" method="post">
                    <input type="hidden" name="pId" />
                    <div>单位编码<input type="text" name="id" required="required" class="input-text ml-5 w-300" /></div>
                    <div>单位名称<input type="text" name="name" required="required" class="input-text ml-5 w-300" /></div>
                    <input type="hidden" name="isUsing" value="1" />
                    <%--<div>单位简称<input type="text" name="name" class="input-text ml-5 w-300" /></div>--%>
                    <input class="mt-10 btn btn-primary" type="submit" value="确定" />
                </form>
            </div>

            <!--新增下级单位-->
            <div class="tabCon tab-div">
                <form id="frmSubDept" action="/AjaxDept/New.cspx" method="post">
                    <input type="hidden" name="pId" />
                    <div>单位编码<input type="text" name="id" required="required" class="input-text ml-5 w-300" /></div>
                    <div>单位名称<input type="text" name="name" required="required" class="input-text ml-5 w-300" /></div>
                    <input type="hidden" name="isUsing" value="1" />
                    <%--<div>单位简称<input type="text" name="name" class="input-text ml-5 w-300" /></div>--%>
                    <input class="mt-10 btn btn-primary" type="submit" value="确定" />
                </form>
            </div>
        </div>
    </div>

    <div id="dlgMovePersonal" class="hide mt-10">
        <div class="f-l">
            <div class="mt-10">
                <label class="lbl-title">姓名</label><input type="text" name="Fullname" value="" class="input-text w-300" readonly="readonly" />
            </div>
            <div class="mt-10">
                <label class="lbl-title">身份证号</label><input type="text" name="PersonalIdCard" value="" class="input-text w-300" readonly="readonly" />
            </div>
            <div class="mt-10">
                <label class="lbl-title">性别</label>
                <div class="f-l mt-3">
                    <label class="lbl-check">
                        <input type="radio" value="1" name="Gender">男</label>
                    <label class="lbl-check">
                        <input type="radio" class="ml-5" value="0" name="Gender">女</label>
                </div>
            </div>
            <div class="cl"></div>
            <div class="mt-10">
                <label class="lbl-title">出生年月</label><input type="text" name="Birthday" value="" class="input-text w-300" readonly="" />
            </div>
            <form action="/AjaxMethod/Save.cspx?table=WorkExperience" method="post" id="frmMovePersonal">
                <div class="mt-10">
                    <label class="lbl-title">变动日期</label>
                    <input type="text" name="StartDate" class="input-text w-300" value="" />
                    <input type="hidden" name="PersonalIdCard" value="" />
                    <input type="hidden" id="DeptID" name="DeptID" />
                </div>
                <div class="mt-10">
                    <label class="lbl-title">单位</label><div id="WorkUnit" class="input-text w-300 f-l mt-0"></div>
                    <input type="text" id="NowWorkUnit" name="WorkUnit" class="input-text w-300 hide" />
                </div>
                <div class="cl"></div>
                <div class="mt-10">
                    <label class="lbl-title">科室</label><input type="text" class="input-text w-300" name="SectionName" value="" />
                </div>
                <div class="cl"></div>
                <div class="f-l mt-10">
                    <label class="lbl-title">职务</label><input type="text" name="Duty" value="" class="input-text w-300" />
                </div>
                <div class="cl"></div>
                <div class="f-l mt-10">
                    <label class="lbl-title">职级</label><select name="Degree" class="input-text size-M w-300">
                        <option value="">=请选择=</option>
                        <option value="正科">正科</option>
                        <option value="副科">副科</option>
                        <option value="中层正职">中层正职</option>
                        <option value="中层副职">中层副职</option>
                        <option value="">无</option>
                    </select>
                </div>
                <div class="cl"></div>
                <div style="margin-left: 273px; margin-top: 10px;">
                    <input type="submit" class="btn btn-primary" value="确定" />
                    <input type="button" class="btn btn-secondary ml-5" onclick="layer.closeAll()" value="取消" />
                </div>
            </form>
        </div>
    </div>

    <!--业务培训dlg-->
    <div id="dlgTra" class="hide pl-10">
        <form id="frmTra" action="/AjaxMethod/Save.cspx?table=TrainingLearning" method="post">
            <input type="hidden" name="ID" value="" />
            <input type="hidden" name="PersonalIdCard" id="personalIdCard" value="" />
            <div>
                <label class="ml-28 f-l">姓名</label>
                <div class="input-text w-300 f-l ml-5" id="fullName"></div>
            </div>
            <div class="cl"></div>
            <div>
                <label>培训班次</label>
                <input type="text" name="TrainingClass" value="" class="input-text w-300" required="required" />
            </div>
            <div>
                <label>开始时间</label>
                <input type="text" name="StartDate" value="" class="input-text w-300" onfocus="$.dyDatePicker()" required="required" />
            </div>
            <div>
                <label class="ml-28">学时</label>
                <input type="text" name="ClassHour" value="" class="input-text w-300" required="required" />
            </div>

            <div class="cl"></div>
            <input type="submit" class="btn btn-success size-M mb-10 ml-244" value="保存" />
            <input type="button" class="btn btn-secondary size-M mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
        </form>
    </div>

    <!--选择人员-->
    <div id="dlgSelectPsnl" class="hide">
        <div class="mt-10">
            <label class="f-l ml-10">请输入姓名</label>
            <input type="hidden" name="PersonalIdCard" id="selPersonalIdCard" value="" />
            <div class="input-text w-300 f-l ml-5" id="selFullName"></div>
            <div class="cl"></div>
            <div class="mt-10 text-r pr-15 h-40">
                <input type="button" class="btn btn-primary mr-10" id="btnInputIdCard" value="确定" />
                <input type="button" class="btn btn-secondary" onclick="layer.closeAll()" value="取消" />
            </div>
            <div class="cl"></div>
        </div>
    </div>

    <script src="default.js"></script>
</body>
</html>