using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using MyMVC;
using CYQ.Data;
using Btc.NewCommon;
using Btc.Data;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace DyLeader
{
    public class AjaxUser
    {
        [Action]
        public static string Login(string username, string pwd)
        {
            var cookie = HttpContext.Current.Request.Cookies["login"];
            //if (cookie != null)
            //{
            //    return SJson.GetError("您已经登录，请退出登录。");
            //}
            if (SAction.Select("SysUser", "Username".ToWhere(username, false) + " and " + "Password".ToWhere(pwd, false), "ID").Rows.Count > 0)
            {
                if (cookie == null)
                {
                    cookie = new HttpCookie("login");
                }
                cookie.Values.Clear();
                cookie.Values.Add("username", username);
                HttpContext.Current.Response.Cookies.Clear();
                //cookie.Expires = DateTime.Now.AddHours(1);
                HttpContext.Current.Response.Cookies.Add(cookie);
                return SJson.Success;
            }
            return SJson.Error;
        }

        [Action]
        public static string Get()
        {
            var cookie = HttpContext.Current.Request.Cookies["login"];
            if (cookie == null || cookie.Values["username"].IsNullOrEmpty())
            {
                return SJson.Error;
            }
            return SJson.GetSuccess("username", cookie.Values["username"]);
        }

        [Action]
        public static string Logout()
        {
            var cookie = HttpContext.Current.Request.Cookies["login"];
            if (cookie == null)
            {
                return SJson.Success;
            }
            cookie.Values.Add("username", "");
            cookie.Expires = DateTime.Now.AddDays(-1);
            HttpContext.Current.Response.Cookies.Add(cookie);
            return SJson.Success;
        }
    }
}