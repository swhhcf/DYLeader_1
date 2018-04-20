/// <reference path="/lib/jquery.form.js"/>
/// <reference path="/lib/jquery/jquery-1.7.2-vsdoc.js"/>
/// <reference path="/lib/common.js"/>
/// <reference path="/lib/jquery.ext.js"/>
/// <reference path="/script/common.js"/>
/// <reference path="/lib/controls/btctable/control.js"/>

var $Table = {
    eduExperience: null
};

var PersonalIdCard = $.btcData.getQueryString('personalIdCard');

var TABLE_Objs = new Array(8);

$(function () {
    $('form').find('input,.lbl-check').click(function () {
        $('[type="submit"]').hide();
        $(this).parents('form').find('[type="submit"]').show();
    });
    loadTable();
});

function loadTable() {
    PersonalIdCard = 88;
    var option = {
        url: $.mvcData.path('List.Query'),
        parms: {},
        heightDiff: 75,
        form: '#frmSearch',
        radio: false
    };

    // #region
    var eduExperienceOption = $.extend(true, {}, option);
    eduExperienceOption.cols = [
        { display: '姓名', name: 'Fullname', width: 150, align: 'left' },
        { display: '身份证号', name: 'IdCard', width: 100, align: 'left' },
        { display: '性别', name: 'Gender', width: 32, rend: [1, '男', 0, '女'] },
        { display: '出生日期', name: 'Birthday', width: 80 },
        { display: '工作单位', name: 'WorkUnit', width: 90 },
        { display: '职务', name: 'Duty', width: 90, align: 'left' },
        { display: '职级', name: 'WorkDegree', width: 80, align: 'left' },
        //{ display: '学校', name: 'School', width: 150, align: 'left' },
        //{ display: '院系', name: 'Department', width: 100, align: 'left' },
        { display: '毕业专业', name: 'Major', width: 100, align: 'left' },
        { display: '学历', name: 'EduBackground', width: 120, align: 'left' },
        { display: '奖励等级', name: 'RewardDegree', width: 120, align: 'left' },
        { display: '奖励次数', name: 'RewardCount', width: 120, align: 'left' },
        { display: '处分等级', name: 'PunishDegree', width: 120, align: 'left' },
        { display: '处分次数', name: 'PunishCount', width: 120, align: 'left' }
    ];
    $Table.eduExperience = $('#psntForQuery').btcTable(eduExperienceOption);
    // #endregion
}