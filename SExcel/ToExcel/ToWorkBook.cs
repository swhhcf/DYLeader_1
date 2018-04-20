using System;
using CYQ.Data.Table;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;

namespace Btc.NewCommon.Excel
{
    public static class Workbook
    {
        private static ICellStyle GetDateFormat(this IWorkbook workbook)
        {
            IDataFormat format = workbook.CreateDataFormat();
            ICellStyle cellStyle = workbook.CreateCellStyle();
            cellStyle.DataFormat = format.GetFormat("yyyy-mm-dd");
            return cellStyle;
        }

        private static ICellStyle DateFormat = null;

        public static IWorkbook ToWorkbook(this MDataTable[] dataTables)
        {
            IWorkbook workbook = new HSSFWorkbook();
            var index = 1;
            foreach (var dt in dataTables)
            {
                dt.ToWorkbook(index++);
            }
            return workbook;
        }

        public static IWorkbook ToWorkbook(this MDataTable dataTable, int index = 1, IWorkbook workbook = null)
        {
            workbook = workbook ?? new HSSFWorkbook();
            if (dataTable == null || dataTable.Rows.Count < 1)
            {
                var sht = workbook.CreateSheet("Sheet" + index);
                sht.CreateRow(0).CreateCell(0).SetCellValue("无数据，请检查查询条件后重试。");
            }
            CreateSheet(workbook, dataTable);
            return workbook;
        }

        private static void CreateSheet(IWorkbook workbook, MDataTable dataTable, string sheetName = null)
        {
            var newShtName = sheetName ?? dataTable.TableName;
            DateFormat = workbook.GetDateFormat();
            int shtCount = (dataTable.Rows.Count + 49999) / 50000;
            for (int i = 0; i < shtCount; i++)
            {
                ISheet sht = workbook.CreateSheet(newShtName + "_" + (i + 1));

                //写数据表头
                WriteSheetTitle(dataTable, sht);

                //写数据
                WriteToSheet(sht, dataTable, i * 50000, i * 50000 + 49999);
            }
        }

        /// <summary>
        /// 把MDataTable中的数据写入Excel表中
        /// </summary>
        /// <param name="sht">要写入数据的Sheet</param>
        /// <param name="dataTable">MDataTable</param>
        /// <param name="startRowIndex"></param>
        /// <param name="endRowIndex"></param>
        /// <param name="startColIndex"></param>
        private static void WriteToSheet(ISheet sht, MDataTable dataTable,
            int startRowIndex = 0, int endRowIndex = 50000, int startColIndex = 0)
        {
            endRowIndex = endRowIndex > dataTable.Rows.Count ? dataTable.Rows.Count : endRowIndex;
            int rowIndex = 1;
            for (int i = startRowIndex; i < endRowIndex; i++)
            {
                //创建行
                IRow xlsRow = sht.CreateRow(rowIndex++);

                //创建单元格
                int colIndex = 0;
                foreach (MDataCell cell in dataTable.Rows[i])
                {
                    CreateCell(xlsRow, colIndex++, cell.Value);
                }
            }
        }

        public static void GetFrom(this ISheet sheet, MDataTable dataTable, int startColIndex = 0)
        {
            WriteToSheet(sheet, dataTable, startColIndex: startColIndex);
        }

        /// <summary>
        /// 在Sheet的第一行写上列名
        /// </summary>
        /// <param name="table">MDataTable</param>
        /// <param name="sht">Excel Sheet</param>
        /// <returns></returns>
        private static void WriteSheetTitle(MDataTable table, ISheet sht)
        {
            IRow sheetHeadrow = sht.CreateRow(0);
            int colIndex = 0;
            foreach (var col in table.Columns)
            {
                sheetHeadrow.CreateCell(colIndex)
                    .SetCellValue(table.Columns[colIndex].ColumnName);
                colIndex++;
            }
        }

        /// <summary>
        /// 把值写入相应的Excel单元格中
        /// </summary>
        /// <param name="xlsRow">Excel表中的行</param>
        /// <param name="colIndex">列号（从0开始）</param>
        /// <param name="value">写入的值</param>
        private static void CreateCell(IRow xlsRow, int colIndex, object value)
        {
            ICell cell = xlsRow.CreateCell(colIndex);
            if (value == null || value.IsNullOrEmpty())
            {
                return;
            }
            string typeName = value.GetType().Name.ToLower();
            switch (typeName)
            {
                case "int":
                case "uint":
                case "int16":
                case "int32":
                case "float":
                case "short":
                case "ushort":
                case "byte":
                case "sbyte":
                case "double":
                case "decimal":
                case "long":
                case "ulong":
                case "int64":
                    cell.SetCellValue(Convert.ToDouble(value));
                    break;

                case "string":
                    cell.SetCellValue(value.ToString());
                    break;

                case "datetime":
                    cell.SetCellValue((DateTime)value);
                    cell.CellStyle = DateFormat;
                    break;

                case "bool":
                case "boolean":
                    cell.SetCellValue((bool)value);
                    break;

                default:
                    break;
            }
        }
    }
}