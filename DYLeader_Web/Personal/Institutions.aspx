<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title></title>
    <link href="../lib/h-ui/css/H-ui.min.css" rel="stylesheet" />
    <link href="../lib/controls/btctable/style.css" rel="stylesheet" />
    <link href="../lib/controls/NameBox/style.css" rel="stylesheet" />
    <link href="../lib/Hui-iconfont/1.0.8/iconfont.css" rel="stylesheet" />
    <style>
        body, form {
            text-align: left;
            width: 99%;
        }

        .w-300 {
            width: 300px;
        }

        .tab-div {
            width: 100%;
            clear: both;
            /*margin: auto;*/
        }

        /*.tab-div div {
                margin-top: 10px;
            }*/

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
    <div id="div0" class="HuiTab" role="tablist">
        <div class="tabBar clearfix">
            <span onclick="setVisabledTabIndex(0)">干部编制情况</span>
            <span onclick="setVisabledTabIndex(1)">年龄结构</span>
            <span onclick="setVisabledTabIndex(2)">性别结构</span>
            <span onclick="setVisabledTabIndex(3)">学历结构</span>
            <span onclick="setVisabledTabIndex(4)">经历结构</span>
            <%--            <span onclick="setVisabledTabIndex(5)">专业结构</span>--%>
        </div>
        <!--公用工具栏-->
        <div id="divToolBar">
            <!--真实内容-->
            <div>
                <span class="btn btn-link hide" title="" onclick="showThisDlg(false)"><i class="Hui-iconfont">&#xe600;</i>新增</span>
                <span class="btn btn-link hide" title="" onclick="showThisDlg(true)"><i class="Hui-iconfont">&#xe6df;</i>修改</span>
                <span class="btn btn-link hide" title="" onclick="delInfo()"><i class="Hui-iconfont">&#xe609;</i>删除</span>
                <span class="btn btn-link" title="" onclick="parent.layer.closeAll()"><i class="Hui-iconfont">&#xe6a6;</i>关闭</span>
            </div>
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
        <div class="tabCon tab-div" id="divEducationStructure">
            <div id="EducationStructureList"></div>
        </div>
        <!--经历结构div list-->
        <div class="tabCon tab-div" id="divLeaderStructure">
            <div id="LeaderStructureList"></div>
        </div>
        <!--专业结构div list-->
        <div class="tabCon tab-div" id="divMajorStructure">
            <div id="MajorStructureList"></div>
        </div>

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
                    <input type="text" name="MiddleLvel" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
                </div>

                <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>
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
    <script src="Institutions.js"></script>
</body>
</html>