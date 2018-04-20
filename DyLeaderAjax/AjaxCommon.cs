using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using Btc.Data;
using Btc.NewCommon;
using Btc.NewCommon.Excel;
using MyMVC;
using CYQ.Data;
using CYQ.Data.Table;

namespace DyLeader
{
    public partial class AjaxMethod
    {
        [Action]
        public static string Get(string id, string table)
        {
            using (var action = new MAction(TableNames.SysTableRight))
            {
                var readCodes = action.GetOneValue<string>(SysTableRight.Tablename.ToWhere(table),
                    SysTableRight.ReadCodes);
                if (true)
                {
                    action.ResetTable(table);
                    return action.Select("id".ToWhere(id), "*").ToJson().Replace(" 00:00:00", "");
                }
            }
        }

        [Action]
        public static string GetList(string table, string deptId, string sectionId,
            string colName, NameValueCollection queryString)
        {
            var orderField = "Date";

            switch (table)
            {
                case "WorkExperience":
                case "EduExperience":
                case "DivisionWork":
                case "VDivisionWork":
                case "KeyProjectAndWork":
                case "TrainingLearning":
                    orderField = "StartDate";
                    break;

                case "Personal":
                case "Politics":
                case "MajorDegree":
                case "RewardPunish":
                case "AnnualAppraisal":
                case "FamilyMember":
                case "Addr":
                case "OrdinaryInspection":
                case "SpecialInspection":
                case "DemocraticEvaluation":
                case "DemocraticRecommendation":
                case "PatrolInspection":
                case "InspectorInspection":
                case "PostsAndStaffInspection":
                case "Institutions":
                case "VPersonal":
                case "VPolitics":
                case "VFamilyMember":
                case "SysDepartment":
                    orderField = "ID";
                    break;

                case "v_AgeStructure":
                case "v_EducationStructure":
                case "v_GenderStructure":
                case "v_LeaderStructure":
                case "v_MajorStructure":
                case "vvInstitutions":
                    orderField = "DeptId";
                    break;
            }
            using (var action = new MAction(table))
            {
                var where = queryString.RemoveKey("colName").ToWhere(out var page, out var pagesize);
                where += " and IsUsing=1 order by " + orderField;
                // where += "," + orderField;
                var result = table == "SysDepartment"
                    ? action.Select(where, "id, pId, name")
                    : action.Select(where, page, pagesize, "*");
                return GetResult(queryString, page, result, colName);
            }
        }

        [Action]
        public static string GetPersonalList(int? deptId, int? sectionId, string table,
            string colName, NameValueCollection queryString)
        {
            var isDate1 = DateTime.TryParse(queryString["StartDate"], out var startDate);
            var isDate2 = DateTime.TryParse(queryString["EndDate"], out var endDate);
            var noTrain = queryString["NoTrain"];

            if (!isDate1)
            {
                startDate = new DateTime(1900, 1, 1);
            }

            if (!isDate2)
            {
                endDate = new DateTime(9999, 12, 31);
            }

            var fieldName = "";
            switch (table)
            {
                case "VPersonal":// 个人信息
                    fieldName = "Birthday";
                    break;

                case "vvdivisionwork0"://分管工作
                case "vvdivisionwork1"://重点工程
                case "vvTrainLearn"://培训信息
                    fieldName = "StartDate";
                    break;

                case "vvInvestigate0"://平时考察
                case "vvInvestigate1"://专项考察
                case "vvInvestigate2"://年度考核
                case "vvInvestigate3"://民主测评
                case "vvInvestigate4"://民主推荐
                case "VPatrolInspection"://巡查巡察
                case "VPostsAndStaffInspection"://定岗定职
                case "vvinspection"://督查信息
                    fieldName = "Date";
                    break;
            }

            var collection = queryString.RemoveKey("deptId", "sectionId",
                "StartDate", "EndDate", "NoTrain", "colName");
            MDataTable result;
            if (table == "vvTrainLearn")
            {
                result = SProc.Select("S_SelectTrainLearn",
                    "StartDate", queryString["StartDate"],
                    "EndDate", queryString["EndDate"],
                    "NoTrain", noTrain,
                    "deptId", deptId);
                result.TableName = table;
            }
            else
            {
                using (var action = new MAction(table))
                {
                    var where = collection.ToWhere(out int page, out int pagesize, out string sort) +
                                $" and {fieldName} between '{startDate}' and '{endDate}'" +
                                " and (deptId like '" + (deptId ?? 0) + "%'" +
                                " or sectionId like '" + (sectionId ?? 0) + "%'" +
                                " or " + (deptId == 0 || deptId == null ? "1=1" : "1=0") + ")" +
                                sort;
                    result = action.Select(where, page, pagesize, "*");
                }
            }
            return GetResult(queryString, queryString["page"].ToInt(), result, colName);
        }

