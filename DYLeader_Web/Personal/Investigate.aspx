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
    </style>
</head>
<body>
    <div id="div0" class="HuiTab" role="tablist">
        <div class="tabBar clearfix">
            <span onclick="setVisabledTabIndex(0)">平时考察</span>
            <span onclick="setVisabledTabIndex(1)">专项考察</span>
            <span onclick="setVisabledTabIndex(2)">年度考核</span>
            <span onclick="setVisabledTabIndex(3)">民主测评</span>
            <span onclick="setVisabledTabIndex(4)">民主推荐</span>
        </div>
        <div id="divToolBar">
            <!--真实内容-->
            <div>
                <span class="btn btn-link hide" title="" onclick="showThisDlg(false)"><i class="Hui-iconfont">&#xe600;</i>新增</span>
                <span class="btn btn-link hide" title="" onclick="showThisDlg(true)"><i class="Hui-iconfont">&#xe6df;</i>修改</span>
                <span class="btn btn-link hide" title="" onclick="delInfo()"><i class="Hui-iconfont">&#xe609;</i>删除</span>
                <span class="btn btn-link" title="" onclick="parent.layer.closeAll()"><i class="Hui-iconfont">&#xe6a6;</i>关闭</span>
            </div>
        </div>

        <!--平时考察-->
        <div class="tabCon tab-div" id="divOrdinaryInspection">
            <div id="OrdinaryInspectionList"></div>
        </div>
        <!--专项考察-->
        <div class="tabCon tab-div" id="divSpecialInspection">
            <div id="SpecialInspectionList"></div>
        </div>
        <!--年度考核-->
        <div class="tabCon tab-div" id="divAnnualAppraisal">
            <div id="AnnualAppraisalList"></div>
        </div>
        <!--民主测评-->
        <div class="tabCon tab-div" id="divDemocraticEvaluation">
            <div id="DemocraticEvaluationList"></div>
        </div>
        <!--民主推荐-->
        <div class="tabCon tab-div" id="divDemocraticRecommendation">
            <div id="DemocraticRecommendationList"></div>
        </div>

        <div id="dlgOrdinaryInspection" class="hide">
            <!--考察情况Investigate-->
            <form id="frmOrdinaryInspection" action="/AjaxMethod/Save.cspx?table=OrdinaryInspection" method="post">
                <!--考察情况 平时考察OrdinaryInspection        -->
                <input type="hidden" name="ID" value="" />
                <input type="hidden" name="PersonalIdCard" value="88" />
                <div><label>时间</label><input type="text" required name="Date" value="" onblur="$.dyDatePicker(this)" class="input-text  w-300" /></div>
                <div><label>效果</label>
                    <textarea name="Effect" rows="5" cols="45"></textarea>
                 <%--<input type="text" required name="Effect" value="" class="input-text w-300" />--%>
                </div>
                <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>

        <div id="dlgSpecialInspection" class="hide">
            <form id="frmSpecialInspection" action="/AjaxMethod/Save.cspx?table=SpecialInspection" method="post">
                <!--考察情况 专项考察SpecialInspection-->
                <input type="hidden" name="ID" value="" />
                <input type="hidden" name="PersonalIdCard" value="88" />
                <div><label>考察内容</label><input type="text" required name="InspectionContent" value="" class="input-text w-300" /></div>
                <div><label>上级考察部门</label><input type="text" required name="Superior" value="" class="input-text w-300" /></div>
                <div><label>时间</label><input type="text" required name="Date" value="" class="input-text w-300" /></div>
                <div><label>结论</label>
                     <textarea name="Conclusion" rows="5" cols="45"></textarea>
                  <%--<input type="text" required name="Conclusion" value="" class="input-text w-300" />--%>

                </div>
                
                <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>
        <div id="dlgAnnualAppraisal" class="hide">
            <form id="frmAnnualAppraisal" action="/AjaxMethod/Save.cspx?table=AnnualAppraisal" method="post">
                <!--考察情况 年度考核AnnualAppraisal-->
                <input type="hidden" name="ID" value="" />
                <input type="hidden" name="PersonalIdCard" value="88" />
                <div><label>在职单位</label><input type="text" required name="WorkUnit" value="" class="input-text w-300" /></div>
                <div><label>时间</label><input type="text" required name="Date" value="" class="input-text w-300" /></div>
                <div><label>等级</label><input type="text" required name="Degree" value="" class="input-text w-300" /></div>
                <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>
        <div id="dlgDemocraticEvaluation" class="hide">
            <form id="frmDemocraticEvaluation" action="/AjaxMethod/Save.cspx?table=DemocraticEvaluation" method="post">
                <!--考察情况 民主测评DemocraticEvaluation-->
                <input type="hidden" name="ID" value="" />
                <input type="hidden" name="PersonalIdCard" value="88" />
                <div><label>测评内容</label><input type="text" required name="Content" value="" class="input-text w-300" /></div>
                <div><label>参加测评人数</label><input type="text" required name="Number" value="" class="input-text w-300" /></div>
               
                <div><label>时间</label><input type="text" required name="Date" value="" class="input-text w-300" /></div>
                 <div><label>评价</label>
                      <textarea name="Conclusion" rows="5" cols="45"></textarea>
                    <%-- <input type="text" required name="Conclusion" value="" class="input-text w-300" />--%>

                 </div>
                <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
                <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
            </form>
        </div>
        <div id="dlgDemocraticRecommendation" class="hide">
            <form id="frmDemocraticRecommendation" action="/AjaxMethod/Save.cspx?table=DemocraticRecommendation" method="post">
                <!--考察情况 民主推荐DemocraticRecommendation-->
                <input type="hidden" name="ID" value="" />
                <input type="hidden" name="PersonalIdCard" value="88" />
                <div>
                    <label>推荐单位</label><input type="text" required name="RecommendationUnit" value="" class="input-text w-300" />
                </div>
                <div>
                    <label>地点</label><input type="text" required name="Place" value="" class="input-text w-300" />
                </div>
                <div>
                    <label>时间</label><input type="text" required name="Date" value="" class="input-text w-300" />
                </div>
                <div>
                    <label>参加人数</label><input type="text" required name="Number" value="" class="input-text w-300" />
                </div>
                <div>
                    <label>占比（%）</label><input type="text" required name="Proportion" value="" class="input-text w-300" />
                </div>

                <div>
                    <label>内容</label><textarea name="Content" rows="5" cols="45" rows="20" class="input-text w-300"></textarea>
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
    <script src="../lib/Validform/jquery.validate.js"></script>
    <script src="../lib/My97DatePicker/WdatePicker.js"></script>
    <script src="../lib/controls/NameBox/namebox.js"></script>
    <script src="../lib/jquery.form.js"></script>
    <script src="../lib/common.js"></script>
    <script src="../lib/jquery.ext.js"></script>
    <script src="../script/common.js"></script>
    <script src="../lib/controls/btctable/control.js"></script>
    <script src="Investigate.js"></script>
</body>
</html>