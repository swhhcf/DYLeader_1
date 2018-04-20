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
        html, body, form {
            text-align: left;
            /*width: 99%;*/
            padding: 0 !important;
            margin: 0 !important;
        }

        .w-300 {
            width: 300px;
        }

        .tab-div {
            width: 100%;
            clear: both;
            /*margin: auto;*/
        }

        form div {
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

        form input[type="submit"] {
            margin-left: 288px;
            clear: both;
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

        .w-100 {
            width: 300px;
        }
    </style>
</head>
<body>
    <div id="div0" class="HuiTab" role="tablist">
        <!--<div class="tabBar clearfix">
            <span onclick="setVisabledTabIndex(0)">违法违纪</span>
            <span onclick="setVisabledTabIndex(1)">信访反映</span>
            <span onclick="setVisabledTabIndex(2)">立案审查</span>
            <span onclick="setVisabledTabIndex(3)">违章建房</span>
            <span onclick="setVisabledTabIndex(4)">巡查督查</span>
        </div>-->
        <div id="divToolBar">
            <!--真实内容-->
            <div>
                <!--<span class="btn btn-link hide" title="" onclick="showThisDlg(false)"><i class="Hui-iconfont">&#xe600;</i>新增</span>-->
                <span class="btn btn-link hide" title="" onclick="showThisDlg(true)"><i class="Hui-iconfont">&#xe6df;</i>修改</span>
                <span class="btn btn-link hide" title="" onclick="delInfo()"><i class="Hui-iconfont">&#xe609;</i>删除</span>
                <span class="btn btn-link" title="" onclick="parent.layer.closeAll()"><i class="Hui-iconfont">&#xe6a6;</i>关闭</span>
            </div>
        </div>

        <!--违法违纪-->
        <div class="tabCon tab-div" id="divViolatingLaw">
            <div id="ViolatingLawList"></div>
        </div>
        <!--信访反映-->
        <div class="tabCon tab-div" id="divPetition">
            <div id="PetitionList"></div>
        </div>
        <!--立案审查-->
        <div class="tabCon tab-div" id="divFiling">
            <div id="FilingList"></div>
        </div>
        <!--违章建房-->
        <div class="tabCon tab-div" id="divViolationHouse">
            <div id="ViolationHouseList"></div>
        </div>
        <!--巡查督查-->
        <div class="tabCon tab-div" id="divInspectorInspection">
            <div id="InspectorInspectionList"></div>
        </div>

        <div id="dlgViolatingLaw" class="hide">
            <!--   -->
            <form id="frmViolatingLaw" action="/AjaxMethod/Save.cspx?table=InspectorInspection" method="post">
                <!-- 违法违纪ViolatingLaw        -->
                <!--<div><label>id</label>-->
                <input type="hidden" name="ID" value="" />
                <div><label>身份证号</label><input type="text" name="PersonalIdCard" value="" class="input-text  w-100" /></div>
                <div><label>预警类型</label><textarea name="ContentKind" class="input-text w-100"></textarea></div>
                <div><label>处理结果</label><input type="text" name="TreatmentResult" value="" class="input-text  w-300" /></div>
                <div><label>上报时间</label><input type="text" name="Date" class="input-text w-100" /></div>
                <div><label>上报单位</label><input type="text" name="ReportUnit" value="" class="input-text  w-100" /></div>

                <div><label>处理时间</label><input type="text" name="TreatmentDate" value="" class="input-text  w-100" /></div>
                <div><label>预警内容</label><textarea name="Content" cols="50" rows="10" value="" class="textarea   w-300"></textarea> </div>

                <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>

        <!--<div id="dlgPetition" class="hide">
            <form id="frmPetition" action="/AjaxMethod/Save.cspx?table=Petition" method="post">
                <!--信访反映Petition -->
        <!--<div><label>id</label><input type="text" name="ID" value="" class="input-text  w-300" /></div>
                <div><label>身份证号</label><input type="text" name="IdCard" value="" class="input-text  w-300" /></div>
                <div><label>时间</label><input type="text" name="Date" value="" class="input-text  w-300" /></div>
                <div><label>信访人姓名</label><input type="text" name="UserName" value="" class="input-text  w-300" /></div>
                <div><label>内容</label><textarea name="Content" cols="50" rows="15" class="textarea w-300"></textarea></div>
                <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>
        <div id="dlgFiling" class="hide">
            <form id="frmFiling" action="/AjaxMethod/Save.cspx?table=Filing" method="post">-->
        <!--立案审查Filing -->
        <!--<div><label>id</label><input type="text" name="ID" value="" class="input-text  w-300" /></div>
                <div><label>身份证号</label><input type="text" name="IdCard" value="" class="input-text  w-300" /></div>
                <div><label>时间</label><input type="text" name="Date" value="" class="input-text  w-300" /></div>
                <div><label>地点</label><input type="text" name="Place" value="" class="input-text  w-300" /></div>
                <div><label>立案事由</label><textarea name="Content" cols="50" rows="10" class="textarea w-300"></textarea></div>
                <input type="submit" class="btn btn-success size-M mt-10 mb-15" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>
        <div id="dlgViolationHouse" class="hide">
            <form id="frmViolationHouse" action="/AjaxMethod/Save.cspx?table=ViolationHouse" method="post">-->
        <!--违章建房ViolationHouse-->
        <!--<div><label>id</label><input type="text" name="ID" value="" class="input-text  w-300" /></div>
                <div><label>身份证号</label><input type="text" name="IdCard" value="" class="input-text  w-300" /></div>
                <div><label>时间</label><input type="text" name="Date" value="" class="input-text  w-300" /></div>
                <div><label>地点</label><input type="text" name="Place" value="" class="input-text  w-300" /></div>
                <div><label>内容</label><textarea name="Content" cols="50" rows="15" class="textarea w-300"></textarea></div>
                <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>
        <div id="dlgInspectorInspection" class="hide">
            <form id="frmInspectorInspection" action="/AjaxMethod/Save.cspx?table=InspectorInspection" method="post">-->
        <!--巡查督查InspectorInspection-->
        <!--<div><label>id</label><input type="text" name="ID" value="" class="input-text  w-300" /></div>
                <div><label>身份证号</label><input type="text" name="IdCard" value="" class="input-text  w-300" /></div>
                <div><label>时间</label><input type="text" name="Date" value="" class="input-text  w-300" /></div>
                <div><label>内容</label><textarea name="Content" cols="50" rows="15" class="textarea w-300"></textarea></div>
                <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>-->
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
    <script src="Inspection.js"></script>
</body>
</html>