        /// <summary>
        /// 查询编制情况
        /// </summary>
        /// <param name="deptId"></param>
        /// <param name="table"></param>
        /// <param name="colName"></param>
        /// <param name="queryString"></param>
        /// <returns></returns>
        [Action]
        public static string GetIntitionList(int? deptId, string table,
            string colName, NameValueCollection queryString)
        {
            var collection = queryString.RemoveKey("deptId", "sectionId", "colName");
            using (var action = new MAction(table))
            {
                var where = collection.ToWhere(out int page, out int pagesize, out string sort) +
                            " and (deptId like '" + (deptId ?? 0) + "%'" +
                            //" or sectionId like '" + (sectionId ?? 0) + "%'" +
                            " or " + (deptId == 0 || deptId == null ? "1=1" : "1=0") + ")" +
                            sort;
                var result = action.Select(where, page, pagesize, "*");
                return GetResult(queryString, page, result, colName);
            }
        }

        [Action]
        public static string Save(NameValueCollection form, string table)
        {
            var result = SJson.Success;
            // using (var action = new MAction(TableNames.SysTableRight))
            using (var action = new MAction(TableNames.Personal))
            {
                //var readCodes = action.GetOneValue<string>(SysTableRight.Tablename.ToWhere(table),
                //    SysTableRight.ReadCodes);
                if (true)
                {
                    Log.WriteLogToTxt("insert " + table);
                    //Log.WriteLogToDB();
                    action.ResetTable(table);
                    var id = form["id"];
                    try
                    {
                        if (id.IsNotNullEmpty())
                        {
                            action.Update("id".ToWhere(id), form);
                        }
                        else
                        {
                            id = action.Insert(form);
                            result = id == "0" || id == "false"
                                ? SJson.GetError("请检查所有项目都填写没有。")
                                : SJson.GetSuccess("id", id);
                        }
                    }
                    catch (Exception e)
                    {
                        result = SJson.GetError("请检查所有项目都填写没有。");
                    }
                }
            }
            return result;
        }

        [Action]
        public static string Delete(string table, string id)
        {
            //SAction.Delete(table, "ID".ToWhere(id, false));
            SAction.Update(table, "ID".ToWhere(id, false), "IsUsing", "0");
            return SJson.Success;
        }

        private static string GetResult(NameValueCollection queryString,
            int page, MDataTable result, string colName)
        {
            if (page != 0 || queryString["page"].IsNullOrEmpty())
            {
                return result.ToJson().Replace(" 00:00:00", "");
            }

            //更改列名为中文名
            var colNames = colName.Split('~');
            var shouldRemoveColNames = new List<string>();
            foreach (var column in result.Columns)
            {
                var dtColName = column.ColumnName;
                var index = colNames.IndexOf(dtColName);
                if (index >= 0)
                {
                    column.ColumnName = colNames[index + 1];
                    continue;
                }
                shouldRemoveColNames.Add(dtColName);
            }

            //移除无需导出的列
            foreach (var removeColName in shouldRemoveColNames)
            {
                result.Columns.Remove(removeColName);
            }
            var tablename = result.TableName;
            var filename = SAction.GetOneValue<string>("SysTableFilename", "tablename".ToWhere(tablename), "Filename");

            filename = filename.IsNullOrEmpty() ? tablename : filename;
            var workbook = result.ToWorkbook();
            workbook.SetSheetName(0, filename);
            ExportExcel.WriteExcel(workbook, filename);
            return null;
        }
    }
}