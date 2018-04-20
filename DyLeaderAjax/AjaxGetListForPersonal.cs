using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using Btc.Data;
using MyMVC;
using Btc.NewCommon;

namespace DyLeaderAjax
{
    public class AjaxList
    {
        [Action]
        public static string GetArea(string key, string name)
        {
            return GetForAll("SysArea", key, name);
        }

        [Action]
        public static string GetEthnicity(string key, string Ethnicity)
        {
            return GetForAll("SysEthnicity", key, Ethnicity, "Ethnicity");
        }

        [Action]
        public static string GetDept(string key, string id, bool isDept, string pid)
        {
            var where = "isUsing=1" +
                " and " + "name".ToLikeWhere(key) +
                " and " + "id".ToWhere(id) +
                " and " + "pId".ToWhere(pid);
            where += " and " + (isDept ? "id>1000 and id<999999" : "id>1000000");
            return SAction.Select("SysDepartment", where, "id", "name").ToJson().Replace(" 00:00:00", "");
        }

        [Action]
        public static string Query(NameValueCollection queryString)
        {
            return SProc.SelectForPage("SysQuery", queryString).ToJson().Replace(" 00:00:00", "");
        }

        [Action]
        public static string GetPersonal(string key, string personalIdCard)
        {
            string where = "PersonalIdCard".ToInWhere(personalIdCard);
            if (key.IsNotNullEmpty())
            {
                where += " and IsUsing=1 and " +
                         "fullname".ToLikeWhere(key);
            }
            return SAction.Select("Personal", where,
                "PersonalIdCard", "Fullname").ToJson();
        }

        private static string GetForAll(string tablename,
            string key, string name, string nameField = "Name")
        {
            var nameValue = key.IsNullOrEmpty() ? name : key;
            return SAction.Select(tablename, nameField.ToLikeWhere(nameValue), "Name").ToJson();
        }
    }
}