using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using CYQ.Data;
using CYQ.Data.Table;
using Btc.NewCommon;

namespace Btc.Data
{
    /// <summary>
    /// MAction扩展方法
    /// </summary>
    public static class SAction
    {
        #region Select

        /// <summary>
        /// 查询数据
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="where">条件</param>
        /// <param name="selectColumns">要查询的字段。如果前两个为整数，则调用分页查询</param>
        /// <returns></returns>
        public static MDataTable Select(object tableName,
            string where, params object[] selectColumns)
        {
            using (MAction action = new MAction(tableName))
            {
                return action.Select(where, selectColumns);
            }
        }

        /// <summary>
        /// 查询表的指定列，字段可以为全名（如 table.field）
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="where"></param>
        /// <param name="isFullName"></param>
        /// <param name="selectColumns"></param>
        /// <returns></returns>
        public static MDataTable Select(object tableName, string where,
            bool isFullName, params object[] selectColumns)
        {
            var fullNames = GetFullName(selectColumns, isFullName);
            return Select(tableName, where, isFullName != true ? selectColumns : fullNames);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <param name="isFullName"></param>
        /// <param name="enumObj"></param>
        /// <returns></returns>
        public static MDataTable Select(object tableName, string where,
            bool isFullName, object enumObj)
        {
            var selectFields = GetFullName(enumObj, isFullName);
            return Select(tableName, where, selectFields);
        }

        private static string[] GetFullName(object enumObj, bool isFullName)
        {
            var enumType = Type.GetType("Btc.NewCommon." + enumObj + ",SEnumProc");
            if (enumType == null)
            {
                return null;
            }
            var names = new List<string>();
            if (isFullName)
            {
                foreach (var name in enumType.GetEnumNames())
                {
                    names.Add($"{enumObj}.{name} as '{enumObj}.{name}'");
                }
            }
            else
            {
                foreach (var name in enumType.GetEnumNames())
                {
                    names.Add(name);
                }
            }
            return names.ToArray();
        }

        public static MDataTable Select(this MAction action,
            string where, bool isFullName, params object[] selectColumns)
        {
            //var fullNames = GetFullName(selectColumns, isFullName);
            return action.Select(where, isFullName ? GetFullName(selectColumns, true) : selectColumns);
        }

        public static MDataTable Select(this MAction action,
            string where, bool isFullName, object enumObj)
        {
            var fullNames = GetFullName(enumObj, isFullName);
            return action.Select(where, fullNames);
        }

        private static object[] GetFullName(object[] selectColumns, bool isFullname)
        {
            if (!isFullname)
            {
                return selectColumns;
            }
            var fullNames = new object[selectColumns.Length];

            var index = 0;
            foreach (var column in selectColumns)
            {
                fullNames[index++] = column.ToAsFullName();
            }
            return fullNames;
        }

        /// <summary>
        /// 查询数据
        /// </summary>
        /// <param name="action">MAction名</param>
        /// <param name="where">条件</param>
        /// <param name="selectColumns">要查询的字段。如果前两个为整数，则调用分页查询</param>
        /// <returns></returns>
        public static MDataTable Select(this MAction action,
            string where, params object[] selectColumns)
        {
            int page = 0;
            int pagesize = 0;
            if (selectColumns == null || selectColumns.Length == 0)
            {
                action.SetSelectColumns("*");
                return action.Select(where);
            }
            var selectColCount = selectColumns.Length;
            if (selectColumns.Length > 0)
            {
                if (selectColumns[0].GetType().Name.ToLower().Left(3) == "int")
                {
                    page = (int)selectColumns[0];
                    pagesize = (int)selectColumns[1];
                    if (selectColCount > 2)
                    {
                        object[] realFields = new object[selectColumns.Length - 2];
                        Array.Copy(selectColumns, 2, realFields, 0, realFields.Length);
                        action.SetSelectColumns(realFields);
                    }
                }
                else
                {
                    if (selectColCount > 0)
                    {
                        action.SetSelectColumns(selectColumns);
                    }
                }
            }
            if (page == 0)
            {
                return action.Select(where);
            }
            return action.Select(page, pagesize, where);
        }

        /// <summary>
        /// 获取满足条件的第一条记录的某个字段值
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <param name="fieldname"></param>
        /// <returns></returns>
        public static T GetOneValue<T>(object tableName,
            string where, object fieldname)
        {
            using (MAction action = new MAction(tableName))
            {
                return action.GetOneValue<T>(where, fieldname);
            }
        }

        /// <summary>
        /// 获取满足条件的第一条记录的某个字段值
        /// </summary>
        /// <param name="action"></param>
        /// <param name="where"></param>
        /// <param name="fieldname">设置的字段名。字段为聚合函数时，要加上 as key</param>
        /// <param name="key">当设置的字段为聚合函数时as 后的名称</param>
        /// <returns></returns>
        public static T GetOneValue<T>(this MAction action,
            string where, object fieldname, string key = null)
        {
            var strField = fieldname.ToString();
            var indexOfAs = strField.IndexOf(" as ", StringComparison.Ordinal);
            if (indexOfAs > 0
                && strField.IndexOf("(", StringComparison.Ordinal) > 0
                && strField.IndexOf(")", StringComparison.Ordinal) > 0)
            {
                key = strField.Substring(indexOfAs + 4);
            }

            action.SetSelectColumns(fieldname);
            return action.Fill(where) ? action.Get<T>(key ?? fieldname) : default(T);
        }

        /// <summary>
        /// 把某一列的值转成用","隔开的字符串
        /// </summary>
        /// <param name="action"></param>
        /// <param name="where"></param>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public static string GetColValueList(this MAction action,
            string where, string fieldName)
        {
            var sql = "SELECT STUFF(" +
                      "(SELECT concat(',',{2}) " +
                      "FROM {0} " +
                      "WHERE {1} " +
                      "FOR xml path ('')), 1, 1, '') as result";
            var tableName = action.TableName;
            sql = sql.Format((object)tableName, where, fieldName);
            action.ResetTable(sql);
            var dt = action.Select();
            string result = null;
            if (dt.Rows.Count > 0)
            {
                result = (string)dt.Rows[0][0].Value;
            }
            action.ResetTable(tableName);
            return result;
        }

