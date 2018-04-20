using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Btc.Data;
using Btc.NewCommon;
using MyMVC;

namespace DyLeader
{
    public class AjaxDept
    {
        [Action]
        public static string Edit(NameValueCollection form)
        {
            var result = SAction.Update(TableNames.SysDepartment, SysDepartment.id.ToWhere(form["id"]), form);
            return result ? SJson.Success : SJson.Error;
        }

        [Action]
        public static string New(NameValueCollection form)
        {
            var result = SAction.Insert(TableNames.SysDepartment, form, SysDepartment.id, form["id"]);
            return result == "false" ? SJson.Error : SJson.Success;
        }
    }
}