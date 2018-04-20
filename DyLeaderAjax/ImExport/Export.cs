using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Btc.Data;
using Btc.NewCommon;
using Btc.Word;
using CYQ.Data;
using MyMVC;
using Xceed.Words.NET;

namespace DyLeader
{
    public class AjaxExport
    {
        [Action]
        public static string Main(string personalIdCard)
        {
            if (personalIdCard.IsNullOrEmpty())
            {
                return SJson.Error;
            }
            var rootPath = AppDomain.CurrentDomain.BaseDirectory + @"\download\Approval\";
            var doc = DocX.Load(rootPath + "Template.docx");
            var filename = "";
            using (var action = new MAction(ViewNames.VPersonal))
            {
                var where = "PersonalIdCard".ToWhere(personalIdCard, false) + " and IsUsing=1";
                var dt = action.Select(where, "*");

                filename = dt.Rows[0]["Fullname"].Value + "_" + personalIdCard + "_" +
                           DateTime.Now.ToString("yyyyMMddHHmmss") + ".docx";
                var deFilename = rootPath + filename;
                doc.SaveAs(deFilename);

                doc = DocX.Load(deFilename);

                //个人信息
                doc.SetText(dt, new[] { "Gender", "1", "男", "0", "女" });

                //工作简历
                action.ResetTable(TableNames.WorkExperience);
                dt = action.Select(where + " order by startDate");
                doc.SetText(dt, null, 6);

                //奖惩情况
                action.ResetTable(ViewNames.VRewardPunish);
                dt = action.Select(where + " order by Date");
                doc.SetText(dt, null, 7);

                //年度考核
                action.ResetTable(TableNames.AnnualAppraisal);
                dt = action.Select(where + " order by Date");
                doc.SetText(dt, null, 6);

                //家庭成员
                action.ResetTable(ViewNames.VFamilyMember);
                dt = action.Select(where);
                doc.SetText(dt, null, 7);
            }

            var picName = AppDomain.CurrentDomain.BaseDirectory + @"\Picture\" + personalIdCard + ".jpg";
            if (File.Exists(picName))
            {
                doc.SetPicture(0, 0, 6, AppDomain.CurrentDomain.BaseDirectory + @"\Picture\" + personalIdCard + ".jpg");
            }
            doc.Save();
            return "/download/Approval/" + filename;
        }
    }
}