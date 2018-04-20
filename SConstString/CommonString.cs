using System;
using System.Configuration;

namespace Btc.NewCommon
{
    public class SString
    {
        /// <summary>
        /// 数据库连接字符串
        /// </summary>
        public static readonly string Conn =
            ConfigurationManager.ConnectionStrings["Conn"].ConnectionString;

        /// <summary>
        /// 随机字符串(从2016/1/20开始)
        /// </summary>
        public static string Rand
        {
            get
            {
                var dateTime = DateTime.Now;
                var start = new DateTime(2016, 1, 20, 0, 0, 0, dateTime.Kind);
                string rndString = (Convert.ToInt64((dateTime - start).TotalMilliseconds)).ToString();
                var rnd = new Random();
                rndString += rnd.Next();
                return rndString;
            }
        }

        /// <summary>
        /// 生成随机文件名。可以为guid或年月日加上随机数为文件名。默认以guid为文件名
        /// </summary>
        /// <param name="isGuid"></param>
        /// <param name="fileExt">文件扩展名，可带"."。默认扩展名为txt</param>
        /// <returns></returns>
        public static string GetFilename(bool isGuid = true, string fileExt = ".txt")
        {
            if (fileExt.IsNullOrEmpty())
            {
                fileExt = ".txt";
            }
            if (fileExt[0] != '.')
            {
                fileExt = '.' + fileExt;
            }
            string name;
            if (isGuid)
            {
                name = Guid.NewGuid().ToString();
            }
            else
            {
                var rd = new Random();
                var nowTime = DateTime.Now;
                name = nowTime.ToString("yyyyMMddHHmmss") +
                       rd.Next(1000, 1000000);
            }
            var newFileName = name + fileExt;
            return newFileName;
        }
    }
}