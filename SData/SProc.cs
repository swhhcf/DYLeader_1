using System.Collections.Specialized;
using Btc.NewCommon;
using CYQ.Data.Table;
using CYQ.Data;

namespace Btc.Data
{
    /* 原生
        public class SProc
        {
            /// <summary>
            /// 执行存储过程或Sql语句，无返回值
            /// </summary>
            /// <param name="procName"></param>
            /// <param name="parmNameValues"></param>
            public static void ExeNoQuery(object procName,
                params object[] parmNameValues)
            {
                var tmp = 0;
                Exe(false, procName, null, ref tmp, parmNameValues);
            }

            /// <summary>
            /// 执行查询用存储过程或Sql语句
            /// </summary>
            /// <param name="procName"></param>
            /// <param name="parmNameValues"></param>
            /// <returns></returns>
            public static MDataTable Select(object procName, params object[] parmNameValues)
            {
                var tmp = 0;
                return Exe(true, procName, null, ref tmp, parmNameValues);
            }

            /// <summary>
            /// 执行查询用存储过程或Sql语句，带返回值
            /// </summary>
            /// <param name="procName"></param>
            /// <param name="outputParm"></param>
            /// <param name="outValue"></param>
            /// <param name="parmNameValues"></param>
            /// <returns></returns>
            public static MDataTable Select(object procName, object outputParm,
                ref int outValue, params object[] parmNameValues)
            {
                return Exe(true, procName, outputParm, ref outValue, parmNameValues);
            }

            public static string SelectForPage(object procName, params object[] parmNameValues)
            {
                var total = 0;
                var dt = Select(procName, "total", ref total, parmNameValues);
                return dt.ToJson(total);
            }

            /// <summary>
            /// 执行存储过程或Sql语句
            /// </summary>
            /// <param name="isSelect">是否为Select</param>
            /// <param name="procName">存储过程名</param>
            /// <param name="outputParm">返回参数名</param>
            /// <param name="outValue"></param>
            /// <param name="paramNameVals">存储过程中参数名及相应值(参数与值依次出现)</param>
            /// <returns>MDataTable</returns>
            private static MDataTable Exe(bool isSelect, object procName, object outputParm,
                ref int outValue, params object[] paramNameVals)
            {
                MDataTable result;
                using (var conn = new SqlConnection(CommonString.ConnString))
                {
                    var cmd = conn.CreateCommand();
                    var sql = procName.ToString();
                    cmd.CommandType = sql.IndexOf(" ", StringComparison.Ordinal) >= 0
                        ? CommandType.Text              //执行sql语句
                        : CommandType.StoredProcedure;  //执行存储过程
                    cmd.CommandText = sql;              //存储过程名称 

                    var isOutput = outputParm != null && outputParm.ToString().IsNotNullEmpty();
                    if (paramNameVals != null && paramNameVals.Length > 0)
                    {
                        int paramCount = paramNameVals.Length;
                        for (int i = 0; i < paramCount; i += 2)
                        {
                            var value = paramNameVals[i + 1];
                            if (value == null || value.ToString().IsNullOrEmpty()) continue;
                            var parm = new SqlParameter("@" + paramNameVals[i], SqlDbType.NVarChar)
                            {
                                Value = value.ToString()
                            };
                            cmd.Parameters.Add(parm);
                        }
                    }
                    var outParm = new SqlParameter("@" + outputParm, SqlDbType.Int)
                    {
                        Value = 0,
                        Direction = ParameterDirection.Output
                    };
                    if (isOutput)
                    {
                        cmd.Parameters.Add(outParm);
                    }
                    var dt = new DataTable();
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(dt);
                    result = dt;
                    if (isOutput)
                    {
                        outValue = (int)outParm.Value;
                    }
                }
                return result;
            }
        }
    }

    */

    /// <summary>
    /// 存储过程
    /// </summary>
    public static class SProc
    {
        #region 参数为Object

        public static MDataTable Select(string sql)
        {
            using (MProc proc = new MProc(sql))
            {
                return proc.ExeMDataTable();
            }
        }

        public static MDataTable Select(this MProc proc, string sql)
        {
            proc.ResetProc(sql);
            return proc.ExeMDataTable();
        }

        public static MDataTable Select(this MProc proc, params object[] fieldValues)
        {
            proc.Set(fieldValues);
            return proc.ExeMDataTable();
        }

        public static MDataTable Select<T>(this MProc proc,
            object outputParmName, out T output, params object[] fieldValues)
        {
            proc.SetCustom(outputParmName, ParaType.OutPut);
            proc.Set(fieldValues);
            var dt = proc.ExeMDataTable();
            output = (T)proc.OutPutValue;
            return dt;
        }

