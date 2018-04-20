using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using CYQ.Data.Table;
using NPOI.SS.UserModel;
using Btc.NewCommon;
using NPOI.HSSF.UserModel;
using NPOI.XSSF.UserModel;

namespace Btc.NewCommon
{
    /// <summary>
    /// Excel表转成DataTable类
    /// </summary>
    public static class SDataTable
    {
        public static IWorkbook ToWorkbook(this HttpPostedFile file)
        {
            var stream = file.InputStream; //创建数据流对象
            IWorkbook workbook = null;
            try
            {
                workbook = WorkbookFactory.Create(stream);// HSSFWorkbook(stream);
            }
            catch (Exception)
            {
                return null;
            }
            return workbook;
        }

        /// <summary>
        /// 把工作簿中指定的工作表转为DataTable
        /// </summary>
        /// <param name="workbook"></param>
        /// <param name="shtName"></param>
        /// <param name="sheetIndex"></param>
        /// <param name="colNames"></param>
        /// <returns></returns>
        public static MDataTable ToDataTable(this IWorkbook workbook,
            string shtName = null, int sheetIndex = 0, string[] colNames = null)
        {
            var sheet = shtName.IsNullOrEmpty()
                ? workbook.GetSheetAt(sheetIndex)
                : workbook.GetSheet(shtName);

            return GetFrom(sheet, out var errorMsgList, colNames);
        }

        /// <summary>
        /// 从工作表中获取数据，转成DataTable
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="errorMsgList"></param>
        /// <param name="colNames"></param>
        /// <returns></returns>
        public static MDataTable GetFrom(ISheet sheet, out List<string> errorMsgList, string[] colNames = null)
        {
            errorMsgList = new List<string>();
            var dataTable = new MDataTable();
            int rowCount = sheet.LastRowNum;
            if (rowCount <= 0)
            {
                errorMsgList.Add("没有数据，请检查");
                return null;
            }
            var shtColName = sheet.GetRow(0);
            int colCount = 0;
            while (shtColName.GetCell(colCount) != null && shtColName.GetCell(colCount).StringCellValue != "")
            {
                colCount++;
            }
            for (int i = 0; i < colCount; i++)
            {
                dataTable.Columns.Add(i.ToString());
            }
            for (int i = 1; i < rowCount + 1; i++)
            {
                var shtRow = sheet.GetRow(i);
                var dataRow = new MDataRow(); // new object[rowCount];
                for (var j = 0; j < colCount; j++)
                {
                    var value = GetCellValue(shtRow.GetCell(j));
                    if (value == null)
                    {
                        errorMsgList.Add($"第 {i + 1} 行 第{j + 1}列 为公式，请修改。");
                    }
                    dataRow.Add(j.ToString(), value);
                    //dataRow[j] = shtRow.GetCell(j);
                }
                dataTable.Rows.Add(dataRow.GetItemValues());
            }
            SetDataTableColName(dataTable, shtColName, colNames, colCount);
            return dataTable;
        }

        private static string GetCellValue(ICell cell)
        {
            if (cell == null)
            {
                return "";
            }
            var value = "";
            switch (cell.CellType.ToLower())
            {
                case "string":
                    value = cell.StringCellValue;
                    break;

                case "date":
                    value = cell.DateCellValue.ToString();
                    break;

                case "boolean":
                    value = cell.BooleanCellValue ? "1" : "0";
                    break;

                case "numeric":
                    value = cell.NumericCellValue.ToString();
                    break;

                case "formula":
                    return null;

                default:
                    return cell.ToString();
            }

            switch (value)
            {
                case "男":
                case "是":
                case "奖励":
                    return "1";

                case "女":
                case "否":
                case "处分":
                    return "0";

                default:
                    return value;
            }
        }

        /// <summary>
        /// 工作表转成DataTable
        /// </summary>
        /// <param name="sheet"></param>
        /// <param name="errorMsgList"></param>
        /// <param name="colNames"></param>
        /// <returns></returns>
        public static MDataTable ToDataTable(this ISheet sheet, out List<string> errorMsgList, string[] colNames = null)
        {
            return GetFrom(sheet, out errorMsgList, colNames);
        }

        /// <summary>
        /// 设置数据表列名
        /// </summary>
        /// <param name="dataTable"></param>
        /// <param name="shtColName"></param>
        /// <param name="colNames"></param>
        /// <param name="colCount"></param>
        private static void SetDataTableColName(MDataTable dataTable,
            IRow shtColName, string[] colNames, int colCount)
        {
            if (colNames == null || colNames.Length < 1 || colNames.Length < colCount)
            {
                for (int i = 0; i < colCount; i++)
                {
                    dataTable.Columns[i].ColumnName = shtColName.GetCell(i).StringCellValue;
                }
            }
            else
            {
                for (int i = 0; i < colCount; i++)
                {
                    dataTable.Columns[i].ColumnName = colNames[i];
                }
            }
        }
    }
}