        /// <summary>
        /// 查询数据，去除重复行
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <param name="selectColumns"></param>
        /// <returns></returns>
        public static MDataTable Distinct(object tableName,
            string where, params object[] selectColumns)
        {
            using (MAction action = new MAction(tableName))
            {
                var dt = action.Select(where, selectColumns);
                dt.Distinct();
                return dt;
            }
        }

        /// <summary>
        /// 查询数据，去除重复行
        /// </summary>
        /// <param name="action"></param>
        /// <param name="where"></param>
        /// <param name="selectColumns"></param>
        /// <returns></returns>
        public static MDataTable Distinct(this MAction action,
            string where, params object[] selectColumns)
        {
            var dt = action.Select(where, selectColumns);
            dt.Distinct();
            return dt;
        }

        /// <summary>
        /// 根据前台提交的查询条件(包括分页条件)查询数据
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="fieldValueCollection">前台提交的查询条件</param>
        /// <param name="selectColumns"></param>
        /// <returns></returns>
        public static MDataTable Select(object tableName,
            NameValueCollection fieldValueCollection,
            params object[] selectColumns)
        {
            using (MAction action = new MAction(tableName))
            {
                return action.Select(fieldValueCollection, selectColumns);
            }
        }

        /// <summary>
        /// 根据前台提交的查询条件(包括分页条件)查询数据
        /// </summary>
        /// <param name="action"></param>
        /// <param name="fieldValueCollection">前台提交的查询条件</param>
        /// <param name="selectColumns"></param>
        /// <returns></returns>
        public static MDataTable Select(this MAction action,
            NameValueCollection fieldValueCollection,
            params object[] selectColumns)
        {
            string where = fieldValueCollection.ToWhere(out var pageIndex, out var pageSize, out var order);
            var fieldCount = selectColumns?.Length ?? 0;
            var realFields = new object[fieldCount + 2];
            realFields[0] = pageIndex;
            realFields[1] = pageSize;
            if (fieldCount > 0 && selectColumns != null)
            {
                Array.Copy(selectColumns, 0, realFields, 2, fieldCount);
            }
            return action.Select(where, realFields);
        }

        #endregion Select

        #region Update

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <param name="fieldValues"></param>
        /// <returns></returns>
        public static bool Update(object tableName,
            string where, params object[] fieldValues)
        {
            bool result;
            using (MAction action = new MAction(tableName))
            {
                result = action.Update(where, fieldValues);
            }
            return result;
        }

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="action"></param>
        /// <param name="where"></param>
        /// <param name="fieldValues"></param>
        /// <returns></returns>
        public static bool Update(this MAction action,
            string where, params object[] fieldValues)
        {
            if (fieldValues.Length == 0)
            {
                return false;
            }
            action.SetFieldValues(fieldValues);
            return action.Update(where);
        }

        /// <summary>
        /// 根据前端提交的数据（包含id），更新数据
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="form">前端提交的数据，包含字段id</param>
        /// <returns></returns>
        public static bool Update(object tableName, NameValueCollection form)
        {
            using (MAction action = new MAction(tableName))
            {
                action.Update(form);
            }
            return true;
        }

