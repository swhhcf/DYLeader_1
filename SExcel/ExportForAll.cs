using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Btc.NewCommon.Excel;
using CYQ.Data.Table;
using NPOI.SS.Formula.Functions;
using NPOI.SS.UserModel;

namespace Btc.NewCommon
{
    public class ExportExcel
    {
        /// <summary>
        /// 导出为 Excel 主方法
        /// </summary>
        /// <param name="classForExport">生成工作簿的类名</param>
        /// <param name="method">生成工作簿的方法名</param>
        public static void Main<T>(T classForExport, string method)
        {
            //通过反射调用相应方法
            IWorkbook workbook = null;
            var fileName = "";
            var type = typeof(T);
            try
            {
                //反射调用生成工作簿方法
                var methodInfo = type.GetMethod(method);
                var param = new object[] { "" };
                var fastInvoker = FastInvoke.GetMethodInvoker(methodInfo);
                workbook = (IWorkbook)fastInvoker(classForExport, param);
                var property = type.GetProperty("FileName");
                fileName = property != null
                    ? (string)property.GetValue(classForExport, null)
                    : "default";
            }
            catch (Exception e)
            {
                workbook = new MDataTable().ToWorkbook();
                fileName = e.Message;
            }

            WriteExcel(workbook, fileName);
        }

        public static void WriteExcel(IWorkbook workbook, string fileName)
        {
            //输出到客户端
            var response = HttpContext.Current.Response;
            response.Clear();
            if (workbook != null)
            {
                const string excelType = "application/vnd.ms-excel";
                response.ContentType = excelType;
                response.AddHeader("Content-Disposition", $"attachment;filename={fileName}.xls");
                using (var file = new MemoryStream())
                {
                    workbook.Write(file);
                    file.WriteTo(response.OutputStream);
                }
            }
            else
            {
                response.Write(SJson.GetError("请输入正确的参数。"));
            }
            response.Flush();
            response.End();
        }
    }
}