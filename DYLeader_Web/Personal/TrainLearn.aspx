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
            width: 100%;
            padding: 0;
            margin: 0;
        }

        .w-300 {
            width: 300px;
        }

        .tab-div {
            width: 100%;
            clear: both;
            /*margin: auto;*/
        }

        label {
            float: left;
            width: 60px;
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
            margin-left: 248px;
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

        form > div {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div id="div0" class="HuiTab ml-10" role="tablist">
        <!--<div id="divTab" class="tabBar clearfix">
            <span onclick="setVisabledTabIndex(0)">业务培训</span>
            <span onclick="setVisabledTabIndex(1)">学历教育</span>
        </div>-->
        <!--<div class="tabBar clearfix">
            <span onclick="setVisabledTabIndex(0)">教育培训学习情况</span>
        </div>-->
        <!--公用工具栏-->
        <div id="divToolBar">
            <!--真实内容-->
            <div>
                <span class="btn btn-link hide" onclick="showThisDlg(false)"><i class="Hui-iconfont">&#xe600;</i>新增</span>
                <span class="btn btn-link hide" onclick="showThisDlg(true)"><i class="Hui-iconfont">&#xe6df;</i>修改</span>
                <span class="btn btn-link hide" onclick="delInfo()"><i class="Hui-iconfont">&#xe609;</i>删除</span>
                <span class="btn btn-link hide" onclick="parent.layer.closeAll()"><i class="Hui-iconfont">&#xe6a6;</i>关闭</span>
            </div>
        </div>

        <!--教育情况div list-->
        <div id="divTra">
            <div id="TraList"></div>
        </div>

        <div class="tabCon tab-div" id="divEdu">
            <div id="EduList"></div>
        </div>
        <!--教育情况dlg
        <div id="dlgEdu" class="hide pl-10">
            <form id="frmEdu" action="/AjaxMethod/Save.cspx?table=EduExperience" method="post">
                <div>
                    <input type="hidden" name="ID" value="" />
                </div>
                <div>
                    <input type="hidden" name="PersonalIdCard" value="88" />
                </div>
                <div>
                    <label>是否为全日制</label>
                    <label class="lbl-check"><input type="radio" value="1" name="IsFullTime">是</label>
                    <label class="lbl-check"><input type="radio" value="0" name="IsFullTime">否</label>
                </div>
                <div class="cl"></div>
                <div>
                    <label>学校</label>
                    <input type="text" name="School" value="" class="input-text w-300" />
                </div>
                <div>
                    <label>院系</label>
                    <input type="text" name="Department" value="" class="input-text w-300" />
                </div>
                <div>
                    <label>专业</label>
                    <input type="text" name="Major" value="" class="input-text w-300" />
                </div>
                <div>
                    <label>入学时间</label>
                    <input type="text" name="StartDate" value="" class="input-text w-300" onfocus="$.dyDatePicker(this)" />
                </div>
                <div>
                    <label>毕结业时间</label>
                    <input type="text" name="EndDate" value="" class="input-text w-300" onfocus="$.dyDatePicker(this)" />
                </div>
                <div>
                    <label>毕结业状态</label>
                    <label class="lbl-check"><input type="radio" value="毕业" name="Status">毕业</label>
                    <label class="lbl-check"><input type="radio" value="结业" name="Status">结业</label>
                </div>
                <div class="cl"></div>
                <div>
                    <label>学历</label>
                    <input type="text" name="EduBackground" value="" class="input-text w-300" />
                </div>
                <div>
                    <label>学位</label>
                    <input type="text" name="Degree" value="" class="input-text w-300" />
                </div>
                <div>
                    <label>是否为最高学历</label>
                    <label class="lbl-check"><input type="radio" value="1" name="IsHighest">是</label>
                    <label class="lbl-check"><input type="radio" value="0" name="IsHighest">否</label>
                </div>
                <div class="cl"></div>
                <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>-->
    </div>

    <!--业务培训dlg-->
    <div id="dlgTra" class="hide pl-10">
        <form id="frmTra" action="/AjaxMethod/Save.cspx?table=TrainingLearning" method="post">
            <div>
                <input type="hidden" name="ID" value="" />
            </div>
            <div>
                <input type="hidden" name="PersonalIdCard" value="88" />
            </div>
            <div>
                <label>培训班次</label>
                <input type="text" name="TrainingClass" value="" class="input-text w-300" />
            </div>
            <div>
                <label>开始时间</label>
                <input type="text" name="StartDate" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" onchange="setThisDate(this.value)" />
                <input type="hidden" name="Date" value="" />
            </div>
            <div>
                <label>学时</label>
                <input type="text" name="ClassHour" value="" class="input-text w-300" />
            </div>

            <div class="cl"></div>
            <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
            <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
        </form>
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
    <script src="TrainLearn.js"></script>
</body>
</html>