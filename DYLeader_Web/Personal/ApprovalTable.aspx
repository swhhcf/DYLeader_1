<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
    <link href="../lib/h-ui/css/H-ui.min.css" rel="stylesheet" />
    <link href="../lib/Hui-iconfont/1.0.8/iconfont.css" rel="stylesheet" />
    <link href="../lib/zTree/css/metroStyle/metroStyle.css" rel="stylesheet" />
    <link href="../lib/controls/btctable/style.css" rel="stylesheet" />
    <style>
        body > div {
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            width: 1000px;
        }

        input[type="radio"] {
            cursor: pointer;
            width: 16px;
            height: 16px;
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

        td {
            width: 80px;
            text-align: center;
        }

        img {
            width: 150px;
            height: 200px
        }

        h3 {
            padding-top: 0 !important;
        }

        .w-900 {
            width: 1000px;
        }
    </style>
</head>
<body>
    <div class="w-900">
        <h3 class="f-l ">干部任免审批表</h3>
        <span id="spnClose" class="f-r btn btn-link" title="" onclick="parent.layer.closeAll()"><i class="Hui-iconfont">&#xe6a6;</i>关闭</span>
        <span class="f-r btn btn-link" title="导出" onclick="exportDoc(0)"><i class="Hui-iconfont">&#xe644;</i>导出</span>
    </div>
    <div class="cl"></div>
    <div>
        <table class="w-900" id="info">
            <tr>
                <td>姓名 </td>
                <td><span id="Fullname"></span></td>
                <td>性别 </td>
                <td><span id="Gender"></span></td>
                <td>出生年月 </td>
                <td><span id="Birthday"></span><span id="Age"></span></td>
                <td rowspan="4" colspan="2" style="width: 150px; height: 200px" id="Picture">
                    <img alt="照片" />
                </td>
            </tr>
            <tr>
                <td>民族 </td>
                <td><span id="Ethnicity"></span></td>
                <td>籍贯 </td>
                <td><span id="NativeOrigin"></span></td>
                <td>出生地 </td>
                <td><span id="NativePlace"></span></td>
            </tr>
            <tr>
                <td>入党时间 </td>
                <td><span id="JoinDate"></span></td>
                <td>参加工作时间 </td>
                <td><span id="WorkDate"></span></td>
                <td>健康状况 </td>
                <td><span id="Status"></span></td>
            </tr>
            <tr>
                <td>专业技术职务 </td>
                <td colspan="2"><span id="MajorDegree"></span></td>
                <td>熟悉专业有何专长 </td>
                <td colspan="2"><span id="Speciality"></span></td>
            </tr>
            <tr>
                <td rowspan="2">学历学位 </td>
                <td>全日制教育</td>
                <td colspan="2"><span id="FullBackgroundDegree"></span></td>
                <td>毕业院校及专业 </td>
                <td colspan="3"><span id="FullSchoolMajor"></span></td>
            </tr>
            <tr>
                <td>在职教育</td>
                <td colspan="2"><span id="GoOnBackgroundDegree"></span></td>
                <td>毕业院校及专业 </td>
                <td colspan="3"><span id="GoOnSchoolMajor"></span></td>
            </tr>
            <tr>
                <td>现任职务 </td>
                <td colspan="7"><span id="Duty"></span></td>
            </tr>
            <!--<tr>
            <td >简历  </td>
            <td colspan="7"> </td>
        </tr>-->
            <tr>
                <td rowspan="7">简历 </td>
                <td colspan="2">单位 </td>
                <td>职务 </td>
                <td>职级 </td>
                <td>开始时间 </td>
                <td colspan="2">结束时间 </td>
            </tr>
            <tr id="WorkExperience"></tr>
            <!--<tr>
            <td>奖惩情况 </td>
            <td colspan="7"> </td>
        </tr>-->
            <tr>
                <td rowspan="7">奖惩情况 </td>
                <td>名称</td>
                <td>奖励或处分</td>
                <td>发布单位 </td>
                <td>级别 </td>
                <td>时间 </td>
                <td colspan="2">在职单位 </td>
            </tr>
            <tr id="RewardPunish">

                <!--<tr>
                <td>年度考核结果 </td>
                <td colspan="7"> </td>
            </tr>-->
                <tr>
                    <td rowspan="7">年度考核结果 </td>
                    <td colspan="2">时间</td>
                    <td>等级</td>
                    <td colspan="4">在职单位</td>
                </tr>
            <tr id="AnnualAppraisal">
            <tr>
                <td>任免理由 </td>
                <td colspan="7"></td>
            </tr>
            <tr>
                <td rowspan="9">家庭主要成员及重要社会关系 </td>
                <td>称谓 </td>
                <td>姓名 </td>
                <td>出生年月 </td>
                <td>政治面貌 </td>
                <td colspan="3">工作单位及职务 </td>
            </tr>
            <tr id="family"></tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td colspan="3"></td>
            </tr>
            <tr>
                <td>呈报单位 </td>
                <td colspan="7"></td>
            </tr>
            <tr>
                <td>审批机关意见 </td>
                <td colspan="3"></td>
                <td>行政机关任免意见 </td>
                <td colspan="3"></td>
            </tr>
        </table>
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
    <script>
        //$(function () {
        var IdCard = $.btcData.getQueryString('PersonalIdCard');

        var isShowClose = $.btcData.getQueryString('isShowClose') == '1';
        if (IdCard == null || IdCard == '') {
            IdCard = $.btcData.getQueryString('personalIdCard');
        }

        $(function () {
            var psnlInfo = $.mvcData.get('Method.GetList', { table: 'VPersonal', personalIdCard: IdCard }).rows[0];
            if (isShowClose) {
                $('#spnClose').remove();
            }
            $('#info').setFormCtrlValue(psnlInfo);
            var gender = $("#Gender").html();
            if (gender == 1) {
                $("#Gender").html('男');
            } else {
                $("#Gender").html('女');
            }
            var age = $("#Age").html();
            $("#Age").html('(' + age + '岁)');

            var PicAddr = IdCard; // '330724197001011235';
            // $("#Picture").html("<img src= '../Picture/330724197001011235.jpg' />");
            $("#Picture").html("<img src= '../Picture/" + PicAddr + ".jpg' />");
            psnlInfo = $.mvcData.get('Method.GetList', { table: 'VPolitics', personalIdCard: IdCard }).rows[0];

            $('#info').setFormCtrlValue(psnlInfo);

            //psnlInfo = $.mvcData.get('Method.GetList', { table: 'FamilyMember', personalIdCard: IdCard }).rows[0];
            //$('#info').setFormCtrlValue(psnlInfo);
            //var fulname = psnlInfo.Fullname ;
            //$('#Fm_Fullname').html(fulname);
            //  var testDatas = $.mvcData.get('Method.GetList', { table: 'FamilyMember', personalIdCard: IdCard }).rows;
            // var fulname = testDatas[1].Fullname;
            // $('#Fm_Fullname').html(fulname);

            //工作履历
            var testDatas = $.mvcData.get('Method.GetList', { table: 'WorkExperience', personalIdCard: IdCard }).rows;
            insertBefore('#WorkExperience',
                testDatas,
                [2, 1, 1, 1, 2],
                5,
                'WorkUnit',
                'Duty',
                'Degree',
                'StartDate',
                'EndDate');

            //奖惩情况
            testDatas = $.mvcData.get('Method.GetList', { table: 'VRewardPunish', personalIdCard: IdCard }).rows;
            insertBefore('#RewardPunish',
                testDatas,
                [1, 1, 1, 1, 1, 2],
                5,
                'Memo',
                'RewardOrPunish',
                'ReleaseUnit',
                'Degree',
                'Date',
                'WorkUnit');

            //年度考核
            testDatas = $.mvcData.get('Method.GetList', { table: 'AnnualAppraisal', personalIdCard: IdCard }).rows;
            insertBefore('#AnnualAppraisal', testDatas, [2, 1, 4], 5, 'Date', 'Degree', 'WorkUnit');

            //家庭成员
            testDatas = $.mvcData.get('Method.GetList', { table: 'VFamilyMember', personalIdCard: IdCard }).rows;
            insertBefore('#family',
                testDatas,
                [1, 1, 1, 1, 3],
                6,
                'Relation',
                'Fullname',
                'FmBirthday',
                'PoliticsStatus',
                'WorkAndDuty');
        });
        function insertBefore(target, datas, template, rowCount) {
            //target : 要在哪个之前插入，如上面的 '#test'
            //datas: 如上面所示，如果用$.mvcData.get()方式调用的，格式为 $.mvcData.get().rows
            //template 示例：[1,1,1,1,3], 为各列的合并列数
            //rowCount: 模板中的行数
            //后面的参数是各列的 key
            var args = arguments;
            var keys = [];
            var trs = [];
            var tdTemplate = '<td colspan="{0}">{1}</td>';
            for (var i = 4; i < args.length; i++) {
                keys.push(args[i]);
            }
            var count = datas.length > rowCount ? rowCount : datas.length;
            for (var j = 0; j < count; j++) {
                var info = datas[j];
                var tds = [];
                for (var k = 0; k < keys.length; k++) {
                    tds.push(tdTemplate.format(template[k], info[keys[k]]));
                }
                trs.push('<tr>' + tds.join('') + '</tr>');
            }

            for (var m = count; m < rowCount; m++) {
                var tdss = [];
                for (var n = 0; n < keys.length; n++) {
                    tdss.push(tdTemplate.format(template[n], ''));
                }
                trs.push('<tr>' + tdss.join('') + '</tr>');
            }

            //如果要在后面插入，把下面的 before 改为 after 即可
            $(target).before(trs.join(''));
        }

        function exportDoc() {
            var url = $.mvcData.getString('Export.Main', { personalIdCard: IdCard }, false);
            window.open(url);
        }

                                                    //})
    </script>
</body>
</html>