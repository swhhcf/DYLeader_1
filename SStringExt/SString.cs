using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Btc.NewCommon
{
    /// <summary>
    /// 方法扩展
    /// </summary>
    public static class SStringExtension
    {
        #region 字符串方法扩展

        /// <summary>
        /// 转为小写字符串
        /// </summary>
        /// <param name="b"></param>
        /// <returns></returns>
        public static string ToLower(this object b)
        {
            return b.ToString().ToLower();
        }

        /// <summary>
        /// 移除数字
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string RemoveNumber(this string key)
        {
            return Regex.Replace(key, @"\d", "");
        }

        /// <summary>
        /// 按字节数取左子字符串
        /// </summary>
        /// <param name="s"></param>
        /// <param name="length">长度</param>
        /// <returns></returns>
        public static string BSubstring(this string s, int length)
        {
            byte[] bytes = Encoding.Unicode.GetBytes(s);
            int n = 0; //  表示当前的字节数
            int i = 0; //  要截取的字节数
            for (; i < bytes.GetLength(0) && n < length; i++)
            {
                //  偶数位置，如0、2、4等，为UCS2编码中两个字节的第一个字节
                if (i % 2 != 0)
                {
                    //  当UCS2编码的第二个字节大于0时，该UCS2字符为汉字，一个汉字算两个字节
                    if (bytes[i] <= 0) continue;
                    n++;
                }
                else
                {
                    n++; //  在UCS2第一个字节时n加1
                }
            }
            //  如果i为奇数时，处理成偶数
            if (i % 2 != 1) return Encoding.Unicode.GetString(bytes, 0, i);
            //  该UCS2字符是汉字时，去掉这个截一半的汉字
            i = bytes[i] > 0 ? i - 1 : i + 1;
            return Encoding.Unicode.GetString(bytes, 0, i);
        }

        /// <summary>
        /// 替换字符串中的{0},{1}为相应的参数值
        /// </summary>
        /// <param name="s"></param>
        /// <param name="args">参数</param>
        /// <returns>字符串</returns>
        public static string Format(this string s, params object[] args)
        {
            return string.Format(s, args);
        }

        /// <summary>
        /// 判断是否为非空字符串
        /// </summary>
        /// <param name="s"></param>
        /// <returns>bool</returns>
        public static bool IsNotNullEmpty(this string s)
        {
            return !String.IsNullOrEmpty(s);
        }

        /// <summary>
        /// 用UTF-8编码对字符串进行解码
        /// </summary>
        /// <param name="s"></param>
        /// <returns>string</returns>
        public static string DecodeUTF8(this string s)
        {
            return HttpUtility.UrlDecode(s, Encoding.GetEncoding("UTF-8"));
        }

        /// <summary>
        /// 对字符串进行Url解码
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string DecodeURI(this string s)
        {
            return HttpUtility.UrlDecode(s);
        }

        /// <summary>
        /// 对字符串进行Url编码
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string EncodeURI(this string s)
        {
            return HttpUtility.UrlEncode(s);
        }

        /// <summary>
        /// 用UTF-8编码对字符串进行解码
        /// </summary>
        /// <param name="s"></param>
        /// <returns>string</returns>
        public static string EncodeUTF8(this string s)
        {
            return HttpUtility.UrlEncode(s, Encoding.GetEncoding("UTF-8"));
        }

        /// <summary>
        /// 在数组中查找给定值的索引号
        /// </summary>
        /// <param name="arr"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static int IndexOf(this Array arr, object value)
        {
            return Array.IndexOf(arr, value);
        }

        /// <summary>
        /// 为List添加元素。如果isDistinct为true时，不添加已有元素
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="arr"></param>
        /// <param name="value"></param>
        /// <param name="isDistinct"></param>
        public static void Add<T>(this List<T> arr, T value, bool isDistinct)
        {
            if (isDistinct)
            {
                if (arr.IndexOf(value) < 0)
                {
                    arr.Add(value);
                    return;
                }
            }
            arr.Add(value);
        }

        /// <summary>
        /// 把整数转为固定长度的字符串，如1转为0001
        /// </summary>
        /// <param name="i"></param>
        /// <param name="length"></param>
        /// <param name="prefix"></param>
        /// <returns></returns>
        public static string ToFixLongString(this int i, int length = 2, string prefix = "")
        {
            return prefix + string.Format($"{{0:D{length}}}", i);
        }

        /// <summary>
        /// 判断是否为空或Null字符串
        /// </summary>
        /// <param name="s"></param>
        /// <returns>bool</returns>
        public static bool IsNullOrEmpty(this string s)
        {
            return string.IsNullOrEmpty(s);
        }

        /// <summary>
        /// 判断是否为空或Null
        /// </summary>
        /// <param name="s"></param>
        /// <returns>bool</returns>
        public static bool IsNullOrEmpty(this object s)
        {
            return s == null || s.ToString() == "";
        }

        /// <summary>
        /// 用指定分隔符把字符串数组联结为字符串
        /// </summary>
        /// <param name="s"></param>
        /// <param name="seperator">分隔符</param>
        /// <returns></returns>
        public static string Join(this object[] s, string seperator)
        {
            return string.Join(seperator, s);
        }

        /// <summary>
        /// 用指定分隔符把字符串数组联结为字符串
        /// </summary>
        /// <param name="s"></param>
        /// <param name="seperator">分隔符</param>
        /// <returns></returns>
        public static string Join(this string[] s, string seperator)
        {
            return string.Join(seperator, s);
        }

        /// <summary>
        /// 从左侧取子字符串
        /// </summary>
        /// <param name="s"></param>
        /// <param name="length">长度</param>
        /// <returns>string</returns>
        public static string Left(this string s, int length)
        {
            if (s.IsNullOrEmpty())
            {
                return s;
            }
            if (length > s.Length)
            {
                return s;
            }
            return s.Substring(0, length);
        }

        /// <summary>
        /// 首字母小写
        /// </summary>
        /// <param name="s"></param>
        /// <returns>字符串</returns>
        public static string LowerFirst(this string s)
        {
            return s.Substring(0, 1).ToLower() + s.Substring(1);
        }

        /// <summary>
        /// 从右侧取子字符串
        /// </summary>
        /// <param name="s"></param>
        /// <param name="length">长度</param>
        /// <returns>string</returns>
        public static string Right(this string s, int length)
        {
            if (s.IsNullOrEmpty())
            {
                return s;
            }
            int start = s.Length - length;
            if (start < 0)
            {
                return s;
            }
            return s.Substring(s.Length - length);
        }

        /// <summary>
        /// 转化为32位整数，非数字型的返回0
        /// </summary>
        /// <param name="s"></param>
        /// <returns>int</returns>
        public static int ToInt(this object s)
        {
            if (s == null || s == DBNull.Value || s.ToString().IsNullOrEmpty())
            {
                return 0;
            }
            var result = 0;
            int.TryParse(s.ToString(), out result);
            return result;
        }

        /// <summary>
        /// 转化为32位整数，非数字型的返回0
        /// </summary>
        /// <param name="s"></param>
        /// <returns>int</returns>
        public static int ToInt(this bool s)
        {
            return s ? 1 : 0;
        }

        public static decimal ToDecimal(this object s)
        {
            if (s == null || s == DBNull.Value || s.ToString().IsNullOrEmpty())
            {
                return 0M;
            }
            var result = 0M;
            decimal.TryParse(s.ToString(), out result);
            return result;
        }

        /// <summary>
        /// 把字符串数组转换为Json格式的字符串
        /// </summary>
        /// <param name="s"></param>
        /// <param name="fieldName">字符串对应的属性或字段名，默认为id</param>
        /// <returns></returns>
        public static string ToJson(this string[] s, string fieldName = "id")
        {
            int len = s.Length;
            string[] jsons = new string[len];
            for (int i = 0; i < len; i++)
            {
                jsons[i] = "{\"" + fieldName + "\":\"" + s[i] + "\"}";
            }
            return "[" + String.Join(",", jsons) + "]";
        }

        /// <summary>
        /// 把整数数组转换为Json格式的字符串
        /// </summary>
        /// <param name="s"></param>
        /// <param name="fieldName">字符串对应的属性或字段名，默认为id</param>
        /// <returns></returns>
        public static string ToJson(this int[] s, string fieldName = "id")
        {
            int len = s.Length;
            string[] jsons = new string[len];
            for (int i = 0; i < len; i++)
            {
                jsons[i] = "{\"" + fieldName + "\":\"" + s[i] + "\"}";
            }
            return "[" + String.Join(",", jsons) + "]";
        }

        /// <summary>
        /// 把小数数组转换为Json格式的字符串
        /// </summary>
        /// <param name="s"></param>
        /// <param name="fieldName">字符串对应的属性或字段名，默认为id</param>
        /// <returns></returns>
        public static string ToJson(this decimal[] s, string fieldName = "id")
        {
            int len = s.Length;
            string[] jsons = new string[len];
            for (int i = 0; i < len; i++)
            {
                jsons[i] = "{\"" + fieldName + "\":\"" + s[i] + "\"}";
            }
            return "[" + String.Join(",", jsons) + "]";
        }

        /// <summary>
        /// 转化为长整型，非数字型的返回0
        /// </summary>
        /// <param name="s"></param>
        /// <returns>int</returns>
        public static long ToLong(this object s)
        {
            if (s == null || s == DBNull.Value || s.ToString().IsNullOrEmpty())
            {
                return 0;
            }
            var result = (long)0;
            var success = long.TryParse(s.ToString(), out result);
            return result;
        }

        public static string Md5(this string s, int code = 32)
        {
            var hashmd5 = new MD5CryptoServiceProvider();
            var result = BitConverter.ToString(
                hashmd5.ComputeHash(Encoding.Default.GetBytes(s)))
                .Replace("-", "").ToLower();//asp是小写,把所有字符变小写
            if (code == 16) //16位MD5加密（取32位加密的9~25字符）
            {
                return result.Substring(8, 16);
            }
            return result;
        }

        /// <summary>
        /// 把枚举Enum数组转换为字符串数组
        /// </summary>
        /// <param name="fields">枚举Enum数组</param>
        /// <returns>字符串数组</returns>
        public static string[] ToStrings(this Enum[] fields)
        {
            string[] strings = new string[fields.Length];
            for (int i = 0; i < fields.Length; i++)
            {
                strings[i] = fields[i].ToString();
            }
            return strings;
        }

        public static DateTime ToDate(this string s)
        {
            return Convert.ToDateTime(s);
        }

        /// <summary>
        /// 首字母大写
        /// </summary>
        /// <param name="s"></param>
        /// <returns>字符串</returns>
        public static string UpperFirst(this string s)
        {
            return s.Substring(0, 1).ToUpper() + s.Substring(1);
        }

        /// <summary>
        /// 判断是否为整数
        /// </summary>
        /// <param name="s"></param>
        /// <returns>bool</returns>
        internal static bool IsInt(this string s)
        {
            Regex r = new Regex("@^/d+$");
            return r.IsMatch(s);
        }

        #endregion 字符串方法扩展
    }
}