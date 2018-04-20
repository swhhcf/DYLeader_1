<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title></title>
    <link href="../lib/h-ui/css/H-ui.min.css" rel="stylesheet" />
    <link href="../lib/Hui-iconfont/1.0.8/iconfont.css" rel="stylesheet" />
    <link href="../lib/controls/btctable/style.css" rel="stylesheet" />
    <link href="../lib/controls/NameBox/style.css" rel="stylesheet" />
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

        .w-900 {
            width: 900px;
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
        <div id="divTab" class="tabBar clearfix">
            <span class=" ml-10" onclick="setVisabledTabIndex(0)">个人基本信息</span>
            <span onclick="setVisabledTabIndex(1)">教育简历</span>
            <span onclick="setVisabledTabIndex(2)">工作简历</span>
            <span onclick="setVisabledTabIndex(3)">技术职务</span>
            <span onclick="setVisabledTabIndex(4)">奖惩情况</span>
            <span onclick="setVisabledTabIndex(5)">年度考核情况</span>
            <span onclick="setVisabledTabIndex(6)">家庭成员及社会关系</span>
            <span onclick="setVisabledTabIndex(7)">拟任免职务</span>
        </div>

        <!--公用工具栏-->
        <div id="divToolBar">
            <!--真实内容-->
            <div>
                <span class="btn btn-link hide" title="" onclick="showThisDlg(false)"><i class="Hui-iconfont">&#xe600;</i>新增</span>
                <span class="btn btn-link hide" title="" onclick="showThisDlg(true)"><i class="Hui-iconfont">&#xe6df;</i>修改</span>
                <span class="btn btn-link hide" title="" onclick="delInfo()"><i class="Hui-iconfont">&#xe609;</i>删除</span>
                <span class="btn btn-link" title="" onclick="$('#frmpersonal').submit()"><i class="Hui-iconfont">&#xe632;</i>保存</span>
                <span class="btn btn-link" title="" onclick="parent.layer.closeAll()"><i class="Hui-iconfont">&#xe6a6;</i>关闭</span>
            </div>
        </div>

        <!--个人基本信息-->
        <div id="divPersonal" class="tabCon tab-div w-900" style="overflow-y: auto;">
            <!--<div>个人信息</div>-->
            <div class="f-l" style="width: 900px;">
                <form id="frmpersonal" method="post">
                    <div class="f-l">
                        <input type="hidden" name="ID" value="" />
                        <div>
                            <label>姓名</label><input type="text" datatype="zh2-4" nullmsg="请输入中文。" errormsg="只能输入2-4位中文。" name="Fullname" value="" class="input-text w-300" required />
                        </div>
                        <div>
                            <label>身份证号</label><input datatype="idcard" nullmsg="please input idcard" errormsg="please check idcard" id="IdCard_1" type="text" name="PersonalIdCard" value="" class="input-text w-300" onblur="myclick(this)" />
                        </div>
                        <div>
                            <label>性别</label>
                            <label class="lbl-check">
                                <input type="radio" value="1" name="Gender">男</label>
                            <label class="lbl-check">
                                <input type="radio" value="0" name="Gender">女</label>
                        </div>
                        <div class="cl"></div>
                        <div>
                            <label>出生年月</label><input id="Birthday_1" type="text" name="Birthday" value="" class="input-text w-300" />
                        </div>
                        <div>
                            <label>民族</label>
                            <input type="text" name="Ethnicity" class="input-text w-300" value="汉族" />
                            <!--<div type="text" id="Ethnicity" class="input-text w-300 f-l mt-0"></div>-->
                        </div>
                        <div class="cl"></div>
                        <div>
                            <label>籍贯</label>
                            <input type="text" name="NativeOrigin" class="input-text w-300" value="" />
                            <!--<div type="text" id="NativeOrigin" class="input-text w-300 f-l mt-0"></div>-->
                        </div>
                        <div class="cl"></div>
                        <div>
                            <label>出生地</label>
                            <input type="text" name="NativePlace" class="input-text w-300" value="" />
                            <!--<div type="text" id="NativePlace" class="input-text w-300 f-l mt-0"></div>-->
                        </div>
                    </div>

                    <!--照片-->
                    <div class="f-l ml-50">
                        <iframe id="ifrPic" style="width: 180px; height: 220px; border: none;" scrolling="no" src="picture.aspx"></iframe>
                    </div>

                    <div class="cl"></div>
                    <div class="f-l">
                        <label>参加工作时间</label>
                        <input name="WorkDate" type="text" class="input-text w-300" onblur="$.dyDatePicker(this)" />
                    </div>
                    <div class="f-l" style="margin-left: -10px;">
                        <label>曾用名</label><input type="text" name="UsedName" value="" class="input-text w-300" />
                    </div>
                </form>
            </div>
            <div class="cl"></div>

            <!--政治面貌-->
            <form id="frmPolitical" method="post" action="">
                <input type="hidden" name="ID" value="" />
                <input type="hidden" name="PersonalIdCard" value="" />
                <div class="f-l">
                    <label>政治面貌</label>
                    <div class="w-300 f-l mt-0">
                        <label class="lbl-check">
                            <input type="radio" name="PoliticsStatus" value="中共党员">中共党员</label>
                        <label class="lbl-check">
                            <input type="radio" name="PoliticsStatus" value="民主党派">民主党派</label>
                        <label class="lbl-check">
                            <input type="radio" name="PoliticsStatus" value="群众">群众</label>
                    </div>
                </div>
                <!--<div class="cl"></div>-->
                <div class="f-l">
                    <label>入党时间</label><input type="text" name="JoinDate" value="" onblur="$.dyDatePicker(this)" class="input-text w-300" />
                </div>
            </form>
            <div class="cl"></div>

            <!--家庭地址-->
            <form id="frmAddr" method="post">
                <input type="hidden" name="ID" value="" />
                <input type="hidden" name="PersonalIdCard" value="" />
                <div class="f-l">
                    <label>住址</label><input type="text" name="Addr" value="" class="input-text w-300" />
                </div>
                <div class="f-l">
                    <label>联系电话</label><input type="text" name="Tel" value="" class="input-text w-300" />
                </div>
            </form>
            <div class="cl"></div>

            <!--现单位-->
            <form id="frmWorkUnit" method="post">
                <input type="hidden" name="ID" value="" />
                <input type="hidden" name="PersonalIdCard" value="" />
                <input type="hidden" name="Status" value="1" />
                <div class="f-l">
                    <label>单位</label>
                    <input type="hidden" id="DeptID" name="DeptID" />
                    <input type="text" id="NowWorkUnit" name="WorkUnit" readonly="readonly" value="" class="input-text w-300" />
                    <!--<div type="text" id="WorkUnit" class="input-text w-300 f-l mt-0"></div>-->
                </div>
                <div class="f-l">
                    <label>科室</label>
                    <input type="hidden" id="SectionID" name="SectionID" />
                    <input type="text" id="NowSectionName" name="SectionName" readonly="readonly" value="" class="input-text w-300" />
                    <!--<div type="text" id="SectionName" class="input-text w-300 f-l mt-0"></div>-->
                </div>
                <div class="cl"></div>
                <!--<div>
                    <label>单位</label><input type="text" id="WorkUnit" name="WorkUnit" value="" class="input-text w-300" />
                </div>

                <div>
                    <label> 科室</label><input type="text" name="SectionName" value="" class="input-text w-300" />
                </div>-->
                <div class="f-l">
                    <label>任现职时间</label><input type="text" name="StartDate" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
                </div>
                <div class="f-l">
                    <label>身份类别</label><select name="Identity" class="input-text size-M w-300">
                        <option value="">=请选择=</option>
                        <option value="公务员">公务员</option>
                        <option value="参公">参公</option>
                        <option value="事业">事业</option>
                    </select>
                </div>
                <div class="cl"></div>
                <div class="f-l">
                    <label>职务</label><input type="text" name="Duty" value="" class="input-text w-300" />
                </div>
                <div class="f-l">
                    <label>职级</label><select name="Degree" class="input-text size-M w-300">
                        <option value="">=请选择=</option>
                        <option value="正科">正科</option>
                        <option value="副科">副科</option>
                        <option value="中层正职">中层正职</option>
                        <option value="中层副职">中层副职</option>
                    </select>
                </div>
                <input type="hidden" name="IsPresent" value="1" />
            </form>
        </div>

        <!--教育情况-->
        <div class="tabCon tab-div" id="divEduExperience">
            <div id="eduList"></div>
        </div>

        <!--工作履历-->
        <div class="tabCon tab-div" id="divWorkExperience">
            <div id="WorkExperienceList"></div>
        </div>

        <!--技术职务-->
        <div class="tabCon tab-div" id="divMajorDegree">
            <div id="MajorDegreeList"></div>
        </div>

        <!--奖惩情况-->
        <div class="tabCon tab-div" id="divRewardPunish">
            <div id="RewardPunishList"></div>
        </div>

        <!--年度考核-->
        <div class="tabCon tab-div" id="divAnnualAppraisal">
            <div id="AnnualAppraisalList"></div>
        </div>

        <!--家庭成员-->
        <div class="tabCon tab-div" id="divFamilyMember">
            <div id="FamilyMemberList"></div>
        </div>

        <!--拟任免职务-->
        <div class="tabCon tab-div" id="divPlaneAppointRemove">
            <div id="PlaneAppointRemoveList" class="hide"></div>
            <iframe id="ifrApproval" style="width: 100%; height: 100%; border: none;" src="about:blank"></iframe>
        </div>
    </div>

    <!--教育情况dlg-->
    <div id="dlgEdu" class="hide pl-10">
        <form id="frmEdu" action="/AjaxMethod/Save.cspx?table=EduExperience" method="post">
            <div>
                <input type="hidden" name="ID" value="" />
            </div>
            <div>
                <input type="hidden" name="PersonalIdCard" value="" />
            </div>
            <div>
                <label>是否为全日制</label>
                <label class="lbl-check">
                    <input type="radio" value="1" name="IsFullTime">是</label>
                <label class="lbl-check">
                    <input type="radio" value="0" name="IsFullTime">否</label>
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
                <input type="text" name="StartDate" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
            </div>
            <div>
                <label>毕结业时间</label>
                <input type="text" name="EndDate" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
            </div>
            <div>
                <label>毕结业状态</label>
                <label class="lbl-check">
                    <input type="radio" value="毕业" name="Status">毕业</label>
                <label class="lbl-check">
                    <input type="radio" value="结业" name="Status">结业</label>
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
                <label class="lbl-check">
                    <input type="radio" value="1" name="IsHighest">是</label>
                <label class="lbl-check">
                    <input type="radio" value="0" name="IsHighest">否</label>
            </div>
            <div class="cl"></div>
            <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
            <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
        </form>
    </div>

    <!--工作履历dlg-->
    <div id="dlgWorkExperience" class="hide pl-10">
        <form id="frmWorkExperience" action="/AjaxMethod/Save.cspx?table=WorkExperience" method="post">
            <div>
                <input type="hidden" name="ID" value="" />
            </div>
            <div>
                <input type="hidden" name="PersonalIdCard" value="" />
            </div>
            <div>
                <label>单位</label><input type="text" name="WorkUnit" value="" class="input-text w-300" />
            </div>

            <div>
                <label>科室名称</label><input type="text" name="SectionName" value="" class="input-text w-300" />
            </div>
            <div>
                <label>开始时间</label><input type="text" name="StartDate" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
            </div>
            <div>
                <label>结束时间</label><input type="text" name="EndDate" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
            </div>
            <div>
                <label>职务</label><input type="text" name="Duty" value="" class="input-text w-300" />
            </div>
            <div>
                <label>职级</label><select name="Degree" class="select w-300">
                    <option value="">=请选择=</option>
                    <option value="正科">正科</option>
                    <option value="副科">副科</option>
                    <option value="中层正职">中层正职</option>
                    <option value="中层副职">中层副职</option>
                </select>
            </div>

            <div>
                <label>是否现任</label>
                <label class="lbl-check">
                    <input type="radio" value="1" name="Status">是</label>
                <label class="lbl-check">
                    <input type="radio" value="0" name="Status">否</label>
            </div>

            <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
            <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
        </form>
    </div>

    <!--技术职务dlg-->
    <div id="dlgMajorDegree" class="hide pl-10">
        <form id="frmMajorDegree" action="/AjaxMethod/Save.cspx?table=MajorDegree" method="post">
            <div>
                <input type="hidden" name="ID" value="" />
            </div>
            <div>
                <input type="hidden" name="PersonalIdCard" value="" />
            </div>
            <div>
                <label>专业方向</label>
                <input type="text" name="Major" value="" class="input-text w-300" />
            </div>
            <div>
                <label>专业特长</label>
                <input type="text" name="Speciality" value="" class="input-text w-300" />
            </div>
            <div>
                <label>技术等级</label>
                <input type="text" name="Degree" value="" class="input-text w-300" />
            </div>
            <div>
                <label>取得时间</label>
                <input type="text" name="Date" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
            </div>
            <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
            <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
        </form>
    </div>

    <!--奖惩情况dlg-->
    <div id="dlgRewardPunish" class="hide pl-10">
        <form id="frmRewardPunish" action="/AjaxMethod/Save.cspx?table=RewardPunish" method="post">
            <div>
                <input type="hidden" name="ID" value="" />
            </div>
            <div>
                <input type="hidden" name="PersonalIdCard" value="" />
            </div>
            <div>
                <label>在职单位</label>
                <input type="text" name="WorkUnit" value="" class="input-text w-300" />
            </div>
            <div>
                <label>奖励或处分</label>
                <input type="text" name="IsReward" value="" class="input-text w-300" />
            </div>
            <div>
                <label>时间</label>
                <input type="text" name="Date" value="" class="input-text w-300" onclick="$.dyDatePicker(this)" />
            </div>
            <div>
                <label>发布单位</label>
                <input type="text" name="ReleaseUnit" value="" class="input-text w-300" />
            </div>
            <div>
                <label>级别</label>
                <input type="text" name="Degree" value="" class="input-text w-300" />
            </div>
            <div>
                <label>事由</label>
                <textarea name="Memo" rows="5" cols="43"> </textarea>
                <%--<input type="text" name="Memo" value="" class="input-text w-300" />--%>
            </div>
            <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
            <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
        </form>
    </div>

    <!--年度考核dlg-->
    <div id="dlgAnnualAppraisal" class="hide pl-10">
        <form id="frmAnnualAppraisal" action="/AjaxMethod/Save.cspx?table=AnnualAppraisal" method="post">
            <div>
                <input type="hidden" name="ID" value="" />
            </div>
            <div>
                <input type="hidden" name="PersonalIdCard" value="" />
            </div>
            <div>
                <label>在职单位</label>
                <input type="text" name="WorkUnit" value="" class="input-text w-300" />
            </div>
            <div>
                <label>时间</label>
                <input type="text" name="Date" value="" class="input-text w-300" onclick="$.dyDatePicker" />
            </div>
            <div>
                <label>等级</label>
                <input type="text" name="Degree" value="" class="input-text w-300" />
            </div>
            <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
            <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
        </form>
    </div>

    <!--家庭成员dlg-->
    <div id="dlgFamilyMember" class="hide pl-10">
        <form id="frmFamilyMember" action="/AjaxMethod/Save.cspx?table=FamilyMember" method="post">
            <div>
                <input type="hidden" name="ID" value="" />
            </div>
            <div>
                <input type="hidden" name="PersonalIdCard" value="" />
            </div>
            <div>
                <label>关系</label>
                <input type="text" name="Relation" value="" class="input-text w-300" />
            </div>
            <div>
                <label>姓名</label>
                <input type="text" name="Fullname" value="" class="input-text w-300" />
            </div>
            <div>
                <label>出生年月</label>
                <input type="text" name="FmBirthDay" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
            </div>
            <div>
                <label>政治面貌：</label>
                <div class="w-300 f-l mt-0">
                    <label class="lbl-check">
                        <input type="radio" name="PoliticsStatus" value="中共党员">中共党员</label>
                    <label class="lbl-check">
                        <input type="radio" name="PoliticsStatus" value="民主党派">民主党派</label>
                    <label class="lbl-check">
                        <input type="radio" name="PoliticsStatus" value="群众">群众</label>
                </div>
            </div>
            <div>
                <label>工作单位</label>
                <input type="text" name="WorkUnit" value="" class="input-text w-300" />
            </div>
            <div>
                <label>职务</label>
                <input type="text" name="Duty" value="" class="input-text w-300" />
            </div>
            <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
            <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
        </form>
    </div>

    <!--拟任免职务dlg-->
    <div id="dlgPlaneAppointRemove" class="hide pl-10">
        <form id="frmPlaneAppointRemove" action="/AjaxMethod/Save.cspx?table=PlaneAppointRemove" method="post">
            <div>
                <input type="hidden" name="ID" value="" />
            </div>
            <div>
                <input type="hidden" name="PersonalIdCard" value="" />
            </div>
            <div>
                <label>拟任职务</label>
                <input type="text" name="Appoint" value="" class="input-text w-300" />
            </div>
            <div>
                <label>拟免职务</label>
                <input type="text" name="Remove" value="" class="input-text w-300" />
            </div>
            <div>
                <label>任免理由</label>
                <input type="text" name="Memo" value="" class="input-text w-300" />
            </div>
            <div>
                <label>呈报单位</label>
                <input type="text" name="ReportingUnit" value="" class="input-text w-300" />
            </div>
            <div>
                <label>呈报时间</label>
                <input type="text" name="ReportingDate" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
            </div>
            <div>
                <label>审批机关</label>
                <input type="text" name="ExaminationAuthority" value="" class="input-text w-300" />
            </div>

            <div>
                <label>审批时间</label>
                <input type="text" name="ExaminationDate" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
            </div>
            <div>
                <label>行政机关任免意见</label>
                <input type="text" name="AppointmentOpinion" value="" class="input-text w-300" />
            </div>
            <div>
                <label>行政机关任免时间</label>
                <input type="text" name="AppointmentDate" value="" class="input-text w-300" onblur="$.dyDatePicker(this)" />
            </div>
            <div>
                <label>填表人姓名</label>
                <input type="text" name="FillFormName" value="" class="input-text w-300" />
            </div>

            <input type="submit" class="btn btn-success size-M mt-10 mb-10" value="保存" />
            <input type="button" class="btn btn-secondary size-M mt-10 mb-10 ml-5" onclick="layer.closeAll()" value="关闭" />
        </form>
    </div>
    <script src="../lib/jquery/jquery-1.11.3.min.js"></script>
    <script src="../lib/h-ui/js/H-ui.min.js"></script>
    <script src="../lib/ajaxupload.js"></script>
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
    <script src="personal.js"></script>
</body>
</html>