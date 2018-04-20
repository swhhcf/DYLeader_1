using System;
using System.Collections.Generic;
using Btc.NewCommon;
using MyMVC;
using System.Web;
using System.IO;
using CYQ.Data;
using CYQ.Data.Table;
using NPOI.SS.UserModel;
using Btc.Data;

// ReSharper disable All

namespace DyLeader
{
    public class AjaxExcel
    {
        [Action]
        public static string Import()
        {
            var context = HttpContext.Current;
            var file = context.Request.Files[0];
            var ext = Path.GetExtension(file.FileName).ToLower();
            if (ext != ".xls" && ext != ".xlsx")
            {
                return SJson.Error;
            }

            var workbook = file.ToWorkbook();
            if (workbook == null)
            {
                return SJson.Error;
            }

            return ToDataTable(workbook);
        }

        private static string ToDataTable(IWorkbook workbook)
        {
            var sheetCount = workbook.NumberOfSheets;
            if (sheetCount < 1)
            {
                return SJson.Error;
            }

            var sqls = new string[sheetCount];
            var sheetNames = new string[sheetCount];
            var dataTables = new MDataTable[sheetCount];
            var errorMsgList = new List<string>();
            var updateIdCardSqls = new List<string>();

            var dataCount = 0;
            for (int i = 0; i < sheetCount; i++)
            {
                var sheet = workbook.GetSheetAt(i);
                dataTables[i] = sheet.ToDataTable(out var tmpErrorMsgList);
                sheetNames[i] = sheet.SheetName;
                if (tmpErrorMsgList.Count > 0)
                {
                    errorMsgList.Add($"请检查表 {sheetNames[i]}：<br/>　{tmpErrorMsgList.ToArray().Join("　<br/>")}");
                }
                dataCount += dataTables[i].Rows.Count;
            }

            if (errorMsgList.Count > 0)
            {
                return SJson.GetError(errorMsgList.ToArray().Join("<br/>"));
            }

            using (var action = new MAction("SysTableFieldName"))
            {
                for (int i = 0; i < sheetCount; i++)
                {
                    var where = "SheetName".ToWhere(sheetNames[i]) + " and IsTable=0";
                    var dt = action.Select(where, "TableName, EnName, CnName");
                    sqls[i] = CreateSql(dataTables[i], dt);
                }
                var tableNames = action.Select("IsTable=1 and IsOther=1", "TableName")
                    .GetColumnItems<string>("TableName");
                foreach (var tableName in tableNames)
                {
                    var joinOnField = tableName == "FamilyMember" || tableName == "WorkExperience"
                        || tableName == "RewardPunish" || tableName == "AnnualAppraisal"
                    ? "t.Fullname1=v.Fullname and t.WorkUnit1=v.WorkUnit"
                    : "t.Fullname=v.Fullname and t.WorkUnit=v.WorkUnit";
                    updateIdCardSqls.Add("update t " +
                                         "set t.PersonalIdCard=v.PersonalIdCard," +
                                         " t.IsImport=0 " +
                                         $"from {tableName} t inner join VPersonal v on {joinOnField} " +
                                         "where IsImport=1");
                }
            }

            updateIdCardSqls.Add("update t set t.deptId=d.id,t.isImport=0 " +
                                 $"from Institutions t inner join SysDepartment d on t.workUnit=d.name " +
                                 $"where isImport=1");

            using (var proc = new MProc("select 1"))
            {
                proc.BeginTransation();
                foreach (var sql in sqls)
                {
                    if (sql.IsNullOrEmpty()) continue;
                    var index = sql.IndexOf("values(");
                    //if (index >= 0)
                    {
                        if (sql.ToLower().IndexOf("insert into addr") >= 0)
                        {
                            var tmpStr = sql.Substring(index, 40).Split(',')[1];
                            var tmpSql = "update addr set IsUsing=0 where personalIdCard=" + tmpStr;
                            proc.ResetProc(tmpSql);
                            proc.ExeNonQuery();
                        }
                        if (sql.ToLower().IndexOf("insert into politics") >= 0)
                        {
                            var tmpStr = sql.Substring(index, 40).Split(',')[1];
                            var tmpSql = "update politics set IsUsing=0 where personalIdCard=" + tmpStr;
                            proc.ResetProc(tmpSql);
                            proc.ExeNonQuery();
                        }
                        proc.ResetProc(sql);
                        try
                        {
                            proc.ExeNonQuery();
                        }
                        catch (Exception e)
                        {
                            var error = "";
                            if (e.Message.IndexOf("列不允许有 Null 值") >= 0)
                                error = "该数据行不允许有空值：";
                            if (e.Message.IndexOf("插入重复键") >= 0)
                                error = "该数据行在数据库已存在：";
                            errorMsgList.Add(error + $"{sql.Substring(index + 7)}");
                        }
                        if (sql.ToLower().IndexOf("insert into workexperience", StringComparison.Ordinal) >= 0)
                        {
                            UpdateDeptId(proc);
                        }
                    }
                }
                if (errorMsgList.Count > 0)
                {
                    proc.RollBack();
                    proc.EndTransation();
                    return SJson.GetError(errorMsgList.ToArray().Join("<br/>"));
                }

                foreach (var sql in updateIdCardSqls)
                {
                    proc.ResetProc(sql);
                    proc.ExeNonQuery();
                }

                proc.EndTransation();
            }
            return SJson.GetSuccess($"导入成功，共导入数据 {dataCount} 条。");
        }

