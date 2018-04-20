using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using Btc.NewCommon;
using MyMVC;
using Btc.Data;
using CYQ.Data;

namespace DyLeader
{
    public class AjaxMenu
    {
        [Action]
        public static string Get()
        {
            return SAction.Select("SysMenu", "Isusing=1").ToJson();
        }
    }
}