using System;

namespace Btc.NewCommon
{
    public static class FieldExt
    {
        #region 字段枚举扩展方法

        /// <summary>
        /// 把字段转成Case when
        /// </summary>
        /// <param name="field"></param>
        /// <param name="valueAndTexts"></param>
        /// <returns></returns>
        public static object ToCase(this object field, params object[] valueAndTexts)
        {
            var result = "case " + field;
            for (int i = 0; i < valueAndTexts.Length; i += 2)
            {
                result += $" when '{valueAndTexts[i].ToString()}'" +
                          $" then '{valueAndTexts[i + 1].ToString()}'";
            }
            return result + " end as " + field;
        }

        /// <summary>
        /// 生成字段全名（table.field或tableField形式)
        /// </summary>
        /// <param name="field">字段枚举名</param>
        /// <param name="isDotName">是否为table.field形式，默认值为true，为false时返回值为tableField形式</param>
        /// <returns>字段全名</returns>
        public static object ToAsFullName(this object field, bool isDotName = true)
        {
            var tableName = field.GetType().Name;
            if (tableName.ToLower() == "int")
            {
                return field;
            }
            if (tableName.ToLower() == "string")
            {
                return $"{field} as '{field}'";
            }
            var fieldName = field.ToString();
            string fullName = isDotName
                ? $"{tableName}.{fieldName} as '{tableName}.{fieldName}'"
                : tableName + fieldName;
            return fullName;
            //return field.ToString();
        }

        public static object ToFullName(this object field)
        {
            var tableName = field.GetType().Name;
            if (tableName.ToLower() == "int")
            {
                return field;
            }
            if (tableName.ToLower() == "string")
            {
                return field;
            }
            var fieldName = field.ToString();
            return $"{tableName}.{fieldName}";
        }

        public static string ToRowsJson(this string s)
        {
            return s.Substring(s.IndexOf('[')).TrimEnd('}');
        }

        /// <summary>
        /// 把字段转为聚合函数字符串
        /// </summary>
        /// <param name="field">字段名</param>
        /// <param name="aggregation">聚合函数名</param>
        /// <returns></returns>
        public static string ToAggregation(this Enum field, Enum aggregation)
        {
            return aggregation + "(" + field + ") as " + field;
        }

        /// <summary>
        /// 把字段和值列表转为查询条件的in
        /// </summary>
        /// <param name="field">字段</param>
        /// <param name="value">值列表，用“,”隔开</param>
        /// <param name="isAlowNull"></param>
        /// <returns></returns>
        public static string ToInWhere(this object field, string value, bool isAlowNull = true)
        {
            return field.ToWhere("in", value, isAlowNull);
        }

        /// <summary>
        /// 把字段和值列表转为查询条件的not in
        /// </summary>
        /// <param name="field">字段</param>
        /// <param name="value">值列表，用“,”隔开</param>
        /// <param name="isAlowNull"></param>
        /// <returns></returns>
        public static string ToNotInWhere(this object field, string value, bool isAlowNull = true)
        {
            return field.ToWhere("not in", value, isAlowNull);
        }

        /// <summary>
        /// 把用","隔开的字符串各自加上单引号
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string ToInList(this string s)
        {
            s = s.Replace("'", "");
            var vals = s.Split(',');
            return $"'{vals.Join("','")}'";
        }

        /// <summary>
        /// 转换为形如 id=1 的条件字符串
        /// </summary>
        /// <param name="field">字段名</param>
        /// <param name="value">值</param>
        /// <param name="isAlowNull">值为空时，是否转为"1=1", 否则转为"1=0"</param>
        /// <returns></returns>
        public static string ToWhere(this object field, object value, bool isAlowNull = true)
        {
            return field.ToWhere("=", value, isAlowNull);
        }

