namespace Btc.NewCommon
{
    /// <summary>
    /// 操作结果Json字符串类
    /// </summary>
    public class SJson
    {
        /// <summary>
        /// 不成功时返回的Json字符串
        /// </summary>
        public const string Error =
            "{\"success\":false}";

        /// <summary>
        /// 无数据时的Json字符串
        /// </summary>
        public const string Blank =
            "{\"rowcount\":0,\"total\":0,\"success\":true,\"rows\":[]}";

        /// <summary>
        /// 操作成功时返回的Json字符串
        /// </summary>
        public const string Success = "{\"success\":true}";

        /// <summary>
        /// 操作成功时Json字符串Head
        /// </summary>
        public const string SuccessHead = "{\"success\":true,";

        /// <summary>
        /// 获取导入订单的统计信息
        /// </summary>
        /// <param name="successCount">成功条数</param>
        /// <param name="errorCount">失败条数</param>
        /// <param name="body">最终信息</param>
        /// <returns></returns>
        public static string GetImportOrder(int successCount, int errorCount, string body)
        {
            return $"{{\"total\":{successCount + errorCount}," +
                   $"\"{nameof(successCount)}\":{successCount}," +
                   $"\"{nameof(errorCount)}\":{errorCount}," +
                   $"\"rows\":[{body}]}}";
        }

        /// <summary>
        /// 操作成功时返回相关成功信息的Json字符串
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="value">值</param>
        /// <returns></returns>
        public static string GetSuccess(string key, string value)
        {
            return GetInfo(key, value);
        }

        /// <summary>
        /// 操作成功时返回相关成功信息的Json字符串
        /// </summary>
        /// <param name="value">值</param>
        /// <returns></returns>
        public static string GetSuccess(string value)
        {
            return GetInfo("successMsg", value);
        }

        /// <summary>
        /// 操作失败时返回相关失败信息的Json字符串
        /// </summary>
        /// <param name="key">错误键</param>
        /// <param name="value">错误信息</param>
        /// <returns></returns>
        public static string GetError(string key, string value)
        {
            return GetInfo(key, value, isSuccess: false);
        }

        /// <summary>
        /// 操作失败时返回相关失败信息的Json字符串
        /// </summary>
        /// <param name="value">错误信息</param>
        /// <returns></returns>
        public static string GetError(string value)
        {
            return GetInfo("errorMsg", value, isSuccess: false);
        }

        /// <summary>
        /// 获取操作成功或失败的信息的Json字符串
        /// </summary>
        /// <param name="key">键</param>
        /// <param name="value">值</param>
        /// <param name="rows">结果json</param>
        /// <param name="isSuccess">是否为成功信息，默认为true</param>
        /// <returns></returns>
        public static string GetInfo(string key, string value, string rows = "[]", bool isSuccess = true)
        {
            return $"{{\"success\":{isSuccess.ToLower()},\"{key}\":\"{value}\",\"total\":0,\"rows\":{rows}}}";
        }
    }
}