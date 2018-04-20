using System;
using System.Linq;
using CYQ.Data.Table;
using CYQ.Data.Tool;

namespace Btc.Data
{
    public static class SDataTable
    {
        /// <summary>
        /// 获取数据表中某列的值的个数（不重复）
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public static int GetColDistinctCount(this MDataTable dt, string fieldName)
        {
            var arr = dt.GetColDistinct(fieldName);
            return arr.Length;
        }

        /// <summary>
        /// 获取数据表中某列的值的数组（不重复）
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        private static string[] GetColDistinct(this MDataTable dt, string fieldName)
        {
            var tmpDt = new MDataTable();
            var d = dt.GetColumnItems<string>(fieldName);
            var a = d.Distinct<string>();
            return a.ToArray();
        }

        /// <summary>
        /// 分页 MDataTable 转为json字符串
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="total"></param>
        /// <returns></returns>
        public static string ToJson(this MDataTable dt, int total)
        {
            var json = new JsonHelper(true);
            json.Fill(dt);
            json.Total = total;
            return json.ToString();
        }

        /// <summary>
        /// MDataTable 转为json字符串, 只包含数据信息
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="isArray">是否为数组形式（用[]包裹，如[{a:1},{a:2}]）</param>
        /// <returns></returns>
        public static string ToRowJson(this MDataTable dt, bool isArray = true)
        {
            if (isArray)
            {
                return dt.ToJson(false, false);
            }
            return dt.ToTopOneJson();
        }

        /// <summary>
        /// 把第一行转为Json
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public static string ToTopOneJson(this MDataTable dt)
        {
            if (dt == null || dt.Rows.Count < 1)
            {
                return "{}";
            }
            return dt.Rows[0].ToJson();
        }

        /// <summary>
        /// 去除列的重复信息
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dt"></param>
        /// <param name="mainIndexes">主索引（如果主索引不同，则不去重）</param>
        /// <param name="indexes">要去重的索引（可以是整数、列名）</param>
        /// <returns></returns>
        public static void ClearRepeateInfo<T>(this MDataTable dt, T[] mainIndexes, params T[] indexes)
        {
            if (indexes.Length < 1)
            {
                indexes = mainIndexes;
                mainIndexes = null;
            }

            //先初始化前一行要去重的值为null
            var preValues = new object[indexes.Length];
            var mainIsRepeat = mainIndexes == null;
            var preMainValues = mainIndexes == null ? null : new object[mainIndexes.Length];

            //去除重复信息
            foreach (var row in dt.Rows)
            {
                //判断主索引对应的值是否相同
                if (mainIndexes != null)
                {
                    mainIsRepeat = true;
                    var preMainIndex = 0;
                    foreach (var mainIndex in mainIndexes)
                    {
                        if (mainIsRepeat && !Equals(preMainValues[preMainIndex], row[mainIndex].Value))
                        {
                            mainIsRepeat = false;
                        }
                        preMainValues[preMainIndex] = row[mainIndex].Value;
                        preMainIndex++;
                    }
                }

                //去重
                var preIndex = 0;
                foreach (var index in indexes)
                {
                    var isRepeat = mainIsRepeat && Equals(preValues[preIndex], row[index].Value);
                    preValues[preIndex] = row[index].Value;
                    if (isRepeat)
                    {
                        row[index].Value = null;
                    }
                    preIndex++;
                }
            }
        }

        /// <summary>
        /// 去除列的重复信息
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dt"></param>
        /// <param name="indexes">要去重的索引（可以是整数、列名）</param>
        /// <returns></returns>
        public static void ClearRepeateInfo<T>(this MDataTable dt, params T[] indexes)
        {
            dt.ClearRepeateInfo(null, indexes);
        }
    }
}