using System;
using System.IO;
using System.Web;
using MyMVC;

namespace DyLeader
{
    public class AjaxPictrue
    {
        [Action]
        public static string Upload(string picname)
        {
            var picFile = HttpContext.Current.Request.Files[0];
            var srcPath = HttpRuntime.AppDomainAppPath;
            var destFolder = srcPath + @"Picture\";
            var fileExt = Path.GetExtension(picFile.FileName).ToLower();

            //过滤不可上传的文件类型
            if (".jpg|.jpeg".IndexOf(fileExt, StringComparison.Ordinal) <= -1)
            {
                return "0";
            }

            //判断文件大小
            var length = picFile.ContentLength;
            if (length > 204800)
            {
                return "1";
            }

            if (!Directory.Exists(destFolder))
            {
                Directory.CreateDirectory(destFolder);
            }

            if (string.IsNullOrEmpty(picname))
            {
                picname = "test";
            }
            var fileName = destFolder + picname + fileExt;
            if (File.Exists(fileName))
            {
                File.Delete(fileName);
            }
            picFile.SaveAs(fileName);
            return "2";
        }
    }
}