using System.Collections.Generic;
using System.Collections.Specialized;

namespace Btc.NewCommon
{
    public static class SForm
    {
        /// <summary>
        /// 把前台Form提交的数据根据前缀转为键值对集合, 不包括tableName与id字段
        /// </summary>
        /// <param name="form">前台Form提交的数据</param>
        /// <param name="prefix">前台提交的key的前缀</param>
        public static NameValueCollection ToFieldValueCollection
            (this NameValueCollection form, string prefix = null)
        {
            var fieldValCollection = new NameValueCollection();
            if (prefix.IsNullOrEmpty())
            {
                foreach (var key in form.AllKeys)
                {
                    fieldValCollection.Add(key, form[key]);
                }
                return fieldValCollection;
            }
            var keyCount = form.AllKeys.Length;
            var len = prefix.Length;
            for (int i = 0; i < keyCount; i++)
            {
                var keyName = form.AllKeys[i];
                var value = form[i].DecodeURI().DecodeUTF8();
                if (keyName.Left(prefix.Length) == prefix)
                {
                    keyName = keyName.Substring(len + 1);
                    if (keyName == "id")
                    {
                        continue;
                    }
                    fieldValCollection.Add(keyName, value);
                }
            }
            return fieldValCollection;
        }

        /// <summary>
        /// 移除空值的键值对
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        public static NameValueCollection RemoveNull(this NameValueCollection form)
        {
            var result = new NameValueCollection();
            foreach (var key in form.AllKeys)
            {
                var value = form[key];
                if (value.IsNullOrEmpty())
                {
                    continue;
                }
                result.Add(key, value);
            }
            return result;
        }

        /// <summary>
        /// 移除指定键值对
        /// </summary>
        /// <param name="form"></param>
        /// <param name="removeKeys"></param>
        /// <returns></returns>
        public static NameValueCollection RemoveKey(this NameValueCollection form, params string[] removeKeys)
        {
            var result = new NameValueCollection();
            foreach (string key in form.AllKeys)
            {
                if (removeKeys.IndexOf(key) < 0)
                {
                    result.Add(key, form[key]);
                }
            }
            return result;
        }

        /// <summary>
        /// 分割为多个
        /// </summary>
        /// <param name="collection"></param>
        /// <param name="seperator"></param>
        /// <returns></returns>
        public static NameValueCollection[] Split(this NameValueCollection collection, char seperator = ',')
        {
            var fieldCount = collection[0].Split(',').Length;
            var collections = new NameValueCollection[fieldCount];
            for (int i = 0; i < fieldCount; i++)
            {
                collections[i] = new NameValueCollection();
            }
            foreach (var key in collection.AllKeys)
            {
                var values = collection[key].Split(',');
                for (int i = 0; i < fieldCount; i++)
                {
                    collections[i].Add(key, values[i]);
                }
            }
            return collections;
        }

        /// <summary>
        /// 把前台Form提交的数据转为值数组
        /// </summary>
        /// <param name="form">前台Form提交的数据</param>
        /// <param name="fixPre">前台提交的key的前缀</param>
        /// <returns>字段名与值数组</returns>
        public static string[] ToValues(this NameValueCollection form,
            string fixPre = "")
        {
            int keyCount = form.AllKeys.Length;
            var vals = new List<string>();
            for (int i = 0; i < keyCount; i++)
            {
                var keyName = form.AllKeys[i];
                if (keyName == "id")
                {
                    continue;
                }
                var value = form[i].DecodeURI().DecodeUTF8();
                if (fixPre.IsNotNullEmpty())
                {
                    if (keyName.Left(fixPre.Length) == fixPre)
                    {
                        vals.Add(value);
                    }
                }
                else
                {
                    vals.Add(value);
                }
            }
            return vals.ToArray();
            //return fieldValues;
        }

        /// <summary>
        /// 把前台Form提交的数据转为字段名数组
        /// </summary>
        /// <param name="form">前台Form提交的数据</param>
        /// <param name="startIndex">起始索引号</param>
        /// <returns>字段名与值数组</returns>
        public static string[] ToFields(this NameValueCollection form, int startIndex = 0)
        {
            int keyCount = form.AllKeys.Length;
            string[] fields = new string[keyCount - startIndex];
            int index = 0;
            for (int i = startIndex; i < keyCount; i++)
            {
                fields[index] = form.AllKeys[i];
                index++;
            }
            return fields;
        }

