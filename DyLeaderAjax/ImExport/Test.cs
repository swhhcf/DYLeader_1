using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CYQ.Data;
using Btc.Data;
using Btc.NewCommon;
using MyMVC;

namespace DyLeader
{
    public class AjaxTest
    {
        [Action]
        public static string Get()
        {
            var template = "insert into Test(a,b,c,d,e) values({0},'{1}','{2}','{3}','{4}')";
            var sqls = new List<string>();
            sqls.Add(template.Format((object)"null", "2", "2", "3", "4"));
            sqls.Add(template.Format((object)"0", "1", "2", "3", "4"));
            sqls.Add(template.Format((object)"0", "1", "2", "3", "4"));
            var errors = new List<string>();
            using (var proc = new MProc("select 1"))
            {
                foreach (var sql in sqls)
                {
                    try
                    {
                        proc.ResetProc(sql);
                        proc.ExeNonQuery();
                    }
                    catch (Exception e)
                    {
                        errors.Add(e.Message);
                    }
                }
                return errors.ToArray().Join(" aaaaaa ");
            }

            return null;
        }
    }
}