using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Btc.NewCommon;
using CYQ.Data.Table;
using Xceed.Words.NET;

namespace Btc.Word
{
    public static class Main
    {
        /// <summary>
        /// 用数据替换doc模板中的字符串
        /// </summary>
        /// <param name="docTemplate">docX对象（用已另存为的模板加载的）</param>
        /// <param name="dt">数据表</param>
        /// <param name="replaceValues">要替换的值。如：{"Gender", "1", "男", "0", "女"}</param>
        /// <param name="docRowCount">同一类数据在模板的行数（实际行数通常小于这个值）</param>
        public static void SetText(this DocX docTemplate, MDataTable dt, string[] replaceValues = null, int docRowCount = 1)
        {
            var rowCount = dt.Rows.Count;
            if (rowCount < 1)
            {
                return;
            }
            var tableName = dt.TableName;

            //单行数据
            if (dt.Rows.Count == 1 && docRowCount == 1)
            {
                var row = dt.Rows[0];
                ReplaceFromDataTable(docTemplate, row, replaceValues);
                return;
            }

            //多行数据，如工作简历等
            var index = 0;
            foreach (var row in dt.Rows)
            {
                ReplaceFromDataTable(docTemplate, row, replaceValues, index);
                index++;
            }
            var tmpRow = dt.Rows[0];
            for (int i = index; i < docRowCount; i++)
            {
                foreach (var cell in tmpRow)
                {
                    docTemplate.ReplaceText(tableName + "." + cell.ColumnName + i, "");
                }
            }
        }

        /// <summary>
        /// 用某行值替换相应的字符串（表名.字段名）
        /// </summary>
        /// <param name="docTemplate"></param>
        /// <param name="row"></param>
        /// <param name="replaceValues"></param>
        /// <param name="index"></param>
        private static void ReplaceFromDataTable(DocX docTemplate, MDataRow row, string[] replaceValues, int index = -1)
        {
            string strIndex = index < 0 ? "" : index.ToString();
            var tableName = row.TableName;
            foreach (var cell in row)
            {
                var value = cell.Value;
                var replaceValue = "";
                var colName = cell.ColumnName;
                if (value != null)
                {
                    replaceValue = value.GetType().Name.ToLower() == "datetime"
                        ? ((DateTime)value).ToString("yyyy年M月")
                        : value.ToString();
                }
                if (replaceValues != null)
                {
                    if (replaceValues[0] == colName)
                    {
                        var valueIndex = replaceValues.IndexOf(replaceValue);
                        replaceValue = replaceValues[valueIndex + 1];
                    }
                }
                docTemplate.ReplaceText(tableName + "." + cell.ColumnName + strIndex, replaceValue);
            }
        }

        /// <summary>
        /// 插入图片
        /// </summary>
        /// <param name="docTemplate">文档模板</param>
        /// <param name="tableIndex">表格序号（从0开始，下同）</param>
        /// <param name="rowIndex">行号</param>
        /// <param name="colIndex">列号</param>
        /// <param name="picPath">图片路径</param>
        public static void SetPicture(this DocX docTemplate, int tableIndex, int rowIndex, int colIndex, string picPath)
        {
            var image = docTemplate.AddImage(picPath);
            var picture = image.CreatePicture();
            picture.Width = 110;
            picture.Height = 147;//.InsertParagraph()
            docTemplate.Tables[tableIndex].Rows[rowIndex].Cells[colIndex].Paragraphs[0].AppendPicture(picture);
        }
    }
}