        /// <summary>
        /// 把前台Form提交的数据转为查询条件(like)，排除tableName,page,pagesize,changepage
        /// </summary>
        /// <param name="form"></param>
        /// <returns></returns>
        public static string ToWhere(this NameValueCollection form)
        {
            string where = "1=1";
            foreach (string key in form.AllKeys)
            {
                var keyTmp = key.ToLower();
                if (key != "tablename" && key != "page" &&
                key != "pagesize" && key != "changepage" && key != "pageindex")
                {
                    where += " and " + key.ToLikeWhere(form[key]);
                }
            }
            return where;
        }

        /// <summary>
        /// 把前台Form提交的数据转为查询条件(like)，排除tableName,page,pagesize,changepage
        /// </summary>
        /// <param name="form"></param>
        /// <param name="prefix"></param>
        /// <param name="keys"></param>
        /// <returns></returns>
        public static string ToWhere(this NameValueCollection form, string prefix, params string[] keys)
        {
            string where = "1=1";
            var tmpKeys = keys?.Length < 1 ? form.AllKeys : keys;
            if (tmpKeys != null)
            {
                var whereList = new List<string>();
                foreach (string key in tmpKeys)
                {
                    var keyTmp = key.ToLower();
                    if (key != "tablename" && key != "page" &&
                        key != "pagesize" && key != "changepage" && key != "pageindex")
                    {
                        whereList.Add(key.ToWhere(form[key], false));
                    }
                }
                where = whereList.ToArray().Join(" and ");
            }
            return where;
        }

        /// <summary>
        /// 把前端Form提交的数据转为查询条件(like)，排除tableName,page,pagesize,changepage
        /// 如果key为sort.name 和 sort.order，则为排序依据
        /// </summary>
        /// <param name="form"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="sort">排序条件</param>
        /// <returns></returns>
        public static string ToWhere(this NameValueCollection form,
            out int pageIndex, out int pageSize, out string sort)
        {
            var lstWhere = form.GetPageAndWhere(out pageIndex, out pageSize);
            sort = form.GetOrderBy();
            return (lstWhere == null ? "1=1" : lstWhere.Join(" and ")) + sort;
        }

        public static string ToWhere(this NameValueCollection form,
            out int pageIndex, out int pageSize)
        {
            string orderBy;
            return form.ToWhere(out pageIndex, out pageSize, out orderBy);
        }

        private static string GetOrderBy(this NameValueCollection form)
        {
            string orderBy;
            var sortNames = form["sort.name"]?.Split(',');
            if (sortNames != null)
            {
                var sorts = new string[sortNames.Length];
                var orders = form["sort.order"].Split(',');
                for (int i = 0; i < sortNames.Length; i++)
                {
                    sorts[i] = sortNames[i] + " " + orders[i];
                }
                orderBy = " order by " + sorts.Join(",");
            }
            else
            {
                orderBy = "";
            }
            return orderBy;
        }

        private static string[] GetPageAndWhere(this NameValueCollection form,
            out int pageIndex, out int pageSize)
        {
            pageSize = 0;
            pageIndex = 0;
            var lstWhere = new List<string>();
            foreach (string key in form.AllKeys)
            {
                var keyTmp = key.ToLower();
                var value = form[key];
                switch (keyTmp)
                {
                    case "page":
                    case "pageindex":
                        pageIndex = value.ToInt();
                        continue;
                    case "pagesize":
                        pageSize = value.ToInt();
                        continue;
                    case "tablename":
                    case "changepage":
                    case "sort.name":
                    case "sort.order":
                    case "time_rand":
                    case "timestamp":
                    case "table":
                        continue;
                    case "id":
                    case "personalidcard":
                    case "idcard":
                    case "deptid":
                        lstWhere.Add(key.ToWhere(value));
                        continue;
                }

                lstWhere.Add(key.ToLikeWhere(value));
                continue;
            }
            return lstWhere.Count == 0 ? null : lstWhere.ToArray();
        }

        public static string[] GetPinyin(this NameValueCollection collection,
            params string[] hanziFields)
        {
            if (hanziFields == null || hanziFields.Length < 1)
            {
                return new string[] { collection["name"].ToPinyin() };
            }

            var fieldCount = hanziFields.Length;
            var pinyins = new string[fieldCount];
            for (int i = 0; i < fieldCount; i++)
            {
                pinyins[i] = collection[hanziFields[i]].ToPinyin();
            }
            return pinyins;
        }
    }
}