        private static void UpdateDeptId(MProc proc)
        {
            var sql = "update w set w.DeptID=d.ID from WorkExperience w left join SysDepartment d on w.WorkUnit=d.name";
            proc.ResetProc(sql);
            try
            {
                proc.ExeNonQuery();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            sql = "update w set w.DeptID=d.ID,w.IsImport=0 from Institutions w left join SysDepartment d on w.WorkUnit=d.name and w.isImport=1";
            proc.ResetProc(sql);
            proc.ExeNonQuery();

            //sql = "update w set w.SectionID=d.ID from WorkExperience w " +
            //      "     left join VDeptAndSection d " +
            //      "on w.WorkUnit=d.Deptname and w.SectionName=d.SectionName";
            //proc.ResetProc(sql);
            //proc.ExeNonQuery();
        }

        private static string CreateSql(MDataTable dataSrc, MDataTable tableFieldShtTitleCompareSrc)
        {
            if (dataSrc == null)
            {
                return null;
            }

            const string idCardFieldName = "PersonalIdCard";
            var fieldCnNames = tableFieldShtTitleCompareSrc.GetColumnItems<string>(2);
            var sqls = new List<string>();
            var fieldNames = new List<string>();
            var values = new List<string>();
            var idCardValue = "";
            foreach (var row in dataSrc.Rows)
            {
                if (row[0] == null || row[0].Value.IsNullOrEmpty())
                {
                    continue;
                }
                var prevTableName = "";
                foreach (var cell in row)
                {
                    var index = fieldCnNames.IndexOf(cell.ColumnName);
                    if (index < 0)
                    {
                        continue;
                    }
                    if (cell.ColumnName == "身份证号")
                    {
                        idCardValue = cell.Value.ToString();
                    }
                    //fieldCnNames[index] = "";
                    var currTableName = tableFieldShtTitleCompareSrc.Rows[index]["TableName"].Value.ToString();
                    if (prevTableName != "" && currTableName != prevTableName)
                    {
                        if (fieldNames.IndexOf(idCardFieldName) < 0 && fieldNames.IndexOf("IdCard") < 0)
                        {
                            fieldNames.Add(idCardFieldName);
                            values.Add(idCardValue);
                        }

                        ToSql(sqls, fieldNames, values, prevTableName);
                        fieldNames = new List<string>();
                        values = new List<string>();
                    }
                    prevTableName = currTableName;
                    fieldNames.Add(tableFieldShtTitleCompareSrc.Rows[index]["EnName"].Value.ToString());
                    values.Add(cell.Value == null ? "isNullValue" : cell.Value.ToString());
                }
                if (fieldNames.IndexOf(idCardFieldName) < 0 && fieldNames.IndexOf("IdCard") < 0 && prevTableName != "Institutions")
                {
                    fieldNames.Add(idCardFieldName);
                    values.Add(idCardValue);
                }
                ToSql(sqls, fieldNames, values, prevTableName);
                fieldNames = new List<string>();
                values = new List<string>();
            }
            return sqls.Count > 0 ? sqls.ToArray().Join(" ") : null;
        }

        private static void ToSql(List<string> sqls, List<string> fieldNames, List<string> values, string prevTableName)
        {
            const string sqlTemplate = "insert into {0}({1}) values({2})";

            //var indexs = new List<int>();

            ////检查是否有空值
            //{
            //    if (values[i] == "isNullValue")
            //    {
            //        indexs.Add(i);
            //    }
            //}

            ////如果有空值，移除相应字段和值
            //for (int i = indexs.Count - 1; i >= 0; i++)
            //{
            //    values.RemoveAt(i);
            //    fieldNames.RemoveAt(i);
            //}

            if (prevTableName.IsNullOrEmpty() || fieldNames == null || fieldNames.Count < 1
                || values == null || values.Count < 1)
            {
                //sqls.Add(prevTableName);
                return;
            }

            var valueForSql = "'" + values.ToArray().Join("','") + "'";
            valueForSql = valueForSql.Replace("'isNullValue'", "null");
            sqls.Add(string.Format(sqlTemplate, prevTableName, fieldNames.ToArray().Join(","), valueForSql));
        }
    }
}