        /// <summary>
        /// 把字段与相应值转为查询条件，默认相应值可以为空。如果不允许为空，则返回"1=0"
        /// </summary>
        /// <param name="fieldValues">条件字段与相应值，成对出现</param>
        /// <param name="isAlowNull">是否不可以存在空值，默认可以有空</param>
        /// <returns></returns>
        public static string ToWhere(this object[] fieldValues, bool isAlowNull = true)
        {
            //不允许有空值时，如果有空值，返回永不成立的条件
            string[] wheres = new string[fieldValues.Length / 2];
            for (var i = 0; i < fieldValues.Length; i += 2)
            {
                wheres[i / 2] = fieldValues[i].ToWhere(fieldValues[i + 1], isAlowNull);
            }
            return wheres.Join(" and ");
        }

        /// <summary>
        /// 把字段与相应值转为查询条件，默认相应值可以为空。如果不允许为空，则返回"1=0"
        /// </summary>
        /// <param name="fieldValues">条件字段与相应值，成对出现</param>
        /// <param name="isAlowNull">是否不可以存在空值，默认可以有空</param>
        /// <returns></returns>
        public static string ToWhere(this string[] fieldValues, bool isAlowNull = true)
        {
            //不允许有空值时，如果有空值，返回永不成立的条件
            string[] wheres = new string[fieldValues.Length / 2];
            for (var i = 0; i < fieldValues.Length; i += 2)
            {
                wheres[i / 2] = fieldValues[i].ToWhere(fieldValues[i + 1], isAlowNull);
            }
            return wheres.Join(" and ");
        }

        /// <summary>
        /// 转换为条件字符串
        /// </summary>
        /// <param name="field">字段名</param>
        /// <param name="compare">比较字符串</param>
        /// <param name="value">值</param>
        /// <param name="isAlowNull">值为空时，是否转为"1=0", 默认转为"1=1"</param>
        /// <returns></returns>
        public static string ToWhere(this object field, object compare,
            object value, bool isAlowNull = true)
        {
            if (value == null || value.ToString().IsNullOrEmpty())
            {
                return isAlowNull ? "1=1" : "1=0";
            }
            value = value.ToString().Replace("'", "''");
            string compareTmp = compare.ToLower();
            switch (compareTmp)
            {
                case "=":
                case ">":
                case ">=":
                case "!=":
                case "<":
                case "<=":
                    return $"{field}{compareTmp}'{value}'";

                case "like":
                    return $"{field} {compareTmp} '%{value}%'";

                case "in":
                case "not in":
                    return $"{field} in ({value.ToString().ToInList()})";

                case "between":
                    var startEndValues = value.ToString().Split(',');
                    return $"{field} {compareTmp} '{startEndValues[0]}' and '{startEndValues[1]}'";

                default:
                    return "1=0";
            }
        }

        /// <summary>
        /// 转换为like条件字符串
        /// </summary>
        /// <param name="field">字段名</param>
        /// <param name="value">值</param>
        /// <returns></returns>
        public static string ToLikeWhere(this object field, object value)
        {
            return field.ToWhere("like", value);
        }

        /// <summary>
        /// 转换为like条件字符串
        /// </summary>
        /// <param name="field">字段名</param>
        /// <param name="values">值数组</param>
        /// <returns></returns>
        public static string ToLikeWhere(this object field, string[] values)
        {
            var wheres = new string[values.Length];
            for (int i = 0; i < values.Length; i++)
            {
                wheres[i] = field.ToLikeWhere(values[i]);
            }
            return wheres.Join(" and ");
        }

        /// <summary>
        /// 把值列表（","隔开）转为用 or 联接的 like 条件,如 (field like '%val1%' or field like '%val2%')
        /// </summary>
        /// <param name="field"></param>
        /// <param name="valueList"></param>
        /// <param name="isHasComma">是否加上逗号，如: field like '%,value,%'</param>
        /// <returns></returns>
        public static string ToLikeWheres(this object field, string valueList, bool isHasComma = true)
        {
            string[] values = valueList.Split(',');
            string[] likeWheres = new string[values.Length];
            var comma = isHasComma ? "," : "";
            for (int i = 0; i < values.Length; i++)
            {
                likeWheres[i] = field.ToLikeWhere(comma + values[i] + comma);
            }
            return "(" + likeWheres.Join(" or ") + ")";
        }

        #endregion 字段枚举扩展方法
    }
}