        /// <summary>
        /// 根据前端提交的数据（包含id），更新数据
        /// </summary>
        /// <param name="action"></param>
        /// <param name="form">前端提交的数据，包含字段id</param>
        /// <returns></returns>
        public static bool Update(this MAction action, NameValueCollection form)
        {
            var collections = form.Split();
            foreach (var collection in collections)
            {
                action.SetFieldValues(collection);
                action.Update("id".ToWhere(form["id"]));
            }

            return true;
        }

        /// <summary>
        /// 根据键值对集合更新数据
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <param name="fieldValueCollection"></param>
        /// <param name="prefix"></param>
        /// <returns></returns>
        public static bool Update(object tableName,
            string where, NameValueCollection fieldValueCollection,
            string prefix = "")
        {
            bool result;
            using (MAction action = new MAction(tableName))
            {
                result = action.Update(where, fieldValueCollection, prefix);
            }
            return result;
        }

        /// <summary>
        /// 根据键值对集合 和 字段及相应值 更新数据
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <param name="fieldValueCollection"></param>
        /// <param name="otherFieldValues"></param>
        /// <returns></returns>
        public static bool Update(object tableName, string where,
            NameValueCollection fieldValueCollection,
            params object[] otherFieldValues)
        {
            bool result;
            using (MAction action = new MAction(tableName))
            {
                result = action.Update(where, fieldValueCollection, otherFieldValues);
            }
            return result;
        }

        /// <summary>
        /// 根据键值对集合 和 字段及相应值 更新数据
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <param name="fieldValueCollection"></param>
        /// <param name="prefix"></param>
        /// <param name="otherFieldValues"></param>
        /// <returns></returns>
        public static bool Update(object tableName, string where,
            NameValueCollection fieldValueCollection, string prefix,
            params string[] otherFieldValues)
        {
            bool result;
            using (MAction action = new MAction(tableName))
            {
                result = action.Update(where, fieldValueCollection, prefix, otherFieldValues);
            }
            return result;
        }

        /// <summary>
        /// 根据键值对集合更新数据
        /// </summary>
        /// <param name="action"></param>
        /// <param name="where"></param>
        /// <param name="fieldValueCollection"></param>
        /// <param name="prefix"></param>
        /// <returns></returns>
        public static bool Update(this MAction action,
            string where, NameValueCollection fieldValueCollection,
            string prefix = "")
        {
            action.SetFieldValues(fieldValueCollection, prefix);
            return action.Update(where);
        }

        /// <summary>
        /// 根据键值对集合更新数据
        /// </summary>
        /// <param name="action"></param>
        /// <param name="where"></param>
        /// <param name="fieldValueCollection"></param>
        /// <param name="fieldValues"></param>
        /// <returns></returns>
        public static bool Update(this MAction action,
            string where, NameValueCollection fieldValueCollection,
            params object[] fieldValues)
        {
            action.SetFieldValues(fieldValueCollection, fieldValues);
            return action.Update(where);
        }

        public static bool Update(this MAction action, string where,
            NameValueCollection fieldValueCollection, string prefix, params object[] fieldValues)
        {
            action.SetFieldValues(fieldValueCollection, prefix, fieldValues);
            return action.Update(where);
        }

        #endregion Update

        #region Insert

        /// <summary>
        /// 插入数据
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="fieldValues"></param>
        /// <returns></returns>
        public static string Insert(object tableName, params object[] fieldValues)
        {
            string result;
            using (MAction action = new MAction(tableName))
            {
                result = action.Insert(null, fieldValues);
            }
            return result;
        }

        /// <summary>
        /// 根据键值对插入数据
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="fieldValueCollection"></param>
        /// <param name="otherFieldValues"></param>
        /// <returns></returns>
        public static string Insert(object tableName,
            NameValueCollection fieldValueCollection, params object[] otherFieldValues)
        {
            string result;
            using (MAction action = new MAction(tableName))
            {
                result = action.Insert(fieldValueCollection, otherFieldValues);
            }
            return result;
        }

        /// <summary>
        /// 根据键值对插入数据
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="fieldValueCollection"></param>
        /// <param name="prefix"></param>
        /// <param name="otherFieldValues"></param>
        /// <returns></returns>
        public static string Insert(object tableName,
            NameValueCollection fieldValueCollection, string prefix,
            params object[] otherFieldValues)
        {
            string result;
            using (MAction action = new MAction(tableName))
            {
                result = action.Insert(fieldValueCollection, prefix, otherFieldValues);
            }
            return result;
        }

        /// <summary>
        /// 插入数据
        /// </summary>
        /// <param name="action"></param>
        /// <param name="fieldValues"></param>
        /// <returns></returns>
        public static string Insert(this MAction action,
            params object[] fieldValues)
        {
            action.SetFieldValues(fieldValues);
            return action.Insert() ? action.Get<string>("id") : "false";
        }