        public static MDataTable SelectForPage(this MProc proc, params object[] fieldValues)
        {
            proc.SetCustom("total", ParaType.ReturnValue);
            proc.Set(fieldValues);
            var dt = proc.ExeMDataTable();
            var total = (int)proc.ReturnValue;
            dt.RecordsAffected = total;
            return dt;
        }

        public static MDataTable SelectForPage(this MProc proc, NameValueCollection form)
        {
            proc.SetCustom("total", ParaType.ReturnValue);
            proc.Set(form);
            var dt = proc.ExeMDataTable();
            var total = (int)proc.ReturnValue;
            dt.RecordsAffected = total;
            return dt;
        }

        public static MDataTable SelectForPage(object procName, params object[] fieldValues)
        {
            using (MProc proc = new MProc(procName))
            {
                return proc.SelectForPage(fieldValues);
            }
        }

        public static MDataTable SelectForPage(object procName, NameValueCollection form)
        {
            using (MProc proc = new MProc(procName))
            {
                return proc.SelectForPage(form);
            }
        }

        public static MDataTable Select(object procName, params object[] fieldValues)
        {
            using (MProc proc = new MProc(procName))
            {
                return proc.Select(fieldValues);
            }
        }

        public static void ExeNonQuery(object procName, params object[] fieldValues)
        {
            using (MProc proc = new MProc(procName))
            {
                proc.ExeNonQuery(fieldValues);
            }
        }

        public static string ExeOnlyOutput(object procName, object outputParmName,
            params object[] fieldValues)
        {
            using (MProc proc = new MProc(procName))
            {
                return proc.ExeOnlyOutput(outputParmName, fieldValues);
            }
        }

        public static string ExeOnlyOutput(this MProc proc, object outputParmName,
            params object[] fieldValues)
        {
            proc.SetCustom(outputParmName, ParaType.OutPut);
            proc.Set(fieldValues);
            proc.ExeNonQuery();
            return proc.OutPutValue.ToString();
        }

        public static void ExeNonQuery(this MProc proc, params object[] fieldValues)
        {
            proc.Set(fieldValues);
            proc.ExeNonQuery();
        }

        public static void Set(this MProc proc, params object[] fieldValues)
        {
            if (fieldValues == null || fieldValues.Length == 0)
            {
                return;
            }
            for (int i = 0; i < fieldValues.Length; i += 2)
            {
                if (fieldValues[i + 1].IsNullOrEmpty())
                {
                    continue;
                }
                proc.Set(fieldValues[i], fieldValues[i + 1]);
            }
        }

        public static void Set(this MProc proc, NameValueCollection form)
        {
            foreach (var key in form.AllKeys)
            {
                var value = form[key];
                if (key == "time_rand")
                {
                    continue;
                }
                if (value.IsNotNullEmpty())
                {
                    proc.Set(key.Replace("[]", ""), form[key]);
                }
            }
        }

        #endregion 参数为Object

        //#region 参数为String

        //public static MDataTable Select(this MProc proc, params string[] fieldValues)
        //{
        //    proc.Set(fieldValues);
        //    return proc.ExeMDataTable();
        //}

        //public static MDataTable Select<T>(this MProc proc,
        //    object outputParmName, out T output, params string[] fieldValues)
        //{
        //    proc.SetCustom(outputParmName, ParaType.OutPut);
        //    proc.Set(fieldValues);
        //    var dt = proc.ExeMDataTable();
        //    output = (T)proc.OutPutValue;
        //    return dt;
        //}

        //public static MDataTable Select(object procName, params string[] fieldValues)
        //{
        //    MDataTable dt;
        //    using (MProc proc = new MProc(procName))
        //    {
        //        dt = proc.Select(fieldValues);
        //    }
        //    return dt;
        //}

        //public static void ExeNoQuery(object procName, params string[] fieldValues)
        //{
        //    using (MProc proc = new MProc(procName))
        //    {
        //        proc.ExeNonQuery(fieldValues);
        //    }
        //}

        //public static void ExeNonQuery(this MProc proc, params string[] fieldValues)
        //{
        //    proc.Set(fieldValues);
        //    proc.ExeNonQuery();
        //}

        //private static void Set(this MProc proc, params string[] fieldValues)
        //{
        //    for (int i = 0; i < fieldValues.Length; i += 2)
        //    {
        //        proc.Set(fieldValues[i], fieldValues[i + 1]);
        //    }
        //}

        //#endregion 参数为String
    }
}