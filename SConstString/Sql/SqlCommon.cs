using System.ComponentModel;

namespace Btc.NewCommon
{
    public class Common
    {
        /// <summary>
        /// 把某一列满足条件的数据用 "," 拼接的SQL语句
        /// </summary>
        /// <param name="tablename"></param>
        /// <param name="where"></param>
        /// <param name="fieldname"></param>
        /// <returns></returns>
        public static string GetToListWithComma(object tablename, object where, object fieldname)
        {
            return $"(SELECT concat(',', {fieldname} " +
                   $"FROM {tablename} " +
                   $"WHERE {where} " +
                   "FOR xml path ('')), 1, 1, '')";
        }
    }
}