        /// <summary>
        /// 插入数据
        /// </summary>
        /// <param name="action"></param>
        /// <param name="collection"></param>
        /// <param name="prefix"></param>
        /// <param name="otherFieldValues"></param>
        /// <returns></returns>
        public static string Insert(this MAction action,
            NameValueCollection collection, string prefix, params object[] otherFieldValues)
        {
            action.SetFieldValues(collection, prefix, otherFieldValues);
            return action.Insert() ? action.Get<string>("id") : "false";
        }

        public static string Insert(this MAction action,
           NameValueCollection collection, params object[] otherFieldValues)
        {
            action.SetFieldValues(collection, otherFieldValues);
            return action.Insert() ? action.Get<string>("id") : "false";
        }

        public static string Insert(this MAction action,
            NameValueCollection collection, string prefix = "")
        {
            action.SetFieldValues(collection, prefix);
            return action.Insert() ? action.Get<string>("id") : "false";
        }

        #endregion Insert

        #region Delete

        /// <summary>
        /// 删除满足条件的记录
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="where"></param>
        /// <returns></returns>
        public static bool Delete(object tableName, string where)
        {
            bool result;
            using (MAction action = new MAction(tableName))
            {
                result = action.Delete(where);
            }
            return result;
        }

        #endregion Delete

        #region 切换表 设置字段值

        /// <summary>
        /// 切换表或视图
        /// </summary>
        /// <param name="action">MAction名</param>
        /// <param name="tableName">要切换的表，如果为空，则不切换</param>
        public static void ResetTableAlowNull(this MAction action, object tableName)
        {
            if (!tableName.IsNullOrEmpty())
            {
                action.ResetTable(tableName);
            }
        }

        /// <summary>
        /// 设置相应字段的值
        /// </summary>
        /// <param name="action"></param>
        /// <param name="fieldValues"></param>
        public static void SetFieldValues(
            this MAction action, params object[] fieldValues)
        {
            for (int i = 0; i < fieldValues.Length; i += 2)
            {
                var value = fieldValues[i + 1];
                if (fieldValues[i + 1] == null || fieldValues[i + 1].ToString() == "null")
                {
                    value = DBNull.Value;
                }
                action.Set(fieldValues[i], value, 2);
            }
        }

        public static void SetFieldValues(this MAction action,
            MDataRow row, params object[] fields)
        {
            foreach (var field in fields)
            {
                var strField = field.ToString();
                action.Set(strField, row[strField].Value, 2);
            }
        }

        /// <summary>
        /// 根据键值对集合设置相应字段的值
        /// </summary>
        /// <param name="action"></param>
        /// <param name="fieldValueCollection"></param>
        /// <param name="prefix"></param>
        public static void SetFieldValues(this MAction action,
            NameValueCollection fieldValueCollection, string prefix = "")
        {
            if (prefix.IsNullOrEmpty())
            {
                foreach (var key in fieldValueCollection.AllKeys)
                {
                    if (key.ToLower() == "id")
                    {
                        continue;
                    }
                    var value = fieldValueCollection[key];
                    if (value.IsNullOrEmpty())
                    {
                        continue;
                    }
                    action.Set(key, value, 2);
                }
                return;
            }
            var len = prefix.Length;
            foreach (var key in fieldValueCollection.AllKeys)
            {
                if (key.Left(len) == prefix)
                {
                    var newKey = key.Substring(len + 1);
                    if (newKey.ToLower() == "id")
                    {
                        continue;
                    }
                    var value = fieldValueCollection[key];
                    if (value.IsNullOrEmpty())
                    {
                        continue;
                    }
                    action.Set(newKey, value, 2);
                }
            }
        }

        public static void SetFieldValues(this MAction action,
            NameValueCollection fieldValueCollection, params object[] fieldValues)
        {
            action.SetFieldValues(fieldValueCollection);
            action.SetFieldValues(fieldValues);
        }

        public static void SetFieldValues(this MAction action,
            NameValueCollection fieldValueCollection, string prefix,
            params object[] fieldValues)
        {
            action.SetFieldValues(fieldValueCollection, prefix);
            action.SetFieldValues(fieldValues);
        }

        /// <summary>
        /// 切换表，并根据Model设置相应字段的值
        /// </summary>
        /// <param name="action"></param>
        /// <param name="tableName"></param>
        /// <param name="model"></param>
        public static void SetTableAndFieldValues<T>(this MAction action,
       object tableName, T model)
        {
            action.ResetTableAlowNull(tableName);
            var t = model.GetType();
            var propertyList = t.GetProperties();
            foreach (var item in propertyList)
            {
                var name = item.Name;
                var value = item.GetValue(model, null);
                action.Set(name, value, 2);
            }
        }

        #endregion 切换表 设置字段值
    }
}